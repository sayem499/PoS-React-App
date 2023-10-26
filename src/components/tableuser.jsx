import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { toast } from 'react-toastify';
import { allUsers, deleteUser, reset } from '../redux/users/userSlice';
import Updateuser from '../components/updateuser'




function BasicTable() {
    const { searchInput } = useSelector((state) => state.search)
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.auth)
    const { users, isError, message } = useSelector( (state) => state.users )
    const dispatch = useDispatch()
    const [isUpdateUserOpen, setIsUpdateUserOpen] = useState(false)
    const [updateID, setUpdateID] = useState('')
    let rows

    useEffect(() => {
        if (!user) {
          navigate('/login')
        }
        
        if (isError) {
          toast.error(message)
        }
        
        dispatch(allUsers())
        return() => {
            dispatch(reset())
        }
        
    
      }, [user, isError, message, navigate, dispatch])
    
      if(users){
        rows = users
      }
     
    
      const handleUpdate = (ID) =>{
        setUpdateID(ID)
      }
      const handleClick = () => {
          setIsUpdateUserOpen(true)
    
      }

    
    return (
        <div className='table-container-user'>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="right">Username</TableCell>
                            <TableCell align="right">User Type</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {searchInput === '' ? rows?.map((row) => (
                            <TableRow
                                key={row._id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row" align="right">
                                    {row.userName}
                                </TableCell>
                                <TableCell align="right">{row.userType}</TableCell>
                                <TableCell align="right"> <EditIcon onClick={() => { handleClick(); handleUpdate(row._id); }} /> <DeleteIcon onClick={() => { dispatch(deleteUser(row._id)); dispatch(allUsers()); }} />
                                    {isUpdateUserOpen && updateID === row._id && user.userType === 'admin' && <Updateuser row={row} closeUpdateUser={() => { setIsUpdateUserOpen(false); }} />}
                                </TableCell>
                            </TableRow>
                        )) : rows.filter((row) => row.userName.toLowerCase().includes(searchInput.toLowerCase())).map((row, key) => (
                            <TableRow
                                key={row._id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row" align="right">
                                    {row.userName}
                                </TableCell>
                                <TableCell align="right">{row.userType}</TableCell>
                                <TableCell align="right"> <EditIcon onClick={() => { handleClick(); handleUpdate(row._id); }} /> <DeleteIcon onClick={() => { dispatch(deleteUser(row._id)); dispatch(allUsers()); }} />
                                    {isUpdateUserOpen && updateID === row._id && user.userType === 'admin' && <Updateuser row={row} closeUpdateCustomer={() => { setIsUpdateUserOpen(false); }} />}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default BasicTable