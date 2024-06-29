import './explore.scss';
import Sidebar from '../../components/sidebar/sidebar'
import linkLine from '../../images/linkLine.png'
import bg from '../../images/Background.png'
import pointer from '../../images/pointer.png'
import line from '../../images/Line.png'
import { useCallback, useContext, useEffect, useState } from 'react'
import { collection, query, updateDoc, where ,or,and} from "firebase/firestore";
import { onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase_config'
import { getDocs, doc } from "firebase/firestore";
import { Authcontext } from '../../contextProvider'
import { storage } from "../../firebase_config";
import { getDownloadURL } from "firebase/storage";

import Fuse from 'fuse.js'
import data from '../../in.json'

function Explore (){

    const userRef = collection(db,"users");
    const loadLinksRef = collection(db,"loadLinks");
    const {currentUser} = useContext(Authcontext);
    const [userData,setUD] = useState({});
    const [allData,setAD] = useState([])
    const [search,setSearch] = useState('');
    const [searchRes,setSearchRes] = useState([]);
    const [windowWidth,setWindowWidth] = useState(window.innerWidth)
    const [space,setSpace] = useState();
    const [currentCoords,setCoor] = useState({});

    const [currentView,setCurrentView] = useState({});
    const [view,setView] = useState(false);
    const [view2,setView2] = useState(false);
    const [currentFriend,setCurrentFriend] = useState('');

    // const obj =  [
    //     {
    //         userId:'b4oxnn4Gv7XTUuTB4s8i7ui7h3G2"',
    //         profileURL:'https://firebasestorage.googleapis.com/v0/b/harvest-wheels.appspot.com/o/1709743834705?alt=media&token=8c67be27-a5f4-41e0-b790-afe8984393bd',
    //         name:'Akshay',
    //         type:'request',
    //         start:'pune',
    //         destination:'thane',
    //         date:'16/08/2024',
    //         details:'I have 2m^2 of space left in my vehicle',
    //         spaceLeft:5,
    //         expiry:false,
    //         price:5,
    //         reply:{
    //             type:[
    //                 {
    //                     replyUserId:"b4oxnn4Gv7XTUuTB4s8i7ui7h3G2",
    //                     replyMessage:'Intrested',
    //                     space:6,
    //                     price:500
    //                 }
    //             ]
    //         }
    //     }
    // ]


    useEffect(()=>{
            const FetchUserData = async()=>{
                const q=query(userRef,where("uid","==",`${currentUser.uid}`))
                const querySnapShot1 = await getDocs(q)
                const temp = []
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
    },[])

    useEffect(()=>{
        if(userData && userData.links){
            const FetchUserData = async()=>{
                const q=query(loadLinksRef,where("userId","!=",`${currentUser.uid}`))
                const querySnapShot1 = await getDocs(q)
                const temp = [];
                try{
                    querySnapShot1.forEach((doc)=>{
                        temp.push(doc.data())
                    })
                    setAD(temp);
                }catch(err){
                    console.log("error: ",err)
                }

            }
            FetchUserData();
        }
    },[userData])



    const sendRequestIntiator = (uid) =>{
        setView2(true)
        setCurrentFriend(uid)

        console.log('sent!!')
    } 
    const sendRequest = async() =>{
        const temp = [];
        const FetchUserData = async()=>{
            const q=query(userRef,where("uid","==",`${currentFriend.userId}`))
            const querySnapShot1 = await getDocs(q)
            try{
                querySnapShot1.forEach((doc)=>{
                    temp.push(doc.data())
                })
                console.log(temp[0])
            }catch(err){
                console.log("error: ",err)
            }

        }
        FetchUserData()
            .then(async ()=>{
                let temp1 = temp[0].notifications
                const id = new Date().getTime()

                temp1 = [...temp1,{uid:currentUser.uid,type:'friend-request',profileUrl:userData.profileUrl,name:userData.displayName,id:id}]

                await updateDoc(doc(db, 'users', currentFriend.userId), {
                    notifications: temp1,
                });
            })

        setView2(false)
    }
    // const sendRequest = async()=>{
        // const temp = [];
        // const FetchUserData = async()=>{
        //     const q=query(userRef,where("uid","==",`${currentFriend.userId}`))
        //     const querySnapShot1 = await getDocs(q)
        //     try{
        //         querySnapShot1.forEach((doc)=>{
        //             temp.push(doc.data())
        //         })
        //         console.log(temp[0])
        //     }catch(err){
        //         console.log("error: ",err)
        //     }

        // }
        // FetchUserData()
    //         .then(async ()=>{
    //             let temp1 = userData.links;
    //             let temp2 = temp[0].links;
        
    //             console.log(temp[0].links)
        
    //             temp1 = [...temp1,temp[0].uid];
    //             temp2 = [...temp2,currentUser.uid];
    
                // await updateDoc(doc(db, 'users', currentUser.uid), {
                //     links: temp1,
                // });
    //             await updateDoc(doc(db, 'users', currentFriend.userId), {
    //                 links: temp2,
    //             });
    //             setView2(false);
    //         })
    // }

    useEffect(()=>{
        if(search != ''){
            console.log('content');
            const fuseOptions = {
                keys: ['start','destination'], // Specify the keys to search within
                threshold: 0.4, // Set the threshold for fuzzy matching
            };
            const fuse = new Fuse(allData, fuseOptions);
            const searchResults = fuse.search(`${search}`);
            console.log(searchResults)
            let temp = []
            if(searchResults){
                for(let i=0;i<searchResults.length;i++){
                    temp = [...temp,searchResults[i].item];
                }
            }
            setSearchRes(temp);
        }
    },[search])

    const viewMore = (obj,c)=>{
        setCurrentView(obj);
        setView(true);
        setCoor({lat:c.lat,lon:c.lng})
    }
    
    const bookSpace = async ()=>{
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

    return (
        <div className='explore'>
            <Sidebar/>

            <div className='Main'>

            {
                    view && 
                    <div className='currentView'>
                        <button onClick={()=>{setView(false)}}>X</button>
                        <div className='viewContent'>
                            {/* {
                                
                                <div className='map'>
                                    <iframe width='100%' height='100%' src={`https://api.mapbox.com/styles/v1/akshaynair995/clvjqx0bm01af01qz39u11hnv.html?title=false&access_token=pk.eyJ1IjoiYWtzaGF5bmFpcjk5NSIsImEiOiJjbHZqcTM0ZmsxcGd5MnFwNWYwdWRkMjIyIn0.3VLRXtyCA0xprjZjInIj2w&zoomwheel=false#2/${currentCoords.lat}/${currentCoords.lon}`} title="Streets"></iframe>
                                </div>
                            } */}

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

                <div className='loadLinks'>
                    <div className='sr'>
                        <input className='search' type='text' placeholder='Search' onChange={(e)=>{setSearch(e.target.value)}}></input>
                    </div>
                    {allData.length > 0 && search == '' && windowWidth > 768 && 
                        allData.map((loadLink)=>{
                            if(loadLink.type == 'posting'){
                                let obj
                                for(let i=0;i<data.length;i++){
                                    if(data[i].city == `${loadLink.destination}`){
                                        obj = data[i];
                                    }
                                }
                                return(
                                    <div className='request'>
                                        {
                                            view2 && currentFriend.userId == loadLink.userId && currentFriend.id == loadLink.time &&
                                                <div className='friendReq'>
                                                    <button onClick={()=>{sendRequest()}}>Send Link Request</button>
                                                    <button onClick={()=>{setCurrentFriend({})}}>Close</button>
                                                </div>
                                        }  
                                        <div className='userInfo' onClick={()=>{sendRequestIntiator({userId:loadLink.userId,id:loadLink.time})}}>
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
                                        {/* <div className='map'>
                                            <iframe width='100%' height='100%' src={`https://api.mapbox.com/styles/v1/akshaynair995/clvjqx0bm01af01qz39u11hnv.html?title=false&access_token=pk.eyJ1IjoiYWtzaGF5bmFpcjk5NSIsImEiOiJjbHZqcTM0ZmsxcGd5MnFwNWYwdWRkMjIyIn0.3VLRXtyCA0xprjZjInIj2w&zoomwheel=false#2/${obj.lat}/${obj.lng}`} title="Streets"></iframe>
                                        </div> */}
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
                    {searchRes.length > 0 && search != '' && windowWidth > 768 && 
                        searchRes.map((loadLink)=>{
                            let obj
                                for(let i=0;i<data.length;i++){
                                    if(data[i].city == `${loadLink.destination}`){
                                        obj = data[i];
                                    }
                                }
                            if(loadLink.type == 'posting'){
                                return(
                                    <div className='request'>
                                        {
                                            view2 && currentFriend.userId == loadLink.userId && currentFriend.id == loadLink.time &&
                                                <div className='friendReq'>
                                                    <button onClick={()=>{sendRequest()}}>Send Link Request</button>
                                                    <button onClick={()=>{setCurrentFriend({})}}>Close</button>
                                                </div>
                                        }  
                                        <div className='userInfo' onClick={()=>{sendRequestIntiator({userId:loadLink.userId,id:loadLink.time})}}>
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
                                        {/* <div className='map'>
                                            <iframe width='100%' height='100%' src={`https://api.mapbox.com/styles/v1/akshaynair995/clvjqx0bm01af01qz39u11hnv.html?title=false&access_token=pk.eyJ1IjoiYWtzaGF5bmFpcjk5NSIsImEiOiJjbHZqcTM0ZmsxcGd5MnFwNWYwdWRkMjIyIn0.3VLRXtyCA0xprjZjInIj2w&zoomwheel=false#2/${obj.lat}/${obj.lng}`} title="Streets"></iframe>
                                        </div> */}
                                        <div className='Details'>
                                            <p className='d1'><b>Date:</b> {loadLink.date}</p>
                                            <p className='d1'><b>Space Left:</b> {loadLink.spaceLeft}m/s^2</p>
                                            <button className='bookBtn' onClick={()=>{viewMore(loadLink)}}>Book Now:  ₹{loadLink.price}</button>
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
                    {allData.length > 0 && search == '' && windowWidth < 768 && 
                        allData.map((loadLink)=>{
                            if(loadLink.type == 'posting'){
                                let obj
                                for(let i=0;i<data.length;i++){
                                    if(data[i].city == `${loadLink.destination}`){
                                        obj = data[i];
                                    }
                                }
                                return(
                                    <div className='request'>
                                        {
                                            view2 && currentFriend.userId == loadLink.userId && currentFriend.id == loadLink.time &&
                                                <div className='friendReq'>
                                                    <button onClick={()=>{sendRequest()}}>Send Link Request</button>
                                                    <button onClick={()=>{setCurrentFriend({})}}>Close</button>
                                                </div>
                                        }  
                                        <div className='r1'>
                                            <div className='userInfo' onClick={()=>{sendRequestIntiator({userId:loadLink.userId,id:loadLink.time})}}>
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
                    {searchRes.length > 0 && search != '' && windowWidth < 768 && 
                        searchRes.map((loadLink)=>{
                            let obj
                                for(let i=0;i<data.length;i++){
                                    if(data[i].city == `${loadLink.destination}`){
                                        obj = data[i];
                                    }
                                }
                            if(loadLink.type == 'posting'){
                                return(
                                    <div className='request'>
                                        {
                                            view2 && currentFriend.userId == loadLink.userId && currentFriend.id == loadLink.time &&
                                                <div className='friendReq'>
                                                    <button onClick={()=>{sendRequest()}}>Send Link Request</button>
                                                    <button onClick={()=>{setCurrentFriend({})}}>Close</button>
                                                </div>
                                        }  
                                        <div className='r1'>
                                            <div className='userInfo' onClick={()=>{sendRequestIntiator({userId:loadLink.userId,id:loadLink.time})}}>
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
            </div>
        </div>
    )
}

export default Explore