import { Link } from 'react-router-dom';
import './sidebar.scss';
import home from '../../images/home.png' 
import explore from '../../images/direction.png' 
import notifications from '../../images/notification.png' 
import profile from '../../images/profile.png' 
import logout from '../../images/logout.png' 
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase_config';

function Sidebar(){
    return(
        <div className='Sidebar'>
            <div className='link'>
                <Link to='/Home'><img src={home}></img></Link>
            </div>
            <div className='link'>
                <Link to='/Home'><img src={explore}></img></Link>
            </div>
            <div className='link'>
                <Link to='/Home'><img src={notifications}></img></Link>
            </div>
            <div className='link'>
                <Link to='/Home'><img src={profile}></img></Link>
            </div>
            <button className='logout' onClick={()=>{signOut(auth)}}><img src={logout}></img></button>
        </div>
    )
}

export default Sidebar;