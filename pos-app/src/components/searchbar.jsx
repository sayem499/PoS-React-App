import '../css/searchbar.css'
import SearchIcon from '@mui/icons-material/Search';
import AccountLogo from "../assets/accountlogo.png"
import { useState, useEffect, useRef} from 'react';
import UserAccountMenu from './useraccountmenu';
import Clock from './clock'

function Searchbar() {
    const [searchInput, setSearchInput] = useState('')
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => {setIsOpen(!isOpen)}
    let menuref = useRef()


    useEffect(() => {
        let handler = (e) => {
         try{
            if(!menuref.current.contains(e.target)){
                setIsOpen(false)
            }
         } catch (error){
            console.log(error)
         }
            
        }
        document.addEventListener('mousedown',handler)
        console.log(searchInput)
    },)
    return(
        <div className="Searchbar">
            <div className="Searchbox">
             <input type = "text" value= {searchInput} onChange={(e)=> setSearchInput(e.target.value)} placeholder = "Search..." >
             </input>
             <SearchIcon className='Searchicon'/>
            </div>
            <div>
                <Clock/>
            </div>
            <div className='Accountlogo' onClick={toggle}  ref={menuref}>
             <img src={AccountLogo} alt="Account LOGO" ></img>
             {isOpen ? <UserAccountMenu data={isOpen}  /> : ""}
            </div>
        </div>
    )
}

export default Searchbar
