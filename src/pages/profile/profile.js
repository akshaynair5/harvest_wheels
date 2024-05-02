import { useCallback, useContext, useEffect, useState } from 'react'
import { collection, query, updateDoc, where ,or,and, addDoc} from "firebase/firestore";
import pointer from '../../images/pointer.png'
import line from '../../images/Line.png'
import { doc, setDoc, getDocs } from "firebase/firestore"; 
import { db } from '../../firebase_config';
import './profile.scss'
import { Authcontext } from '../../contextProvider';
import Sidebar from '../../components/sidebar/sidebar';
import bg from '../../images/Background.png'
import tick from '../../images/Checkmark.svg'
import cross from '../../images/cross.svg'
import data from '../../in.json'
import 'mapbox-gl/dist/mapbox-gl.css';

function Profile(){
    const {currentUser} = useContext(Authcontext)
    const [currentTrip,setCT] = useState()
    const [userData,setUD] = useState({});
    const [userLinks,setUL] = useState([]);
    const userRef = collection(db,"users");
    const userRef2 = collection(db,"loadLinks");

    const [type,setType] = useState('posting');
    const [from,setFrom] = useState('')
    const [to,setTo] = useState('')
    const [date,setDate] = useState('')
    const [desc,setDesc] = useState('')
    const [space,setSpace] = useState(0);
    const [currentComment,setCC] = useState();
    const [currentJourney,setCJ] = useState(); 

    const [addView,setAV] = useState(false)


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
            }catch(err){
                console.log("error: ",err)
            }
        }
        FetchUserData();
        const intervalId = setInterval(() => {
            if(currentJourney && currentJourney.currentPos){
                navigator.geolocation.getCurrentPosition(async (pos)=>{
                    await updateDoc(doc(db, 'loadLinks', currentJourney.userId+currentJourney.time), {  
                        currentPos:{lat:pos.coords.latitude,lon:pos.coords.longitude}
                    });
                })
                console.log('location updated!')
            }
        }, 2 * 60 * 1000);

        return () => clearInterval(intervalId);
    },[])

    useEffect(()=>{
        if(userData){
            const FetchUserData = async()=>{
                const q=query(userRef2,where("userId","==",`${currentUser.uid}`))
                const querySnapShot1 = await getDocs(q)
                const temp = [];
                let today = new Date();
                today.setHours(0, 0, 0, 0);
                try{
                    querySnapShot1.forEach((doc)=>{
                        let docDate = new Date(doc.data().date);

                        // Extract year, month, and day components from docDate
                        let docYear = docDate.getFullYear();
                        let docMonth = docDate.getMonth() + 1; // Month is 0-indexed, so add 1
                        let docDay = docDate.getDate();
                
                        // Extract year, month, and day components from today's date
                        let todayYear = today.getFullYear();
                        let todayMonth = today.getMonth() + 1; // Month is 0-indexed, so add 1
                        let todayDay = today.getDate();

                        temp.push(doc.data())
                        if (docYear === todayYear && docMonth === todayMonth && docDay === todayDay) {
                            setCJ(doc.data());
                            
                            console.log(doc.data());
                        }
                    })
                    setUL(temp)
                }catch(err){
                    console.log("error: ",err)
                }
            }
            FetchUserData();

            const FetchCurrentTrip = async()=>{
                const q=query(userRef2,where("time","==",userData.currentTrip))
                const querySnapShot1 = await getDocs(q)
                const temp = [];
                try{
                    querySnapShot1.forEach((doc)=>{
                        temp.push(doc.data())
                    })
                    setCT(temp[0])
                    console.log(temp)
                }catch(err){
                    console.log("error: ",err)
                }
            }
            FetchCurrentTrip();
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
        await fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${c.lat}%2C${c.lng}%3B${d.lat}%2C${d.lng}?alternatives=true&annotations=duration&geometries=geojson&language=en&overview=full&steps=true&access_token=pk.eyJ1IjoiYWtzaGF5bmFpcjk5NSIsImEiOiJjbHZqcTM0ZmsxcGd5MnFwNWYwdWRkMjIyIn0.3VLRXtyCA0xprjZjInIj2w`)
            .then((data)=>{
                console.log(data);
            })

        await setDoc(doc(db, "loadLinks", currentUser.uid+now), {
            userId:`${currentUser.uid}`,
            profileURL:`${userData.profileUrl}`,
            name:`${userData.displayName}`,
            type:`${type}`,
            start:`${from}`,
            destination:`${to}`,
            date:`${date}`,
            details:`${desc}`,
            spaceLeft:`${space}`,
            expiry:false,
            price:15,
            comments:[],
            time:now,
            currentPos:{lat:d.lat,lon:d.lng}
        }).then(()=>{
            console.log('done')
        });

        setAV(false)
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

        await updateDoc(doc(db, 'loadLinks', loadLink.userId+loadLink.time), {
            comments:temp,
            spaceLeft: newSpaceLeft
        });
    }



    return(
        <div className="profile" style={{backgroundImage:`url(${bg})`,backgroundSize:'cover'}}>
            <Sidebar/>

            {
                addView && 
                <div className='popUp'>
                    <div className='content'>
                        <button onClick={()=>{setAV(false)}} className='cancel'>X</button>
                        <select className='selectType' onChange={(e)=>{setType(e.target.value)}} style={{marginTop:'5vh',padding:'2vh'}}>
                            <option value='request'>Request</option>
                            <option value='posting'>Posting</option>
                        </select>
                        <input type='text' placeholder='from' onChange={(e)=>{setFrom(e.target.value)}}></input>
                        <input type='text' placeholder='To'  onChange={(e)=>{setTo(e.target.value)}}></input>
                        <input type='date' placeholder='Time'  onChange={(e)=>{setDate(e.target.value)}}></input>
                        <textarea placeholder='description'  onChange={(e)=>{setDesc(e.target.value)}}></textarea>
                        <input type='number' placeholder='Space left(M^2) Approx'  onChange={(e)=>{setSpace(e.target.value)}}></input>
                        <button onClick={()=>{onSubmit()}} className='submit'>Submit</button>
                    </div>
                </div>
            }
            <div className='topBar'>
                <div className='info'>
                    <img src={userData.profileUrl} className='profilePic'></img>
                    <p>{userData.displayName}</p>
                    <p>{userData.job}</p>
                </div>
                <button onClick={()=>{addInitializer()}} className='Add'>New Tweet +</button>

                <div className='map'>
                    {/* {
                        currentTrip && currentTrip.currentPos && 
                        <iframe width='100%' height='100%' src={`https://api.mapbox.com/styles/v1/akshaynair995/clvjqx0bm01af01qz39u11hnv.html?title=false&access_token=pk.eyJ1IjoiYWtzaGF5bmFpcjk5NSIsImEiOiJjbHZqcTM0ZmsxcGd5MnFwNWYwdWRkMjIyIn0.3VLRXtyCA0xprjZjInIj2w&zoomwheel=false#2/${currentTrip.currentPos.lat}/${currentTrip.currentPos.lon}`} title="Streets"></iframe>
                    } */}
                </div>


            </div>


            <div className='main'>
                <div className='loadLinks'>
                    {userLinks.length > 0 && 
                        userLinks.map((loadLink)=>{
                            if(loadLink.type == 'posting'){
                                return(
                                    <div className='ll' onClick={()=>{setCC(loadLink.time)}}>
                                        <div className='request'>
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
                                            <div className='map'>
                                                
                                            </div>
                                            <div className='Details'>
                                                <p className='d1'><b>Date:</b> {loadLink.date}</p>
                                                <p className='d1'><b>Space Left:</b> {loadLink.spaceLeft}m/s^2</p>
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