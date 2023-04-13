import '../css/useraccountmenu.css'
import { useNavigate } from 'react-router-dom'
import Accountlogo from "../assets/accountlogo.png"
import { useSelector, useDispatch } from 'react-redux'
import { logout, reset } from '../auth/authSlice.js'
import { useEffect } from 'react'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ExitToAppOutlinedEIcon from '@mui/icons-material/ExitToAppOutlined';

function UserAccountMenu(classnameprop) {
  const {user} = useSelector((state) => state.auth )  
  const dispatch = useDispatch()
  const navigate = useNavigate()
  

  const onLogout = (e) => {
      e.preventDefault()
      navigate('/login')
      dispatch(logout())
      

  }

  const onClick = () =>{
    navigate('/profile')
  } 

  useEffect(() => {
    
    dispatch(reset())
    
  }, [dispatch])

  
  
  
  
    return (
        <div className = {`Useraccountmenu ${classnameprop ? "active" : "inactive"}`}>
             <div className='Userimage'><img src={Accountlogo} alt="UserImage" ></img></div>
             <div className='Userid'>{user ? user.userName : ""}</div>
            <ul>
            <hr/>
             <li onClick ={onClick}>
                <AccountCircleOutlinedIcon className='icon1' />Profile
             </li>
             <li onClick = {onLogout}>
                <ExitToAppOutlinedEIcon className='icon2' />Signout
            </li>
                
                
            </ul>
        </div>
    )
}

export default UserAccountMenu 