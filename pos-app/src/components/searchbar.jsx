import '../css/searchbar.css'
import SearchIcon from '@mui/icons-material/Search';
import AccountLogo from "../assets/accountlogo.png"
import { useState, useEffect, useRef} from 'react';
import UserAccountMenu from './useraccountmenu';

function Searchbar() {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => {setIsOpen(!isOpen)}
    let menuref = useRef()


    useEffect(() => {
        let handler = (e) => {
            if(!menuref.current.contains(e.target)){
                setIsOpen(false)
            }
            
        }
        document.addEventListener('mousedown',handler)
    })
    return(
        <div className="Searchbar">
            <div className="Searchbox">
             <input type = "text" placeholder = "Search..." >
             </input>
             <SearchIcon className='Searchicon'/>
            </div>
            <div className='Accountlogo' onClick={toggle}  ref={menuref}>
             <img src={AccountLogo} alt="Account LOGO" ></img>
             {isOpen ? <UserAccountMenu data={isOpen}  /> : ""}
            </div>
        </div>
    )
}

export default Searchbar
