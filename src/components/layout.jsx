import '../css/layout.css'
import {Outlet, useNavigate} from 'react-router-dom'
import {SidebarData} from './sidebardata'
import {motion} from "framer-motion"
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';
import Searchbar from './searchbar';
import { useSelector} from 'react-redux'
import PosWelcomeLogo from '../assets/pos-welcome-logo.jpg'

function Layout ({children}){
    const {user} = useSelector((state) => state.auth )
    const [isOpen, setIsOpen] = useState(false); 
    const toggle = () => setIsOpen(!isOpen)
    const navigate = useNavigate()

    

    

    useEffect(() => {
        if(!user){
             navigate("/login")
        }
    }, [user, navigate])
    return (
        <div className='Wrapper'> 
         <motion.div animate={{width: isOpen ? "200px" : "40px"}} className='Sidebar'>
          <div className='top-section'>
           {isOpen && <div className='logo'>LOGO</div> }
            <div className='menu-icon'>
                {isOpen ? <CloseIcon onClick = {toggle}/> : <MenuIcon onClick = {toggle}/>}
            </div>

          </div>
          <ul className='SidebarList'>
           {SidebarData.map((val, key)=>{
            let userRole = 'regular'
                if(user){
                    const {userType} = user
                    userRole = userType
                }
            
            return(
            <li id={window.location.pathname === val.link ? "active" : ""} className={`row  ${(userRole === 'regular' && val.title === 'Users') ? "invisible" : "visible"}`} key={key} onClick={()=>{navigate(val.link)}} >
                {" "}
                <div id='icon'>{val.icon}</div>{" "}
                {isOpen && <div id='title'>{val.title}</div>}
                

            </li>
            )
          
            })}
           </ul>
         </motion.div>
         <motion.div animate = {{marginLeft: isOpen ? "0px" : "0px"}} className='Outlet'>
         <div className='searchbar-container'>
            <Searchbar/>
        </div>
         <div className='Outlet-Inner'>
             <Outlet/>
         </div>
         
         </motion.div>
        </div>  
    
        
       
    )
}

export default Layout