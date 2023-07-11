import BasicTable from '../components/tablecustomer'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import '../css/customers.css'
import AddCustomer from '../components/addcustomer'


function Customers(){
    const {user} = useSelector((state) => state.auth)
    const navigate = useNavigate()
    const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false)

    useEffect(() => {
        if(!user){
            navigate('/login')
        }
    },[user, navigate])

    const handleButtonClick = (e) => {
        e.preventDefault() 
        setIsAddCustomerOpen(true)
       }


    return(
        <div className='customer-container'>
         <button  className='add-customer-btn' onClick={handleButtonClick}>Add Customer</button>
          {isAddCustomerOpen && <AddCustomer closeAddCustomer = { () => {setIsAddCustomerOpen(false) }}/>}   
          {<BasicTable/>}
        </div>
    )
}

export default Customers