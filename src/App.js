import './App.css';
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import Register from './pages/login&signup/register';
import Login from './pages/login&signup/login';
import { Navigate } from 'react-router-dom';
import { Authcontext } from './contextProvider';
import { useContext } from 'react';
import Home from './pages/home/home';
function App() {
  const {currentUser} = useContext(Authcontext)
  const ProtectedRoute = ({children})=>{
    if(!currentUser){
      return(
        <Navigate to="/Login"/>
      )
    }
    return(
      children
    )
  }
  return (
    <BrowserRouter>
      <Routes basename="/Harvest_Wheels">
        <Route exact path="/Harvest_Wheels" element={<Register/>}></Route>
        <Route  path="/Login" element={<Login/>}></Route>
        <Route  path="/Home" element={<ProtectedRoute> <Home/> </ProtectedRoute>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
