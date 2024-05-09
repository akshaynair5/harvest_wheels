import { useCallback, useContext, useEffect, useState } from 'react'
import { db } from '../../firebase_config'
import { getDocs, doc } from "firebase/firestore";
import { collection, query, updateDoc, where ,or,and} from "firebase/firestore";
import Sidebar from '../../components/sidebar/sidebar';
import './notifications.scss'
import { Authcontext } from '../../contextProvider';
import tick from '../../images/Checkmark.svg'
import cross from '../../images/cross.svg'      

function Notifications(){

    const userRef = collection(db,"users");
    const [userData,setUD] = useState([])
    const [notifications,setNt] = useState([]);
    const {currentUser} = useContext(Authcontext)

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
                    setNt(temp[0].notifications)
                    console.log(temp[0])
                }catch(err){
                    console.log("error: ",err)
                }
            }
            FetchUserData();
    },[])

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


    return(
        <div className='notifications'>
            <Sidebar/>

            <div className='n'>
                {
                    notifications.map((n)=>{
                        if(n.type == 'friend-request'){
                            return(
                                <div className='notification'>
                                    <div className='userInfo'>
                                        <p className='name'>{n.name}</p>
                                        <img src={n.profileUrl}></img>
                                    </div>
                                    <div className='price'>
                                        Friend-Request
                                    </div>

                                    <div className='btns'>
                                        <img src={tick} onClick={()=>{AcceptFriendReq(n)}}></img>
                                        <img src={cross} onClick={()=>{DeclineFriendReq(n)}}></img>
                                    </div>
                                </div>
                            )
                        }
                    })
                }
            </div>


        </div>
    )
}

export default Notifications;
