import '../css/users.css'
import Registeruser  from '../components/registeruser.jsx'
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/loading';
import { toast } from 'react-toastify'
import BasicTable from '../components/tableuser'
import { allUsers } from '../redux/users/userSlice';

function Users(){
    const dispatch = useDispatch()
    const {users, isLoading, isError, message} = useSelector((state) => state.users)
    const {user} = useSelector((state) => state.auth)
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)
    
    
    useEffect(() => {
      if(isError){
        toast.error(message)
      }

      if(!user){
        navigate('/login')
      }

      
      dispatch(allUsers())
      

      

    }, [user, isError, message, navigate, dispatch])

    /* const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'userName', headerName: 'Username', width: 130 },
        { field: 'userType', headerName: 'User Type', width: 130 },
        {
          field: 'fullName',
          headerName: 'Full name',
          description: 'This column has a value getter and is not sortable.',
          sortable: false,
          width: 160,
          valueGetter: (params) =>
            `${params.row.firstName || ''} ${params.row.lastName || ''}`, 
        },
      ];

  
      
      let rows = []
      if(users.users){
        let i= (-1);
        rows = users.users.map( values => {
          i++
          return { ...values, id: i}
          
        })
      } */

      const handleClick = (e) => {
        e.preventDefault()
        setIsOpen(true)
      }
    
    return(
      <div className='users'>
        <div className='adduser'>
          <button className="add-user-btn" onClick={handleClick} >Add User</button>
          <div className='registerUser'>
            {isOpen ? <Registeruser  closeAddUser = {() =>{

              setIsOpen(false)
            }}/>: ""}
          </div>
        </div>
        <div className='activeuser'><span >Active Users</span></div>
        
        <div className='usertable'>
          {users && <BasicTable/>}
        </div>
      </div>
    )
}

export default Users 