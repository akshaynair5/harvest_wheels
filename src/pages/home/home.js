import './home.scss'
import Sidebar from '../../components/sidebar/sidebar'
import linkLine from '../../images/linkLine.png'
import bg from '../../images/Background.png'
import pointer from '../../images/pointer.png'
import line from '../../images/Line.png'
import { useCallback, useContext, useEffect, useState } from 'react'
import { collection, query, updateDoc, where ,or,and, orderBy} from "firebase/firestore";
import { onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase_config'
import { getDocs, doc } from "firebase/firestore";
import { Authcontext } from '../../contextProvider'
import ReactMapGl from 'react-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import data from '../../in.json'

const TOKEN = process.env.API_ACCESS_TOKEN

function Home(){

    const userRef = collection(db,"users");
    const loadLinksRef = collection(db,"loadLinks");
    const {currentUser} = useContext(Authcontext);
    const [userData,setUD] = useState({});
    const [userLinksData,setULD] = useState([]);
    const [str,setStr] = useState("");
    const [space,setSpace] = useState();
    
    const [currentView,setCurrentView] = useState({});
    const [view,setView] = useState(false);
    const [currentCoords,setCoor] = useState({});
    const [windowWidth,setWindowWidth] = useState(window.innerWidth)


    useEffect(()=>{
            // console.log(data);
            const FetchUserData = async()=>{
                const q=query(userRef,where("uid","==",`${currentUser.uid}`))
                const querySnapShot1 = await getDocs(q)
                const temp = []
                try{
                    querySnapShot1.forEach((doc)=>{
                        temp.push(doc.data())
                    })
                    console.log(temp)
                    setUD(temp[0])
                }catch(err){
                    console.log("error: ",err)
                }
            }
            FetchUserData();
    },[])

    useEffect(()=>{
        if(userData && userData.links){
            const FetchUserData = async()=>{
                let fullStr = "";
                for(let i=0;i<userData.links.length;i++){
                    fullStr = fullStr + userData.links[i];
                }
                console.log(fullStr)
                const q = query(loadLinksRef, orderBy("time", "desc"));
                const querySnapShot1 = await getDocs(q);
                const temp = [];
                try{
                    querySnapShot1.forEach((doc)=>{
                        temp.push(doc.data())
                    })
                }catch(err){
                    console.log("error: ",err)
                }

                let final = [];
                for(let i=0;i<temp.length;i++){
                    console.log(temp[i])
                    if(fullStr.includes(temp[i].userId)){
                        final = [...final,temp[i]];
                    }
                }

                setULD(final)
                console.log(final);
            }
            FetchUserData();
        }
    },[userData])


    const viewMore = (obj,c)=>{
        setCurrentView(obj);
        setView(true);
        setCoor({lat:c.lat,lon:c.lng})
    }
    
    const bookSpace = async()=>{
        console.log(currentView);
        let temp = currentView.comments;
        let now = new Date().getTime()


        temp = [...temp,{uid:userData.uid,name:userData.displayName,profileURL:userData.profileUrl,space:space,price:space*currentView.price,status:false,commentId:now}];

        if(userData.profileUrl){
            console.log(temp)
            await updateDoc(doc(db, 'loadLinks', currentView.userId+currentView.time), {
                comments:temp
            });
        }

        setView(false)

    }

    useEffect(()=>{
        console.log(space)
    },[space])
    return(
        <div className='Home' style={{backgroundImage:`url(${bg})`}}>
            <Sidebar/>
            <div className='Main'>

                {
                    view && 
                    <div className='currentView'>
                        <button onClick={()=>{setView(false)}}>X</button>
                        <div className='viewContent'>
                            {
                                
                                <div className='map'>
                                    {/* <iframe width='100%' height='100%' src={`https://api.mapbox.com/styles/v1/akshaynair995/clvjqx0bm01af01qz39u11hnv.html?title=false&access_token=pk.eyJ1IjoiYWtzaGF5bmFpcjk5NSIsImEiOiJjbHZqcTM0ZmsxcGd5MnFwNWYwdWRkMjIyIn0.3VLRXtyCA0xprjZjInIj2w&zoomwheel=false#2/${currentCoords.lat}/${currentCoords.lon}`} title="Streets"></iframe> */}
                                </div>
                            }

                            <p className='desc'>
                                <p className='Title'><b>Description</b></p>
                                <p className='content'>{currentView.details}</p>
                            </p>
                            <p className='Title'><b>Trip Info</b></p>
                            <div className='info'>
                                <img src={pointer}></img>
                                <p>Start: {currentView.start}</p>
                            </div>
                            <div className='info'>
                                <img src={pointer}></img>
                                <p>Destination: {currentView.destination}</p>
                            </div>
                            <p className='Title'><b>Space Needed</b></p>
                            <div className='space'>
                                <p className='sn'>{space?space:0}</p>
                                <input
                                    type="range"
                                    min={0}
                                    max={currentView.spaceLeft}
                                    onChange={(e)=>{setSpace(e.target.value)}}
                                />
                                <p>{currentView.spaceLeft} m/s^2</p>
                            </div>

                            <input type='button' className='btn' onClick={()=>{bookSpace()}} placeholder='book' value='Book'></input>
                        </div>
                    </div>
                } 
 
                {
                    windowWidth < 768 &&
                    <div className='loadLinks'>
                    {
                        userLinksData.map((loadLink)=>{
                            if(loadLink.type == 'posting'){
                                let obj
                                for(let i=0;i<data.length;i++){
                                    if(data[i].city == `${loadLink.destination}`){
                                        obj = data[i];
                                    }
                                }
                                console.log(obj)

                                {/* console.log(lat) */}
                                return(
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

                                            {/* <iframe width='100%' height='100%' src={`https://api.mapbox.com/styles/v1/akshaynair995/clvjqx0bm01af01qz39u11hnv.html?title=false&access_token=pk.eyJ1IjoiYWtzaGF5bmFpcjk5NSIsImEiOiJjbHZqcTM0ZmsxcGd5MnFwNWYwdWRkMjIyIn0.3VLRXtyCA0xprjZjInIj2w&zoomwheel=false#2/${obj.lat}/${obj.lng}`} title="Streets"></iframe> */}
                                            
                                        </div>
                                        <div className='Details'>
                                            <p className='d1'><b>Date:</b> {loadLink.date}</p>
                                            <p className='d1'><b>Space Left:</b> {loadLink.spaceLeft}m/s^2</p>
                                        </div>
                                        <button className='bookBtn' onClick={()=>{viewMore(loadLink,obj)}}>Book Now:  ₹{loadLink.price}</button>
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
                }
                {
                    windowWidth >= 768 && 
                    <div className='loadLinks'>
                    {
                        userLinksData.map((loadLink)=>{
                            if(loadLink.type == 'posting'){
                                let obj
                                for(let i=0;i<data.length;i++){
                                    if(data[i].city == `${loadLink.destination}`){
                                        obj = data[i];
                                    }
                                }
                                console.log(obj)

                                {/* console.log(lat) */}
                                return(
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

                                            {/* <iframe width='100%' height='100%' src={`https://api.mapbox.com/styles/v1/akshaynair995/clvjqx0bm01af01qz39u11hnv.html?title=false&access_token=pk.eyJ1IjoiYWtzaGF5bmFpcjk5NSIsImEiOiJjbHZqcTM0ZmsxcGd5MnFwNWYwdWRkMjIyIn0.3VLRXtyCA0xprjZjInIj2w&zoomwheel=false#2/${obj.lat}/${obj.lng}`} title="Streets"></iframe> */}
                                            
                                        </div>
                                        <div className='Details'>
                                            <p className='d1'><b>Date:</b> {loadLink.date}</p>
                                            <p className='d1'><b>Space Left:</b> {loadLink.spaceLeft}m/s^2</p>
                                            <button className='bookBtn' onClick={()=>{viewMore(loadLink,obj)}}>Book Now:  ₹{loadLink.price}</button>
                                        </div>
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
                }
            </div>
        </div>
    )
}

export default Home;
