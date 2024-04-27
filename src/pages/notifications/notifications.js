import { useCallback, useContext, useEffect, useState } from 'react'
import { db } from '../../firebase_config'
import { getDocs, doc } from "firebase/firestore";
import { collection, query, updateDoc, where ,or,and} from "firebase/firestore";
import Sidebar from '../../components/sidebar/sidebar';
import './notifications.scss'
import { Authcontext } from '../../contextProvider';

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
                }catch(err){
                    console.log("error: ",err)
                }
            }
            FetchUserData();
    },[])

    const AcceptFriendReq = (n)=>{
            const temp = [];
            const FetchUserData = async()=>{
                const q=query(userRef,where("uid","==",`${n.userId}`))
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
                    await updateDoc(doc(db, 'users', n.userId), {
                        links: temp2,
                    });
                })
    }
    const DeclineFriendReq = (n)=>{
        let temp = userData
        for(let i=0;i<temp.notifications.length;i++){
            if(temp.notifications[i] == n){
                temp.notifications.splice(i,1);
            }
        }

        setUD(temp)
    }


    return(
        <div className='notifications'>
            <Sidebar/>
            {
                notifications.map((n)=>{
                    if(n.type == 'friend-request'){
                        <div className='fr'>
                            <p>{n.name}</p>
                            <button onClick={()=>{AcceptFriendReq(n)}}>Accept</button>
                            <button onClick={()=>{DeclineFriendReq(n)}}>Decline</button>
                        </div>
                    }
                })
            }


        </div>
    )
}

export default Notifications;
