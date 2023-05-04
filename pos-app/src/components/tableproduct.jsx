import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEffect } from 'react';
import { allProducts, reset } from '../redux/products/productSlice';



let rows = []

export default function BasicTable() {
    const navigate = useNavigate()
    const {user} = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const { products, isError, isLoading, message } = useSelector( (state) => state.products )
    
    useEffect(() => {
        if(isError){
            console.log(message)
        }

        if(!user){
            navigate('/login')
        }

        dispatch(allProducts())

        return() => {
            dispatch(reset())
          }

    },[ user, isError, message, navigate, dispatch])

    if(products.products){
        rows = products.products
        console.log(rows)
      }

    return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Product Name</TableCell>
            <TableCell align="right">Product Brand</TableCell>
            <TableCell align="right">Quantity&nbsp;()</TableCell>
            <TableCell align="right">Category&nbsp;()</TableCell>
            <TableCell align="right">Unit Price&nbsp;(Tk.)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.productTitle}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.productTitle}
              </TableCell>
              <TableCell align="right">{row.productBrand}</TableCell>
              <TableCell align="right">{row.productQuantity}</TableCell>
              <TableCell align="right">{row.productType}</TableCell>
              <TableCell align="right">{row.productUnitPrice}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}