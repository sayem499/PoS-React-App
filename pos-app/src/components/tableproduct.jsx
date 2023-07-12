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
import { allProducts, deleteProduct, reset } from '../redux/products/productSlice';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Updateproduct from './updateproduct';
import '../css/tableproduct.css'






export default function BasicTable() {
  const {searchInput} = useSelector( (state) => state.search)
  let rows = []
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const { products, isSuccess, isError, isLoading, message } = useSelector((state) => state.products)
  const [isUpdateProductOpen, setIsUpdateProductOpen] = useState(false)
  const [updateID, setUpdateID] = useState('')

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }

    if (isError) {
      console.log(message)
    }
    dispatch(allProducts())

  }, [user, isError, message, navigate, dispatch])


  if (products) {
    rows = products
  }

  const handleUpdate = (ID) =>{
    setUpdateID(ID)
  }
  const handleClick = () => {
    setIsUpdateProductOpen(true)

  }

  return (
    <div className='table-container'>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell align="right">Product Brand</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Category</TableCell>
              <TableCell align="right">Unit Price&nbsp;(Tk.)</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {searchInput === '' ? rows.map((row) => (
              <TableRow
                key={row._id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.productTitle}
                </TableCell>
                <TableCell align="right">{row.productBrand}</TableCell>
                <TableCell align="right">{row.productQuantity}</TableCell>
                <TableCell align="right">{row.productType}</TableCell>
                <TableCell align="right">{row.productUnitPrice}</TableCell>
                <TableCell align="right"> <EditIcon onClick={() => { handleClick(); handleUpdate(row._id); }} /> <DeleteIcon onClick={() => { dispatch(deleteProduct(row._id)); dispatch(allProducts()); }} />
                  {isUpdateProductOpen && updateID === row._id && <Updateproduct row={row} closeUpdateProduct={() => { setIsUpdateProductOpen(false); }} />}
                </TableCell>
              </TableRow>
            )) : rows.filter((row) => row.productTitle.toLowerCase().includes(searchInput.toLowerCase())).map((row) => (
              <TableRow
                key={row._id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.productTitle}
                </TableCell>
                <TableCell align="right">{row.productBrand}</TableCell>
                <TableCell align="right">{row.productQuantity}</TableCell>
                <TableCell align="right">{row.productType}</TableCell>
                <TableCell align="right">{row.productUnitPrice}</TableCell>
                <TableCell align="right"> <EditIcon onClick={() => { handleClick(); handleUpdate(row._id); }} /> <DeleteIcon onClick={() => { dispatch(deleteProduct(row._id)); dispatch(allProducts()); }} />
                  {isUpdateProductOpen && updateID === row._id && <Updateproduct row={row} closeUpdateProduct={() => { setIsUpdateProductOpen(false); }} />}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
  
}