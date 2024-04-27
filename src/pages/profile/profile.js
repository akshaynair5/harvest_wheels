import { useCallback, useContext, useEffect, useState } from 'react'
import { collection, query, updateDoc, where ,or,and, addDoc} from "firebase/firestore";
import pointer from '../../images/pointer.png'
import line from '../../images/Line.png'
import { doc, setDoc, getDocs } from "firebase/firestore"; 
import { db } from '../../firebase_config';
import './profile.scss'
import { Authcontext } from '../../contextProvider';
import Sidebar from '../../components/sidebar/sidebar';

function Profile(){
    const {currentUser} = useContext(Authcontext)
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
    const [addView,setAV] = useState(false)



    useEffect(()=>{
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
        if(userData){
            const FetchUserData = async()=>{
                const q=query(userRef2,where("userId","==",`${currentUser.uid}`))
                const querySnapShot1 = await getDocs(q)
                const temp = []
                try{
                    querySnapShot1.forEach((doc)=>{
                        temp.push(doc.data())
                    })
                    console.log(temp)
                    setUL(temp)
                }catch(err){
                    console.log("error: ",err)
                }
            }
            FetchUserData();
        }
    },[userData])

    const addInitializer = ()=>{
        setAV(true);

    }

    const onSubmit = async()=>{
        var now = new Date().getTime()

        await setDoc(doc(db, "loadLinks", `${currentUser.uid}${now}`), {
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
            reply:[],
            time:now
        });
    } 




    return(
        <div className="profile">
            <Sidebar/>

            {
                addView && 
                <div className='popUp'>
                    <div className='content'>
                        <select className='selectType' onChange={(e)=>{setType(e.target.value)}}>
                            <option value='request'>Request</option>
                            <option value='posting'>Posting</option>
                        </select>
                        <input type='text' placeholder='from' onChange={(e)=>{setFrom(e.target.value)}}></input>
                        <input type='text' placeholder='To'  onChange={(e)=>{setTo(e.target.value)}}></input>
                        <input type='date' placeholder='Time'  onChange={(e)=>{setDate(e.target.value)}}></input>
                        <textarea placeholder='description'  onChange={(e)=>{setDesc(e.target.value)}}></textarea>
                        <input type='number' placeholder='Space left(M^2) Approx'  onChange={(e)=>{setSpace(e.target.value)}}></input>
                        <button onClick={()=>{onSubmit()}}></button>
                    </div>
                </div>
            }
            <div className='topBar'>
                
                <button onClick={()=>{addInitializer()}}>Add</button>
            </div>


            <div className='loadLinks'>
                    {userLinks.length > 0 && 
                        userLinks.map((loadLink)=>{
                            console.log(loadLink)
                            if(loadLink.type == 'posting'){
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
                                            
                                        </div>
                                        <div className='Details'>
                                            <p className='d1'><b>Date:</b> {loadLink.date}</p>
                                            <p className='d1'><b>Space Left:</b> {loadLink.spaceLeft}m/s^2</p>
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
    )
}

export default Profile;