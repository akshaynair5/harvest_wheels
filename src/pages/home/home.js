import './home.scss'
import Sidebar from '../../components/sidebar/sidebar'
import linkLine from '../../images/linkLine.png'
import bg from '../../images/bg.jpeg'

function Home(){
    const obj =  [{
            userId:'b4oxnn4Gv7XTUuTB4s8i7ui7h3G2"',
            profileURL:'https://firebasestorage.googleapis.com/v0/b/harvest-wheels.appspot.com/o/1709743834705?alt=media&token=8c67be27-a5f4-41e0-b790-afe8984393bd',
            name:'Akshay',
            type:'request',
            start:'pune',
            destination:'thane',
            date:'16/08/2024',
            details:'I have 2m^2 of space left in my vehicle',
            expiry:false,
            reply:{
                type:[
                    {
                        replyUserId:"b4oxnn4Gv7XTUuTB4s8i7ui7h3G2",
                        replyMessage:'Intrested'
                    }
                ]
            },
        },
        {
            userId:'b4oxnn4Gv7XTUuTB4s8i7ui7h3G2"',
            profileURL:'https://firebasestorage.googleapis.com/v0/b/harvest-wheels.appspot.com/o/1709743834705?alt=media&token=8c67be27-a5f4-41e0-b790-afe8984393bd',
            name:'Akshay',
            type:'request',
            start:'pune',
            destination:'thane',
            date:'16/08/2024',
            details:'I have 2m^2 of space left in my vehicle',
            expiry:false,
            reply:{
                type:[
                    {
                        replyUserId:"b4oxnn4Gv7XTUuTB4s8i7ui7h3G2",
                        replyMessage:'Intrested'
                    }
                ]
            }
        },
        {
            userId:'b4oxnn4Gv7XTUuTB4s8i7ui7h3G2"',
            profileURL:'https://firebasestorage.googleapis.com/v0/b/harvest-wheels.appspot.com/o/1709743834705?alt=media&token=8c67be27-a5f4-41e0-b790-afe8984393bd',
            name:'Akshay',
            type:'request',
            start:'pune',
            destination:'thane',
            date:'16/08/2024',
            details:'I have 2m^2 of space left in my vehicle',
            expiry:false,
            reply:{
                type:[
                    {
                        replyUserId:"b4oxnn4Gv7XTUuTB4s8i7ui7h3G2",
                        replyMessage:'Intrested'
                    }
                ]
            }
        },
        {
            userId:'b4oxnn4Gv7XTUuTB4s8i7ui7h3G2"',
            profileURL:'https://firebasestorage.googleapis.com/v0/b/harvest-wheels.appspot.com/o/1709743834705?alt=media&token=8c67be27-a5f4-41e0-b790-afe8984393bd',
            name:'Akshay',
            type:'request',
            start:'pune',
            destination:'thane',
            date:'16/08/2024',
            details:'I have 2m^2 of space left in my vehicle',
            expiry:false,
            reply:{
                type:[
                    {
                        replyUserId:"b4oxnn4Gv7XTUuTB4s8i7ui7h3G2",
                        replyMessage:'Intrested'
                    }
                ]
            }
        }
    
    ]
    return(
        <div className='Home'>
            <Sidebar/>
            <div className='Main'>
                <img src={bg} className='bg'></img>
                <div className='loadLinks'>
                    {
                        obj.map((loadLink)=>{
                            if(loadLink.type == 'request'){
                                return(
                                    <div className='request'>
                                        <div className='details'>
                                            <img src={loadLink.profileURL}></img>
                                            <p className='name'>{loadLink.name}</p>
                                        </div>
                                        <div className='desc'>
                                            <p className='details'>{loadLink.details}</p>
                                            <p className='date'><b>Date: {loadLink.date}</b></p>
                                        </div>
                                        <div className='travelDetails'>
                                            <p className='start'>○   Start: <b>{loadLink.start}</b></p>
                                            <img src={linkLine}></img>
                                            <p className='destination'>○   Destination: <b>{loadLink.destination}</b></p>
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

export default Home;
