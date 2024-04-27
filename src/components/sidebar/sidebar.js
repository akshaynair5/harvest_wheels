import { Link } from 'react-router-dom';
import './sidebar.scss';
import home from '../../images/home.png' 
import explore from '../../images/direction.png' 
import notifications from '../../images/notification.png' 
import profile from '../../images/profile.png' 
import title from '../../images/Harvest-Wheels.svg' 
import title2 from '../../images/Harvest-Wheels-white.png' 
import btn from '../../images/Menu_Bar.svg' 
import logout from '../../images/logout.png' 
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebase_config';
import { useCallback, useContext, useEffect, useState } from 'react';
import { collection, query,getDocs,where } from 'firebase/firestore';
import { Authcontext } from '../../contextProvider';

function Sidebar(){
    const userDetailsRef = collection(db,'users');
    const {currentUser} = useContext(Authcontext)
    const [sidebarView,setSidebarView] = useState(false);
    const [userData,setUD] = useState({});

    useEffect(()=>{
        console.log(currentUser)
        const getUserDetails = async ()=>{
            const q = query(userDetailsRef,where("uid","==",`${currentUser.uid}`))
            const querySnapShot1 = await getDocs(q)
            const temp = []
            try{
                querySnapShot1.forEach((doc)=>{
                    temp.push(doc.data())
                })
                console.log(temp[0])
                setUD(temp[0])
                console.log(temp[0].profileUrl)
            }catch(err){
                console.log("error: ",err)
            }
        }
        getUserDetails();
    },[])


    return(
        <div className='Navbar'>
            <div className='topNav'>
                <button onClick={()=>{setSidebarView(true)}} className='btn'><img src={btn}></img></button>
                <img src={title} className='title'></img>
                <img src={userData.profileUrl} className='profilePhoto' onClick={()=>{signOut(auth)}}></img>
            </div>
            {
                sidebarView && 
                <div className='outer' onClick={()=>{setSidebarView(false)}}>
                    <div className='Sidebar'>
                        <img src={title2} className='title2'></img>
                        <div className='link'>
                            <Link to='/Home'><img src={home}></img></Link>
                            <p>Home</p>
                        </div>
                        <div className='link'>
                            <Link to='/Explore'><img src={explore}></img></Link>
                            <p>Explore</p>
                        </div>
                        <div className='link'>
                            <Link to='/Notifications'><img src={notifications}></img></Link>
                            <p>Notifications</p>
                        </div>
                        <div className='link'>
                            <Link to='/Profile'><img src={profile}></img></Link>
                            <p>Profile</p>
                        </div>
                        <button className='logout' onClick={()=>{signOut(auth)}}><img src={logout}></img></button>
                    </div>
                </div>
            }
        </div>
    )
}

export default Sidebar;