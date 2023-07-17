import '../css/supplier.css'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import AddSupplier from '../components/addsupplier'
import BasicTable from '../components/tablesupplier'


function Suppliers() {
  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  const handleButtonClick = (e) => {
    e.preventDefault()
    setIsAddSupplierOpen(true)
  }

  return (
    <div className='supplier-container'>
      <button className='add-customer-btn' onClick={handleButtonClick}>Add Supplier</button>
      {
        isAddSupplierOpen && <AddSupplier closeAddSupplier={() => setIsAddSupplierOpen(false)} />
      }
      <BasicTable/>
    </div>
  )
}

export default Suppliers