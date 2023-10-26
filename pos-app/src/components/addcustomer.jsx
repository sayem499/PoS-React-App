import '../css/addcustomer.css'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { Blocks } from 'react-loader-spinner'
import { useNavigate } from 'react-router-dom'
import { getCustomers, resetCustomers, setCustomers } from '../redux/customer/customerSlice'


function AddCustomer({closeAddCustomer}) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
    const { customers, isLoading, isError, isSuccess, message } = useSelector( (state) => state.customerState)
    const [customerName, setCustomerName] = useState('')
    const [customerPhoneNumber, setCustomerPhoneNumber] = useState('')
    const customerTotalExpenditure = 0, customerTotalTrades = 0
  

   
    const  { user } = useSelector( (state) => state.auth)

    useEffect( () => {
      if(!user){
        navigate('/login')
      }
      
      if(isError){
        toast.error(message)
      }
      

      return() =>{ 
        dispatch(resetCustomers()) 
        dispatch(getCustomers())
      }
      

    },[ isError, message, dispatch ])

  

    const handleSubmit = (e) => {
      e.preventDefault()
    
      if( customerName === '' || customerPhoneNumber === '')
        toast.error('Please fill the required fields!')

        const customerData = {
            customerName,
            customerPhoneNumber,
            customerTotalExpenditure,
            customerTotalTrades
        }

        try{
          dispatch(setCustomers(customerData))

        }catch (error){
          console.log(error)
        }
        
        if(isSuccess){
          toast.success('Product created successfully!')
        }

        setCustomerName('')
        setCustomerPhoneNumber('')


    }


  return (
    <div className='addcustomer-container' onClick={(e) => { if(e.target.className === 'addcustomer-container')  closeAddCustomer()}}>
      <div className='addcustomerform'>
        <span>ADD CUSTOMER</span>
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

export default AddCustomer