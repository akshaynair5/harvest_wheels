import { useCallback, useContext, useEffect, useState } from 'react'
import { collection, query, updateDoc, where ,or,and, addDoc} from "firebase/firestore";
import pointer from '../../images/pointer.png'
import line from '../../images/Line.png'
import { doc, setDoc, getDocs } from "firebase/firestore"; 
import { db, storage } from '../../firebase_config';
import './profile.scss'
import { Authcontext } from '../../contextProvider';
import Sidebar from '../../components/sidebar/sidebar';
import bg from '../../images/Background.png'
import tick from '../../images/Checkmark.svg'
import cross from '../../images/cross.svg'
import payment from '../../images/payment.png'
import data from '../../in.json'
// import 'mapbox-gl/dist/mapbox-gl.css';
import noResults from '../../images/no-results.png'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
const token = process.env.API_ACCESS_TOKEN;

function Profile(){
    const {currentUser} = useContext(Authcontext)
    const [currentTrip,setCT] = useState()
    const [userData,setUD] = useState({});
    const [userLinks,setUL] = useState([]);
    const userRef = collection(db,"users");
    const userRef2 = collection(db,"loadLinks");
    const [windowWidth,setWindowWidth] = useState(window.innerWidth)

    const [type,setType] = useState('posting');
    const [from,setFrom] = useState('')
    const [to,setTo] = useState('')
    const [date,setDate] = useState('')
    const [desc,setDesc] = useState('')
    const [space,setSpace] = useState(0);
    const [currentComment,setCC] = useState();
    const [currentJourney,setCJ] = useState();
    const [suggestions,setSuggestions] = useState([]); 
    const [suggAct,setsuggAct] = useState(false)
    const [suggestions2,setSuggestions2] = useState([]); 
    const [suggAct2,setsuggAct2] = useState(false)
    const [proofPopUp,setProofPopUp] = useState(false)
    const [completed,setCompleted] = useState()
    const [currentLoads,setCurrentLoads] = useState([])

    const [addView,setAV] = useState(false)
    const navigate = useNavigate();
    const [block,setBlock] = useState(false);


    useEffect(()=>{
        const FetchUserData = async()=>{
            const q=query(userRef,where("uid","==",`${currentUser.uid}`))
            const querySnapShot1 = await getDocs(q)
            const temp = [];
            try{
                querySnapShot1.forEach((doc)=>{
                    temp.push(doc.data())
                })
                setUD(temp[0])
                setBlock(temp[0].block);
            }catch(err){
                console.log("error: ",err)
            }
        }
        FetchUserData();
        const intervalId = setInterval(() => {
            let tolerance = 0.5;
            if(currentJourney && currentJourney.currentPos){
                navigator.geolocation.getCurrentPosition(async (pos)=>{
                    await updateDoc(doc(db, 'loadLinks', currentJourney.userId+currentJourney.time), {  
                        currentPos:{lat:pos.coords.latitude,lon:pos.coords.longitude}
                    });
                    console.log(100)
                    if(Math.abs(currentJourney.dlat - pos.coords.latitude) <= 0.5 && Math.abs(pos.coords.longitude - currentJourney.dlon) && currentJourney.status == 0){
                        // const id = new Date().getTime()
                        // let temp = userData.notifications;
                        console.log(10000)
                        setCompleted(currentJourney);
                        setProofPopUp(true);
                        arrived()
                    }
                })
                console.log('location updated!')
            }
        }, 2 * 60 * 1000);

        return () => clearInterval(intervalId);
    },[])

    const arrived = async ()=>{
        console.log(currentJourney);
        for(let i=0;i<currentJourney.loads.length;i++){
            const q=query(userRef,where("uid","==",`${currentJourney.loads[i].id}`))
            const querySnapShot1 = await getDocs(q)
            const temp = [];
            try{
                querySnapShot1.forEach((doc)=>{
                    temp.push(doc.data())
                })
            }catch(err){
                console.log("error: ",err)
            }
            const id = new Date().getTime();
            let noti = temp[0].notifications;
            let temp2 = currentJourney
            temp2.status = 1
            await updateDoc(doc(db, 'loadLinks', currentJourney.userId+currentJourney.time), {
                status:1
            });
            noti = [{uid:currentUser.uid,type:'payment-request',profileURL:userData.profileUrl,name:userData.displayName,id:id,price:currentJourney.loads[i].price,tripID:currentJourney.time,date:currentJourney.date},...noti]
            await updateDoc(doc(db, 'users', `${temp[0].uid}`), {  
                currentTrip:"",
                notifications:noti,
                proof:1,
            });
            let noti2 = userData.notifications
            noti2 = [{uid:temp[0].uid,type:'payment-approval',profileURL:temp[0].profileUrl,name:temp[0].displayName,id:id,price:currentJourney.loads[i].price,approved:false,date:currentJourney.date},...noti2]
            await updateDoc(doc(db, 'users', `${currentUser.uid}`), {  
                notifications:noti2
            });
        }
    }

    useEffect(()=>{
        if(userData && userData.job){
            const FetchUserData = async()=>{
                const q=query(userRef2,where("userId","==",`${currentUser.uid}`))
                const querySnapShot1 = await getDocs(q)
                const temp = [];
                let today = new Date();
                today.setHours(0, 0, 0, 0);
                try{
                    querySnapShot1.forEach((doc)=>{
                        temp.push(doc.data())
                    })
                    const today = new Date();
                    const todayFormatted = `${today.getFullYear()}-${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}`;
                    temp.forEach(loadLink => {
                        if (loadLink.date == todayFormatted) {
                            const FetchCurrentTrip = async()=>{
                                const q=query(userRef2,where("time","==",loadLink.time))
                                const querySnapShot1 = await getDocs(q)
                                const temp = [];
                                try{
                                    querySnapShot1.forEach((doc)=>{
                                        temp.push(doc.data())
                                    })
                                    setCJ(temp[0])
                                    console.log(temp[0])
                                }catch(err){
                                    console.log("error: ",err)
                                }
                            }
                            FetchCurrentTrip();
                        }
                    });
                    temp.sort((a, b) => b.time - a.time);
                    setUL(temp)
                }catch(err){
                    console.log("error: ",err)
                }
            }
            FetchUserData();

            if(userData.currentTrip != 0){
                const FetchCurrentTrip = async()=>{
                    const q=query(userRef2,where("time","==",userData.currentTrip))
                    const querySnapShot1 = await getDocs(q)
                    const temp = [];
                    try{
                        querySnapShot1.forEach((doc)=>{
                            temp.push(doc.data())
                        })
                        setCJ(temp[0])
                        if(userData.proof == 1) {
                            setProofPopUp(true)
                        }
                    }catch(err){
                        console.log("error: ",err)
                    }
                }
                FetchCurrentTrip();
            }
        }
    },[userData])

    const addInitializer = ()=>{
        setAV(true);

    }

    const onSubmit = async()=>{

        let now = new Date().getTime()
        let d;
        let c;
        for(let i=0;i<data.length;i++){
            if(data[i].city == `${to}`){
                d = data[i];
            }
        }
        for(let i=0;i<data.length;i++){
            if(data[i].city == `${from}`){
                c = data[i];
            }
        }
        let dist = 0;
        let dur = 0;
        await fetch(`https://api.distancematrix.ai/maps/api/distancematrix/json?origins=${c.lat},${c.lng}&destinations=${d.lat},${d.lng}&key=gZtZBs3OWT1f396HKrrqN8lNFMCAKqsTFlQHqQEEsXlnyJ9mrNWt3Pvdkc6msybo`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {

          dist = data.rows[0].elements[0].distance.value / 1000;
          dur = data.rows[0].elements[0].duration.value / (60 * 60);
          console.log(data.rows)

        })
        .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
        });
        const distanceFactor = 0.1;
        const durationFactor = 20;

        const price =  Math.floor(distanceFactor * dist + durationFactor * dur);

        
        await setDoc(doc(db, "loadLinks", `${currentUser.uid+now}`), {
            userId:`${currentUser.uid}`,
            profileURL:`${userData.profileUrl}`,
            name:`${userData.displayName}`,
            type:'posting',
            start:`${from}`,
            destination:`${to}`,
            dlat:d.lat,
            dlon:d.lng,
            date:`${date}`,
            details:`${desc}`,
            spaceLeft:`${space}`,
            expiry:false,
            price: price,
            comments:[],
            time:now,
            currentPos:{lat:c.lat,lon:c.lng},
            loads:[],
            proofOfArrival:'',
            status:0
        }).then(()=>{
            console.log('done')
            setAV(false)
            window.location.reload();
        });
    } 

    const onAccept = async (loadLink,c)=>{
        let temp = loadLink.comments;

        let newSpaceLeft = loadLink.spaceLeft - c.space - 1;

        for(let i=0;i<temp.length;i++){
            if(temp[i].commentId == c.commentId){
                temp.splice(i,1);
                break;
            }
        }

        let curT = `${loadLink.time}`;

        await updateDoc(doc(db, 'users', c.uid), {
            currentTrip:curT
        });
        let tempL = loadLink.loads;
        tempL = [{id:c.uid,name:`${c.name}`,profileURL:`${c.profileURL}`,space:`${c.space}`,price:c.price},...tempL]
        await updateDoc(doc(db, 'loadLinks', loadLink.userId+loadLink.time), {
            comments:temp,
            spaceLeft: newSpaceLeft,
            loads:tempL
        });
    }

    // useEffect(()=>{
    //     console.log(currentJourney);
    // },[currentJourney])

    const HandleTypeChange = (e)=>{
        setsuggAct(true)
        const value = e.target.value;
        setFrom(e.target.value);
        const filteredSuggestions = data.filter(item =>
          item.city.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(filteredSuggestions);
    }
    const HandleTypeChange2 = (e)=>{
        setsuggAct2(true)
        const value = e.target.value;
        setTo(e.target.value);
        const filteredSuggestions = data.filter(item =>
          item.city.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions2(filteredSuggestions);
    }

    const handleSetFrom = (suggestion)=>{
        setFrom(suggestion.city)
        setSuggestions([])
        setsuggAct(false)
    }

    const handleSetTo = (suggestion)=>{
        setTo(suggestion.city)
        setSuggestions2([])
        setsuggAct2(false)
    }

    const HandleProofSubmission = async(e)=>{
        e.preventDefault();
        const proof = e.target[0].files[0];
        const storageid = new Date().getTime()
        const storageRef = ref(storage,`${storageid}`)
        arrived();
        await uploadBytesResumable(storageRef,proof)
            .then(async ()=>{
                getDownloadURL(storageRef).then(async (downloadURL) => {
                    await updateDoc(doc(db, 'loadLinks', currentJourney.userId+currentJourney.time), {
                        proofOfArrival:`${downloadURL}`,
                    })
                    .then(async ()=>{
                        setProofPopUp(false);
                        await updateDoc(doc(db, 'users', `${currentUser.uid}`), {
                            proof:0
                        })
                    })
            })
        })

    }

    const viewLoads = (loadLink)=>{
        setCurrentLoads(loadLink.loads)
    }

    const removeSuggs = ()=>{
        setsuggAct2(false)
        setsuggAct(false)
    }

    return(
        <div className="profile" style={{backgroundImage:`url(${bg})`,backgroundSize:'cover'}}>
            <Sidebar/>
            {
                proofPopUp && currentJourney &&
                <div className='proofPopUp'>
                    <div className='main'>
                        <p>Please upload proof of Completion of trip - {currentJourney.start} - {currentJourney.destination} on {currentJourney.date}</p>
                        <form onSubmit={(e)=>{HandleProofSubmission(e)}} className='form'>
                            <input type='file' placeholder='Submit Proof' className='drop-container'></input>
                            <button type='submit' className='btn'>Submit</button>
                        </form>
                    </div>
                </div>
            }
            {
                currentLoads.length > 0 &&
                <div className='currentLoads' onClick={()=>{setCurrentLoads([])}}>
                    <div className='main'>
                        {
                            currentLoads.map((load)=>(
                                <div className='load'>
                                    <img src={load.profileURL}></img>
                                    <p>{load.name}</p>
                                    <p>{load.price}</p>
                                    <p>{load.time}</p>
                                </div>
                            ))
                        }
                    </div>
                </div>
            }

            {
                addView && 
                <div className='popUp'>
                    <div className='content' onClick={()=>{removeSuggs()}}>
                        {
                            block == false && 
                            <>
                                <input type='text' placeholder='from' onChange={(e)=>{HandleTypeChange(e)}} value={from}></input>
                                {
                                    suggestions.length > 0 && from.length > 0 && suggAct &&
                                    <div className='suggestions' style={{marginTop:'11vh'}}>
                                        {suggestions.map(suggestion => (
                                            <p key={suggestion.city} onClick={(e)=>{handleSetFrom(suggestion)}}>{suggestion.city}</p>
                                        ))}
                                    </div>
                                }
                                {
                                    from.length > 0 && suggestions.length == 0 && suggAct &&
                                    <div className='suggestions' style={{marginTop:'11vh'}}>
                                        <p>Sorry no Results found!!</p>
                                    </div>
                                }

                                <input type='text' placeholder='To'  onChange={(e)=>{HandleTypeChange2(e)}} value={to}></input>
                                {
                                    suggestions2.length > 0 && to.length > 0 && suggAct2 &&
                                    <div className='suggestions' style={{marginTop:'22vh'}}>
                                        {suggestions2.map(suggestion => (
                                            <p key={suggestion.city} onClick={(e)=>{handleSetTo(suggestion)}}>{suggestion.city}</p>
                                        ))}
                                    </div>
                                }
                                {
                                    to.length > 0 && suggestions2.length == 0 && suggAct2 &&
                                    <div className='suggestions' style={{marginTop:'22vh'}}>
                                        <p>Sorry no Results found!!</p>
                                    </div>
                                }
                                <input type='date' placeholder='Time'  onChange={(e)=>{setDate(e.target.value)}}></input>
                                <input placeholder='description'  onChange={(e)=>{setDesc(e.target.value)}}></input>
                                <input type='number' placeholder='Space left(M^2) Approx'  onChange={(e)=>{setSpace(e.target.value)}}></input>
                                <div className='btns'>
                                    <button onClick={() => { setAV(false) }}>Close</button>
                                    {
                                        desc === '' || from === '' || to === '' || date === '' || space === 0 || from === to || block === true || 
                                        new Date(date).getTime() < new Date().getTime() || 
                                        new Date(date).getTime() > new Date().getTime() + 5 * 24 * 60 * 60 * 1000 ?
                                        <button disabled>Post</button> : 
                                        <button onClick={() => { onSubmit() }}>Post</button>
                                    }
                                </div>
                            </>
                        }
                        {
                                block == true && 
                                <div className='Alert'>
                                    <img src={payment}></img>
                                    <p>Please settle all pending travel payments before booking another transportation service. You can view and pay your pending balances on the Notifications page</p>
                                    <div className='btns'>
                                        <button onClick={()=>{setAV(false)}}>Close</button>
                                        <button onClick={()=>{navigate('/notifications')}}>Pay</button>
                                    </div>
                                </div>
                        }
                    </div>
                </div>
            }
            <div className='topBar'>
                <div className='info'>
                    <img src={userData.profileUrl} className='profilePic'></img>
                    <div className='details'>
                        <p className='name'>{userData.displayName}</p>
                        <p>{userData.job}</p>
                    </div>
                </div>
                <button onClick={()=>{addInitializer()}} className='Add'>New Post +</button>

                {
                    currentJourney && currentJourney.currentPos &&
                    <div className='map'>
                        {
                            currentJourney && currentJourney.currentPos && 
                            <iframe width='100%' height='100%' src={`https://api.mapbox.com/styles/v1/akshaynair995/clvjqx0bm01af01qz39u11hnv.html?title=false&access_token=pk.eyJ1IjoiYWtzaGF5bmFpcjk5NSIsImEiOiJjbHZqcTM0ZmsxcGd5MnFwNWYwdWRkMjIyIn0.3VLRXtyCA0xprjZjInIj2w&zoomwheel=false#2/${currentJourney.currentPos.lat}/${currentJourney.currentPos.lon}`} title="Streets"></iframe>
                        }
                    </div>
                }


            </div>


            <div className='main'>
                <div className='loadLinks'>
                    {
                        userLinks.length == 0 && 
                            <div className='disclaimer'>
                                <img src={noResults}></img>
                                <p>Your postings section is currently empty. Once you create travel posts, updates and booking details will appear here.</p>
                            </div>
                    }
                    {userLinks.length > 0 && windowWidth < 768 && 
                        userLinks.map((loadLink)=>{
                            if(loadLink.type == 'posting'){
                                let obj
                                for(let i=0;i<data.length;i++){
                                    if(data[i].city == `${loadLink.destination}`){
                                        obj = data[i];
                                    }
                                }
                                return(
                                    <div className='ll' onClick={()=>{setCC(loadLink.time)}}>
                                        <div className='request'>
                                        <div className='r1'>
                                            <div className='userInfo'>
                                                <p className='name'>{loadLink.name}</p>
                                                <img src={loadLink.profileURL}></img>
                                            </div>
                                            <div className='travelInfo'>
                                                <img src={line} className='line'></img>
                                                <div className='info'>
                                                    <img src={pointer}></img>
                                                    <p>{loadLink.start}</p>
                                                </div>
                                                <div className='info'>
                                                    <img src={pointer}></img>
                                                    <p>{loadLink.destination}</p>
                                                </div>
                                            </div>
                                        </div>
                                        {
                                            obj && 
                                            <div className='map'>
                                                {/* <ReactMapGl
                                                    mapboxAccessToken = {TOKEN}
                                                    initailViewState={{
                                                        longitude:28.6448,
                                                        latitude:78.004,
                                                        zoom:6
                                                    }}
                                                    mapStyle = "https://api.mapbox.com/styles/v1/akshaynair995/clvjqx0bm01af01qz39u11hnv.html?title=view&access_token=pk.eyJ1IjoiYWtzaGF5bmFpcjk5NSIsImEiOiJjbHZqcTM0ZmsxcGd5MnFwNWYwdWRkMjIyIn0.3VLRXtyCA0xprjZjInIj2w&zoomwheel=true&fresh=true#2/37.75/-92.25"

                                                >

                                                </ReactMapGl> */}

                                                <iframe width='100%' height='100%' src={`https://api.mapbox.com/styles/v1/akshaynair995/clvjqx0bm01af01qz39u11hnv.html?title=false&access_token=pk.eyJ1IjoiYWtzaGF5bmFpcjk5NSIsImEiOiJjbHZqcTM0ZmsxcGd5MnFwNWYwdWRkMjIyIn0.3VLRXtyCA0xprjZjInIj2w&zoomwheel=false#2/${obj.lat}/${obj.lng}`} title="Streets"></iframe>
                                                
                                            </div>
                                        }
                                        <div className='Details'>
                                            <p className='d1'><b>Date:</b> {loadLink.date}</p>
                                            <p className='d1'><b>Space Left:</b> {loadLink.spaceLeft}m/s^2</p>
                                            <input type='button' className='bookBtn' onClick={()=>{viewLoads(loadLink)}} placeholder='View Loads' value='View Loads'></input>
                                        </div>
                                        </div>
                                        {
                                            currentComment == loadLink.time && 
                                            <div className='comments'>
                                                {
                                                    loadLink.comments.map((c)=>(
                                                        <div className='comment'>
                                                            <div className='userInfo'>
                                                                <p className='name'>{c.name}</p>
                                                                <img src={c.profileURL}></img>
                                                            </div>
                                                            <div className='price'>
                                                                Offered Price : ₹{c.price}
                                                            </div>

                                                            <div className='btns'>
                                                                <img src={tick} onClick={()=>{onAccept(loadLink,c)}}></img>
                                                                <img src={cross}></img>
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        }
                                    </div>
                                )
                            }
                            else{
                                return(
                                    <div className='proposal'>
                                        <p>Start: {loadLink.start}</p>
                                        <p>destination: {loadLink.destination}</p>
                                        <p>date {loadLink.date}</p>
                                        <p>Details {loadLink.details}</p>
                                    </div>
                                )
                            }
                        })
                    }
                    {userLinks.length > 0 && windowWidth > 768 &&
                        userLinks.map((loadLink)=>{
                            if(loadLink.type == 'posting'){
                                let obj
                                for(let i=0;i<data.length;i++){
                                    if(data[i].city == `${loadLink.destination}`){
                                        obj = data[i];
                                    }
                                }
                                return(
                                    <div className='ll' onClick={()=>{setCC(loadLink.time)}}>
                                        <div className='request'>
                                            <div className='userInfo'>
                                                <p className='name'>{loadLink.name}</p>
                                                <img src={loadLink.profileURL}></img>
                                            </div>
                                            <div className='travelInfo'>
                                                {/* <img src={line} className='line'></img> */}
                                                <div className='info'>
                                                    <img src={pointer}></img>
                                                    <p>{loadLink.start}</p>
                                                </div>
                                                <div className='info'>
                                                    <img src={pointer}></img>
                                                    <p>{loadLink.destination}</p>
                                                </div>
                                            </div>
                                            <div className='map'>
                                                <iframe width='100%' height='100%' src={`https://api.mapbox.com/styles/v1/akshaynair995/clvjqx0bm01af01qz39u11hnv.html?title=false&access_token=pk.eyJ1IjoiYWtzaGF5bmFpcjk5NSIsImEiOiJjbHZqcTM0ZmsxcGd5MnFwNWYwdWRkMjIyIn0.3VLRXtyCA0xprjZjInIj2w&zoomwheel=false#2/${obj.lat}/${obj.lng}`} title="Streets"></iframe>
                                            </div>
                                            <div className='Details'>
                                                <p className='d1'><b>Date:</b> {loadLink.date}</p>
                                                <p className='d1'><b>Space Left:</b> {loadLink.spaceLeft}m/s^2</p>
                                                <input type='button' className='bookBtn' onClick={()=>{viewLoads(loadLink)}} placeholder='View Loads' value='View Loads'></input>
                                            </div>
                                        </div>
                                        {
                                            currentComment == loadLink.time && 
                                            <div className='comments'>
                                                {
                                                    loadLink.comments.map((c)=>(
                                                        <div className='comment'>
                                                            <div className='userInfo'>
                                                                <p className='name'>{c.name}</p>
                                                                <img src={c.profileURL}></img>
                                                            </div>
                                                            <div className='price'>
                                                                Offered Price : ₹{c.price}
                                                            </div>

                                                            <div className='btns'>
                                                                <img src={tick} onClick={()=>{onAccept(loadLink,c)}}></img>
                                                                <img src={cross}></img>
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        }
                                    </div>
                                )
                            }
                            else{
                                return(
                                    <div className='proposal'>
                                        <p>Start: {loadLink.start}</p>
                                        <p>destination: {loadLink.destination}</p>
                                        <p>date {loadLink.date}</p>
                                        <p>Details {loadLink.details}</p>
                                    </div>
                                )
                            }
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default Profile;