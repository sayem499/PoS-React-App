import '../css/updatecustomer.css'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { Blocks } from 'react-loader-spinner'
import { useNavigate } from 'react-router-dom'
import { getCustomers, resetCustomers, updateCustomer } from '../redux/customer/customerSlice'


function UpdateCustomer({row,closeUpdateCustomer}) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
    const { customers, isCustomerLoading, isCustomerError, isCustomerSuccess, message } = useSelector( (state) => state.customerState)
    const [customerName, setCustomerName] = useState(row.customerName)
    const [customerPhoneNumber, setCustomerPhoneNumber] = useState(row.customerPhoneNumber)
    const [customerTotalExpenditure] = useState(row.customerTotalExpenditure)
    const [customerTotalTrades] = useState(row.customerTotalTrades)
   
    const  { user } = useSelector( (state) => state.auth)

    useEffect( () => {
      if(!user){
        navigate('/login')
      }
      
      if(isCustomerError){
        toast.error(message)
      }

      return() =>{ 
        dispatch(resetCustomers()) 
        dispatch(getCustomers())
      }
      

    },[ isCustomerError, message, dispatch])

  

    const handleSubmit = (e) => {
      e.preventDefault()
    
      if( customerName === '' || customerPhoneNumber === '')
        toast.error('Please fill the required fields!')

        const updatedCustomerData = {
            customerName,
            customerPhoneNumber,
            customerTotalExpenditure,
            customerTotalTrades
        }

        let customerID = row._id
        const payload = {
            customerID,
            updatedCustomerData,     
        }
        dispatch(updateCustomer(payload))

        if(isCustomerSuccess){
          toast.success('Product updated successfully!')
        }
    }


  return (
    <div className='updatecustomer-container' onClick={(e) => { if(e.target.className === 'updatecustomer-container')  closeUpdateCustomer()}}>
      <div className='updatecustomerform'>
        <span>UPDATE CUSTOMER</span>
        <form onSubmit={handleSubmit}>
          <label htmlFor='customerName'>Customer Name</label>
          <input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder='Customer Name' type='text' name='customerName'/>
          <label htmlFor='customerPhoneNumber'>Customer Mobile No.</label>
          <input value={customerPhoneNumber} onChange={e => setCustomerPhoneNumber(e.target.value)} placeholder='Customer Mobile Number' type='text' name='customerPhoneNumber'/>
          <button type='submit' className='btn-customer-submit'>Submit</button>
        </form>
      </div>

    </div>
  )
}

export default UpdateCustomer