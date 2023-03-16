import '../css/useraccountmenu.css'
import {UserAccountMenuData} from '../utils/useraccountmenudata.jsx'
import { useNavigate } from 'react-router-dom'
import Accountlogo from "../assets/accountlogo.png"


function UserAccountMenu(classnameprop) {
  const navigate = useNavigate()
    return (
        <div className = {`Useraccountmenu ${classnameprop ? " active" : "inactive"}`}>
             <div className='Userimage'><img src={Accountlogo} alt="UserImage" ></img></div>
             <div className='Userid'>User ID</div>
            <ul>
            <hr/>
                {UserAccountMenuData.map((val, key) => {
                    return (
                        <li key={key} onClick= {()=> {navigate(val.link)}}>
                        <div className='icon'>{val.icon}</div> 
                        <div className='title'>{val.title}</div>
                        </li>
                    )
                }) }
                
                
            </ul>
        </div>
    )
}

export default UserAccountMenu 