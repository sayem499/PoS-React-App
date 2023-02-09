import '../css/layout.css'
import {Outlet, useNavigate} from 'react-router-dom'
import {SidebarData} from './sidebardata'

function Layout (){
    const navigate = useNavigate()
    return (
        <div className='Wrapper'>
         <div className='Sidebar'>
          <ul className='SidebarList'>
           {SidebarData.map((val, key)=>{
            return(
            <li id={window.location.pathname == val.link ? "active" : ""} className="row" key={key} onClick={()=>{navigate(val.link)}} >
                {" "}
                <div id='icon'>{val.icon}</div>{" "}
                <div id='title'>{val.title}</div>
                

            </li>
            )
          
            })}
           </ul>
         </div>
         <div className='Outlet'>
            <Outlet/>

         </div>
        </div>  
    
        
       
    )
}

export default Layout