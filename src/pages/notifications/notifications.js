import { useCallback, useContext, useEffect, useState } from 'react'
import { db } from '../../firebase_config'
import { getDocs, doc } from "firebase/firestore";
import { collection, query, updateDoc, where ,or,and} from "firebase/firestore";
import Sidebar from '../../components/sidebar/sidebar';
import './notifications.scss'
import { Authcontext } from '../../contextProvider';
import tick from '../../images/Checkmark.svg'
import cross from '../../images/cross.svg'  
import noResults from '../../images/no-results.png'    

function Notifications(){

    const userRef = collection(db,"users");
    const [userData,setUD] = useState([])
    const [notifications,setNt] = useState([]);
    const {currentUser} = useContext(Authcontext)
    const [photo,setPhoto] = useState("");
    const [pendingPayment,setPendingPayment] = useState(-1);

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
                    let c = 0;
                    for(let i=0;i<temp[0].notifications.length;i++){
                        if(temp[0].notifications[i].type == 'payment-request'){
                            c++;
                        }
                    }
                    setPendingPayment(c);
                    setNt(temp[0].notifications)
                    console.log(temp[0])
                }catch(err){
                    console.log("error: ",err)
                }
            }
            FetchUserData();
    },[])

    const onPay = async(n)=>{
        const q=query(userRef,where("uid","==",`${n.uid}`))
        const querySnapShot1 = await getDocs(q)
        const temp = []
        try{
            querySnapShot1.forEach((doc)=>{
                temp.push(doc.data())
            })
            setPhoto(temp[0].qrCode)
        }catch(err){
            console.log("error: ",err)
        }
    }
    const viewProof = async(n)=>{
        const q=query(userRef,where("time","==",`${n.tripID}`))
        const querySnapShot1 = await getDocs(q)
        const temp = []
        try{
            querySnapShot1.forEach((doc)=>{
                temp.push(doc.data())
            })
            setPhoto(temp[0].proof)
        }catch(err){
            console.log("error: ",err)
        }
    }

    const onCancelHandler = (n)=>{
        setPhoto("")
    }

    const AcceptFriendReq = (n)=>{
            const temp = [];
            const FetchUserData = async()=>{
                const q=query(userRef,where("uid","==",`${n.uid}`))
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
                    let temp1 = userData.links;
                    let temp2 = temp[0].links;
            
                    console.log(temp[0].links)
            
                    temp1 = [...temp1,temp[0].uid];
                    temp2 = [...temp2,currentUser.uid];
        
                    await updateDoc(doc(db, 'users', currentUser.uid), {
                        links: temp1,
                    });
                    await updateDoc(doc(db, 'users', n.uid), {
                        links: temp2,
                    });
                    let temp3 = userData
                    for(let i=0;i<temp3.notifications.length;i++){
                        if(temp3.notifications[i] == n){
                            temp3.notifications.splice(i,1);
                        }
                    }
                    await updateDoc(doc(db, 'users',  currentUser.uid), {
                        notifications: temp3.notifications,
                    });
                    
                    setUD(temp3)
                })
    }
    const DeclineFriendReq = async(n)=>{
        let temp = userData
        for(let i=0;i<temp.notifications.length;i++){
            if(temp.notifications[i] == n){
                temp.notifications.splice(i,1);
            }
        }
        await updateDoc(doc(db, 'users',  currentUser.uid), {
            notifications: temp.notifications,
        });

        setUD(temp)
    }

    const approvePayment = async(n)=>{
        let temp = userData

        const q=query(userRef,where("uid","==",`${n.uid}`))
        const querySnapShot1 = await getDocs(q)
        const temp1 = []
        try{
            querySnapShot1.forEach((doc)=>{
                temp1.push(doc.data())
            })

        }catch(err){
            console.log("error: ",err)
        }

        for(let i=0;i<temp1[0].notifications.length;i++){
            if(temp1[0].notifications[i].uid == currentUser.uid){
                temp1[0].notifications.splice(i,1);
            }
        }
        await updateDoc(doc(db, 'users',  n.uid), {
            notifications: temp1[0].notifications,
        });

        for(let i=0;i<temp.notifications.length;i++){
            if(temp.notifications[i] == n){
                temp.notifications.splice(i,1);
            }
        }
        await updateDoc(doc(db, 'users',  currentUser.uid), {
            notifications: temp.notifications,
        });

        setUD(temp)
    }

    useEffect(()=>{
        if(pendingPayment >= 3){
            const blockUser = async()=>{
                await updateDoc(doc(db, 'users',  currentUser.uid), {
                    block: 1
                });
            }
            blockUser();
        }
        else if(pendingPayment != -1){
            const blockUser = async()=>{
                await updateDoc(doc(db, 'users',  currentUser.uid), {
                    block: 0
                });
            }
            blockUser();
        }
    },[pendingPayment])

    return(
        <div className='notifications'>
            <Sidebar/>
            {
                photo != "" && 
                <div className='photoPopUp'>
                    <div className='main'>
                        <button onClick={()=>onCancelHandler()} className='cancel'>X</button>
                        <img src={photo} className='photo'></img>
                    </div>
                </div>
            }
            <div className='n'>
                {notifications.length > 0 && 
                    notifications.map((n)=>{
                        if(n.type == 'friend-request'){
                            return(
                                <div className='notification'>
                                        <img src={n.profileUrl}></img>
                                        <p className='info'><b>{n.name}</b> has sent you a friend request!</p>
                                    <div className='btns'>
                                        <img src={tick} onClick={()=>{AcceptFriendReq(n)}}></img>
                                        <img src={cross} onClick={()=>{DeclineFriendReq(n)}}></img>
                                    </div>
                                </div>
                            )
                        }
                        else if(n.type == 'payment-request' && n.uid != userData.uid){
                            return(
                                <div className='notification'>
                                    <img src={n.profileURL}></img>
                                    <p className='info'><b>{n.name}</b> has completed the journey and has sent you a payment request!</p>
                                    <div className='btns'>
                                        <button onClick={()=>{onPay(n)}}>Pay</button>
                                        <button onClick={()=>{viewProof(n)}}>Proof</button>
                                    </div>
                                </div>
                            )
                        }
                        else{
                            return(
                                <div className='notification'>
                                    <img src={n.profileURL}></img>
                                    <p className='info'>Approve <b>{n.name}</b>'s payment of ₹{n.price} for the journey on <b>{n.date}</b></p>
                                    <div className='btns'>
                                        <img src={tick} onClick={()=>{approvePayment(n)}}></img>
                                    </div>
                                </div>
                            )
                        }
                    })
                }
                {
                    notifications.length == 0 && 
                    <div>
                        <div className='loadLinks'>
                            <div className='disclaimer'>
                                <img src={noResults}></img>
                                <p>Your notifications page is currently empty. Once you have more activity, updates will appear here.</p>
                            </div>
                        </div>
                    </div> 
                }
            </div>


        </div>
    )
}

export default Notifications;
