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

function Explore (){

    const userRef = collection(db,"users");
    const loadLinksRef = collection(db,"loadLinks");
    const {currentUser} = useContext(Authcontext);
    const [userData,setUD] = useState({});
    const [allData,setAD] = useState([])

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

    const viewMore = (obj)=>{
        setCurrentView(obj);
        setView(true);
    }
    
    const bookSpace = ()=>{
        
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
                            <div className='map'>
                            </div>

                            <p className='desc'>
                                <p className='Title'>Description</p>
                                <p>{currentView.details}</p>
                            </p>
                            <div className='info'>
                                <img src={pointer}></img>
                                <p>Start: {currentView.start}</p>
                            </div>
                            <div className='info'>
                                <img src={pointer}></img>
                                <p>Destination: {currentView.destination}</p>
                            </div>

                            <input
                                type="range"
                                min={0}
                                max={currentView.spaceLeft}
                            />

                            <button onClick={()=>{bookSpace()}}>Book Now</button>
                        </div>
                    </div>
                }

                <div className='loadLinks'>
                    {allData.length > 0 && 
                        allData.map((loadLink)=>{
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
                                        <div className='map'>
                                            
                                        </div>
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
                </div>
            </div>
        </div>
    )
}

export default Explore