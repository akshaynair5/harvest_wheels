import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";
import { auth } from "../../firebase_config"
import { storage } from "../../firebase_config";
import { getDownloadURL } from "firebase/storage";
import {Link, useNavigate } from "react-router-dom";
import ProfilePicIcon from "../../images/user.png"
import QRImage from "../../images/QR-Code-PNG-Photo.png"
import { db } from "../../firebase_config";
import { doc, setDoc } from "firebase/firestore"; 
import './login&register.scss'

function Register (){
    const navigate = useNavigate()
    const [dpLink,setDPLink] = useState('');
    const [err,setErr] = useState(false)
    const HandleSubmit= async (e)=>{
        e.preventDefault();
        const displayName = e.target[0].value
        const email = e.target[1].value
        const number = e.target[2].value
        const job = e.target[3].value
        const POR = e.target[4].value
        const password = e.target[5].value
        const DP = e.target[6].files[0]
        const QR = e.target[7].files[0]
        const storageid = new Date().getTime()
        await createUserWithEmailAndPassword(auth,email,password)
            .then(async (User)=>{
                console.log(User.user.uid)
                const storageRef = ref(storage,`${storageid}`)
                const storageRef2 = ref(storage,`${storageid + 10}`)
                await uploadBytesResumable(storageRef,DP)
                    .then(()=>{
                        getDownloadURL(storageRef).then((downloadURL)=>{
                            setDPLink(downloadURL)
                        })
                    })
                await uploadBytesResumable(storageRef+10,QR)
                    .then(()=>{
                        getDownloadURL(storageRef2).then(async (downloadURL) => {
                            try{
                                await setDoc(doc(db, "users", User.user.uid), {
                                    uid: User.user.uid,
                                    displayName:displayName,
                                    email:email,
                                    profileUrl: dpLink,
                                    number:number,
                                    job:job,
                                    placeOfResidence:POR,
                                    links:[],
                                    currentTrip:"",
                                    notifications:[],
                                    proof:0,
                                    qrCode:downloadURL
                                });
                            }
                            catch(err){
                                console.log(err)
                                setErr(true)
                            }
                        navigate("/Home")
                    })
                })
            })
        

    }
    return(
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
    )
}

export default Register