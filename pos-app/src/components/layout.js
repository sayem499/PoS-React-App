import '../css/layout.css'
import {Outlet, Link} from 'react-router-dom'
import {SidebarData} from './sidebardata'

function Layout (){

    return (
        <>
         <div className='Sidebar'>
         <nav>
            
         </nav>
         </div>

         <Link to="/">Home</Link>
         <Outlet/>
          
        </>
       
    )
}

export default Layout