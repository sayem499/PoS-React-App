import '../css/searchbar.css'
import SearchIcon from '@mui/icons-material/Search';
import Accountlogo from "../assets/accountlogo.png"

function Searchbar() {

    return(
        <div className="Searchbar">
            <div className="Searchbox">
             <input type = "text" placeholder = "Search..." >
             </input>
             <SearchIcon className='Searchicon'/>
            </div>
            <div className='Accountlogo'>
             <img src={Accountlogo} alt="Account LOGO"></img>
            </div>
        </div>
    )
}

export default Searchbar
