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
import InventoryIcon from '@mui/icons-material/Inventory';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import '../css/tablesupplier.css'
import { getSupplier, deleteSupplier} from '../redux/supplier/supplierSlice';
import UpdateSupplier from './updatesupplier';
import UpdateSupplierProduct from './updatesupplierproduct';



export default function BasicTable() {
    const {searchInput} = useSelector( (state) => state.search)
    const {suppliers, isSupplierError, message} = useSelector((state) => state.supplierState) 

    
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const [isUpdateSupplierOpen, setIsUpdateSupplierOpen] = useState(false)
    const [isUpdateSupplierProductOpen, setIsUpdateSupplierProductOpen] = useState(false)
    const [updateID, setUpdateID] = useState('')
    const [updateProductID, setUpdateProductID] = useState('')
    let rows
  
    useEffect(() => {
      if (!user) {
        navigate('/login')
      }
      
      if (isSupplierError) {
        console.log(message)
      }

      dispatch(getSupplier())
      

    }, [user, isSupplierError, message, navigate, dispatch])
  
    if(suppliers){
      rows = suppliers
    }
   
  
    const handleUpdate = (ID) =>{
      setUpdateID(ID)
    }
    const handleUpdateProduct = (ID) =>{
      setUpdateProductID(ID)
    }

    const handleClick = () => {
        setIsUpdateSupplierOpen(true)
  
    }

   const handleUpdateSupplierProductClick = () => {
      setIsUpdateSupplierProductOpen(true)
    }
  
    return (
      <div className='table-container-supplier'>
        <div className='supplier-table'>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Supplier Name</TableCell>
                <TableCell align="left">Supplier Mobile No.</TableCell>
                <TableCell align="left">Supplier Address</TableCell>
                <TableCell align="left">Supplier Email</TableCell>
                <TableCell align="left">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {searchInput === '' ? rows?.map((row) => (
                <TableRow
                  key={row._id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}  
                >
                  <TableCell component="th" scope="row">
                    {row.supplierName}
                  </TableCell>
                  <TableCell align="left">{row.supplierPhoneNumber}</TableCell>
                  <TableCell align="left">{row.supplierAddress}</TableCell>
                  <TableCell align="left">{row.supplierEmail}</TableCell>
                  <TableCell align="left"> 
                  <InventoryIcon onClick = {() => handleUpdateProduct(row._id)}/>
                  <EditIcon onClick={() => { handleClick(); handleUpdate(row._id); }} /> 
                  <DeleteIcon onClick={() => { dispatch(deleteSupplier(row._id)); dispatch(getSupplier()); }} />
                    {isUpdateSupplierOpen && updateID === row._id && <UpdateSupplier row={row} closeUpdateSupplier={() => { setIsUpdateSupplierOpen(false); }} />}
                  </TableCell>
                </TableRow>
              )) : rows.filter((row) => row.supplierName.toLowerCase().includes(searchInput.toLowerCase())).map((row,key) => (
                <TableRow
                  key={row._id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }} 
                  >
                  <TableCell component="th" scope="row">
                    {row.supplierName}
                  </TableCell>
                  <TableCell align="left">{row.supplierPhoneNumber}</TableCell>
                  <TableCell align="left">{row.supplierAddress}</TableCell>
                  <TableCell align="left">{row.supplierEmail}</TableCell>
                  <TableCell align="left"> 
                  <InventoryIcon onClick = {() => handleUpdateProduct(row._id)}/>
                  <EditIcon onClick={() => { handleClick(); handleUpdate(row._id); }} /> 
                  <DeleteIcon onClick={() => { dispatch(deleteSupplier(row._id)); dispatch(getSupplier()); }} />
                    {isUpdateSupplierOpen && updateID === row._id && <UpdateSupplier row={row} closeUpdateSupplier ={() => { setIsUpdateSupplierOpen(false); }} />}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        </div>


        <div className='supplier-product-table'>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Product Title</TableCell>
                <TableCell align="left">Product Brand</TableCell>
                <TableCell align="left">Quantity</TableCell>
                <TableCell align="left">Category</TableCell>
                <TableCell align="left">Unit Price (Tk.)</TableCell>
                <TableCell align="left">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>  
            {updateProductID && rows?.filter((row) => updateProductID === row._id).map((row,key) => {
             return(
              <>
              {row.supplierProducts.map((product,key) => {
                  return(
                  <TableRow
                      key={key}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {product.productTitle}
                      </TableCell>
                      <TableCell align="left">{product.productBrand}</TableCell>
                      <TableCell align="left">{product.productQuantity}</TableCell>
                      <TableCell align="left">{product.productType}</TableCell>
                      <TableCell align="left">{product.productUnitPrice}</TableCell>
                      <TableCell align="left"> 
                      <EditIcon onClick={() => {handleUpdateSupplierProductClick();}} /> 
                      <DeleteIcon onClick={()=>{}} />
                      {isUpdateSupplierProductOpen && <UpdateSupplierProduct i={key} product={product} row={row} closeUpdateSupplierProduct = {() => { setIsUpdateSupplierProductOpen(false); }} />}
                      </TableCell>
                    </TableRow>
                  )
                  })}
            </>
            )})}
            </TableBody>
          </Table>
        </TableContainer>
          
        </div>
      </div>
    );
    
  }