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
import '../css/tablecustomer.css'
import { getCustomers, deleteCustomer} from '../redux/customer/customerSlice';
import UpdateCustomer from './updateCustomer';


export default function BasicTable() {
    const {searchInput} = useSelector( (state) => state.search)
    const {customers, isCustomerError, message} = useSelector((state) => state.customerState) 

    
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const [isUpdateCustomerOpen, setIsUpdateCustomerOpen] = useState(false)
    const [updateID, setUpdateID] = useState('')
    let rows
  
    useEffect(() => {
      if (!user) {
        navigate('/login')
      }
      
      if (isCustomerError) {
        console.log(message)
      }

      dispatch(getCustomers())
      
  
    }, [user, isCustomerError, message, navigate, dispatch])
  
    if(customers){
      rows = customers
    }
   
  
    const handleUpdate = (ID) =>{
      setUpdateID(ID)
    }
    const handleClick = () => {
        setIsUpdateCustomerOpen(true)
  
    }
  
    return (
      <div className='table-container'>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="right">Customer Name</TableCell>
                <TableCell align="right">Customer Mobile No.</TableCell>
                <TableCell align="right">Customer Total Expenditure&nbsp;(Tk.)</TableCell>
                <TableCell align="right">Customer Total Trades</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {searchInput === '' ? rows?.map((row) => (
                <TableRow
                  key={row._id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.customerName}
                  </TableCell>
                  <TableCell align="right">{row.customerPhoneNumber}</TableCell>
                  <TableCell align="right">{row.customerTotalExpenditure}</TableCell>
                  <TableCell align="right">{row.customerTotalTrades}</TableCell>
                  <TableCell align="right"> <EditIcon onClick={() => { handleClick(); handleUpdate(row._id); }} /> <DeleteIcon onClick={() => { dispatch(deleteCustomer(row._id)); dispatch(getCustomers()); }} />
                    {isUpdateCustomerOpen && updateID === row._id && <UpdateCustomer row={row} closeUpdateCustomer={() => { setIsUpdateCustomerOpen(false); }} />}
                  </TableCell>
                </TableRow>
              )) : rows.filter((row) => row.customerPhoneNumber.toLowerCase().includes(searchInput.toLowerCase())).map((row,key) => (
                <TableRow
                  key={row._id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.customerName}
                  </TableCell>
                  <TableCell align="right">{row.customerPhoneNumber}</TableCell>
                  <TableCell align="right">{row.customerTotalExpenditure}</TableCell>
                  <TableCell align="right">{row.customerToalTrades}</TableCell>
                  <TableCell align="right"> <EditIcon onClick={() => { handleClick(); handleUpdate(row._id); }} /> <DeleteIcon onClick={() => { dispatch(deleteCustomer(row._id)); dispatch(getCustomers()); }} />
                    {isUpdateCustomerOpen && updateID === row._id && <UpdateCustomer row={row} closeUpdateCustomer ={() => { setIsUpdateCustomerOpen(false); }} />}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
    
  }