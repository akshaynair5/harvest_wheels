import './login&register.scss'
import { auth } from "../../firebase_config";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from "react";
import { useNavigate ,Link} from "react-router-dom";
import backImgMob from '../../images/landingPageMob.png'
import backImg from '../../images/landingPage.png'

function Login(){
    const navigate = useNavigate()
    const [err,setErr] = useState(false)
    const [windowWidth,setWindowWidth] = useState(window.innerWidth);
    const HandleSubmit= async (e)=>{
        e.preventDefault()
        const email = e.target[0].value
        const password = e.target[1].value
        try{
            await signInWithEmailAndPassword(auth,email,password)
            navigate("/home")
        }
        catch(err){
            setErr(true)
        }

    }
    return(
        <div className='main' style={{backgroundImage:`url(${windowWidth>768?backImg:backImgMob})`}}>
            <div className="FormBox" onSubmit={(e)=>HandleSubmit(e)}>
                <form>
                    <input type="email" placeholder="Email"></input>
                    <input type="password" placeholder="Password"></input>
                    <input type="submit" id="S"></input>
                    {err && <span style={{alignSelf:'center'}}><b>Username or Password is wrong, Try Again!</b></span>}
                    <p style={{width:'34%'}}>Do not have an Account?<b><Link style={{marginLeft:'2%',textDecoration:'none'}} to="/Harvest_Wheels/">Register Now</Link></b></p>
                </form>
            </div>
        </div>
    )
}

export default Login