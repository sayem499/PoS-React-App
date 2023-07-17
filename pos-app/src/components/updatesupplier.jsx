import { useEffect, useState } from "react"
import '../css/updatesupplier.css'
import { updateSupplier, resetSuppliers, getSupplier } from '../redux/supplier/supplierSlice'
import { useDispatch, useSelector } from "react-redux"
import { toast } from 'react-toastify'
import { useNavigate } from "react-router-dom"



function UpdateSupplier({ row, closeUpdateSupplier}) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {isSupplierSuccess, isSupplierError, message} = useSelector((state) => state.supplierState)
    const {user} = useSelector((state) => state.auth)
    const [supplierName, setSupplierName] = useState(row.supplierName)
    const [supplierPhoneNumber, setSupplierPhoneNumber] = useState(row.supplierPhoneNumber)
    const [supplierAddress, setSupplierAddress] = useState(row.supplierAddress)
    const [supplierEmail, setSupplierEmail] = useState(row.supplierEmail)
    const [supplierProducts] = useState(row.supplierProducts) 

    useEffect(() => {
        
        if(!user){
            navigate('/login')
        }
        if(isSupplierError){
            toast.error(message)
          } 
        return() => {
          dispatch(resetSuppliers())
          dispatch(getSupplier())
        }  
       
    },[user, isSupplierError, message, navigate, dispatch])


  const handleSubmit = (e) =>{
    e.preventDefault()

    if (supplierName === '' || supplierPhoneNumber === '' || supplierAddress === '' || supplierEmail == '')
      toast.error('Please fill the required fields!')
    else {
      const updatedSupplierData = {
        supplierName,
        supplierPhoneNumber,
        supplierAddress,
        supplierEmail,
        supplierProducts
      }
      let supplierID = row._id
      const payload = {
        supplierID,
        updatedSupplierData,
      }

      dispatch(updateSupplier(payload))
    }


    if (isSupplierSuccess) {
      toast.success('Product updated successfully!')
    }
  }


  return (
    <div className='updatesupplier-container' onClick={(e) => { if(e.target.className === 'updatesupplier-container')  closeUpdateSupplier()}}>
      <div className='updatesupplierform'>
        <span>UPDATE PRODUCT</span>
        <form onSubmit={handleSubmit}>
          <label htmlFor='supplierName'>Supplier Name</label>
          <input value={supplierName} onChange={e => setSupplierName(e.target.value)} placeholder='Supplier Name' type='text' name='supplierName'/>
          <label htmlFor='supplierPhoneNumber'>Supplier Phone Number</label>
          <input value={supplierPhoneNumber} onChange={e => setSupplierPhoneNumber(e.target.value)} placeholder='Supplier Phone No.' type='tel' name='supplierPhoneNumber'/>
          <label htmlFor='supplierAddress'>Supplier Address</label>
          <input value={supplierAddress} onChange={ e => setSupplierAddress(e.target.value)} placeholder='Supplier Address' type='text' name='supplierAddress'/>
          <label htmlFor='supplierEmail'>Supplier Email</label>
          <input value={supplierEmail} onChange={ e => setSupplierEmail(e.target.value)} placeholder='Supplier Email' type='text' name='supplierEmail'/>
          <button type='submit' className='btn'>Submit</button>
        </form>
      </div>

    </div>
  )
}

export default UpdateSupplier