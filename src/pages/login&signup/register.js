import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";
import { auth } from "../../firebase_config"
import { storage } from "../../firebase_config";
import { getDownloadURL } from "firebase/storage";
import {Link, useNavigate } from "react-router-dom";
import ProfilePicIcon from "../../images/user.png"
import QRImage from "../../images/QR-Code-PNG-Photo.png"
import logo from "../../images/HW_Logo.jpg"
import { db } from "../../firebase_config";
import { doc, setDoc } from "firebase/firestore"; 
import './login&register.scss'
import backImgMob from '../../images/landingPageMob.png'
import backImg from '../../images/landingPage.png'

function Register (){
    const navigate = useNavigate()
    const [dpLink,setDPLink] = useState('');
    const [windowWidth,setWindowWidth] = useState(window.innerWidth);
    const [err,setErr] = useState(false)
    const HandleSubmit = async (e) => {
        e.preventDefault();
    
        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const number = e.target[2].value;
        const job = e.target[3].value;
        const POR = e.target[4].value;
        const password = e.target[5].value;
        const DP = e.target[6].files[0];
        const QR = e.target[7].files[0];
        const storageid = new Date().getTime();
    
        try {
            const User = await createUserWithEmailAndPassword(auth, email, password);
            console.log(User.user.uid);
    
            const storageRef = ref(storage, `${storageid}`);
            const storageRef2 = ref(storage, `${storageid + 10}`);
    
            const uploadDP = uploadBytesResumable(storageRef, DP);
            const uploadQR = uploadBytesResumable(storageRef2, QR);
    
            await uploadDP;
            const dpLink = await getDownloadURL(storageRef);
    
            await uploadQR;
            const qrLink = await getDownloadURL(storageRef2);
    
            await setDoc(doc(db, "users", User.user.uid), {
                uid: User.user.uid,
                displayName: displayName,
                email: email,
                profileUrl: dpLink,
                number: number,
                job: job,
                placeOfResidence: POR,
                links: [],
                currentTrip: "",
                notifications: [],
                proof: 0,
                qrCode: qrLink,
                block: 0
            });
    
            navigate("/explore");
        } catch (err) {
            console.log(err);
            setErr(true);
        }
    };    
    return(
        <div className="main" style={{backgroundImage:`url(${windowWidth>768?backImg:backImgMob})`}}>
            <div className="FormBox">
                <form onSubmit={(e)=>HandleSubmit(e)}>
                    <input type="text" placeholder="Name" required></input>
                    <input type="email" placeholder="Email-ID" required></input>
                    <input type="number" placeholder="Mobile Number" required></input>
                    <input type='text' placeholder="Job" required></input>
                    <input type='text' placeholder="Place of Residence" required></input>
                    <input type="password" placeholder="Password" required></input>
                    <label htmlFor="Fl"><img src={ProfilePicIcon} style={{height:'50px',alignSelf:'center'}}></img><p style={{marginLeft:'5%'}}>Add Profile Photo</p></label>
                    <input id="Fl" type="file" placeholder="file" style={{display:'none'}} required></input>
                    <label htmlFor="Fl2"><img src={QRImage} style={{height:'50px',alignSelf:'center'}}></img><p style={{marginLeft:'5%'}}>Add Payment QR Code</p></label>
                    <input id="Fl2" type="file" placeholder="file" style={{display:'none'}} required></input>
                    <input type="submit" id="S" value="Register"></input>
                    {err && <span style={{alignSelf:'center'}}>Something went wrong, Try Again</span>}
                    <p style={{width:'26%'}}>Have an Account? <b><Link style={{marginLeft:'2%',textDecoration:'none'}} to="/login">Login Now</Link></b></p>
                </form>
            </div>
        </div>
    )
}

export default Register