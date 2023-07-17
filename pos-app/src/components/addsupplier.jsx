import '../css/addsupplier.css'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { setSupplier, getSupplier, resetSuppliers } from '../redux/supplier/supplierSlice'


function AddSupplier({closeAddSupplier}) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [supplierProducts, setSupplierProducts] = useState([{
        productTitle: '',
        productBrand: '',
        productQuantity: 0,
        productType: '',
        productUnitPrice: 0
    }])
    const [supplierName, setSupplierName] = useState('')
    const [supplierPhoneNumber, setSupplierPhoneNumber] = useState('')
    const [supplierAddress, setSupplierAddress] = useState('')
    const [supplierEmail, setSupplierEmail] = useState('')
    const { suppliers, isSupplierLoading, isSupplierError, isSupplierSuccess, message } = useSelector( (state) => state.supplierState)
    const  { user } = useSelector( (state) => state.auth)

    useEffect( () => {
      if(!user){
        navigate('/login')
      }
      
      if(isSupplierError){
        toast.error(message)
      }
      

      return() =>{ 
        dispatch(resetSuppliers()) 
        dispatch(getSupplier())
      }
      
     

    },[user, isSupplierError, message, dispatch, navigate ])

  

    const handleSubmit = (e) => {
      e.preventDefault()
    
      if( supplierName === '' || supplierPhoneNumber === '' )
        toast.error('Please fill the required fields!')

        const customerData = {
            supplierProducts,
            supplierName,
            supplierPhoneNumber,
            supplierAddress,
            supplierEmail,
        }

        try{
          dispatch(setSupplier(customerData))

        }catch (error){
          console.log(error)
        }
        
        if(isSupplierSuccess){
          toast.success('Product created successfully!')
      }
    
        setSupplierName('')
        setSupplierPhoneNumber('')
        setSupplierAddress('')
        setSupplierEmail('')



    }

    const handleClick = (e) => {
      e.preventDefault()
      setSupplierProducts([...supplierProducts, {
        productTitle: '',
        productBrand: '',
        productQuantity: 0,
        productType: '',
        productUnitPrice: 0,
    }])

    }

    const handleChange = (e,i) =>{
      e.preventDefault()
      const {name, value} = e.target
      const onChangeValue = [...supplierProducts]
      if(name === 'productQuantity' || name === 'productUnitPrice'){
        onChangeValue[i][name] = parseInt(value)
      }else{
        onChangeValue[i][name] = value
      }
      setSupplierProducts(onChangeValue)
    }

    const handleDelete = (e,i) =>{
      e.preventDefault()
      const deleteVal = [...supplierProducts]
      deleteVal.splice(i,1)
      setSupplierProducts(deleteVal)
    }


  return (
    <div className='addsupplier-container' onClick={(e) => { if(e.target.className === 'addsupplier-container')  closeAddSupplier()}}>
      <div className='addsupplierform'>
        <span>ADD SUPPLIER</span>
        <form onSubmit={handleSubmit}>
          <label htmlFor='supplierName'>Supplier Name</label>
          <input value={supplierName} onChange={e => setSupplierName(e.target.value)} placeholder='Supplier Name' type='text' name='supplierName'/>
          <label htmlFor='supplierPhoneNumber'>Supplier Mobile No.</label>
          <input value={supplierPhoneNumber} onChange={e => setSupplierPhoneNumber(e.target.value)} placeholder='Supplier Mobile Number' type='tel' name='supplierPhoneNumber'/>
          <label htmlFor='supplierAddress'>Supplier Address</label>
          <input value={supplierAddress} onChange={e => setSupplierAddress(e.target.value)} placeholder='Supplier Address' type='text' name='supplierAddress'></input>
          <label htmlFor='supplierEmail'>Supplier E-mail</label>
          <input value={supplierEmail} onChange={e => setSupplierEmail(e.target.value)} placeholder='Supplier Email' type='email' name='supplierEmail'></input>
          <span>Suplier Products</span>
          <button className='btn-add-supplier-product' onClick={(e) => handleClick(e)}>Add Product+</button>
          <div className='product-input-container'>
            
              {
                supplierProducts.map((val, i) => {
                  return(
                  <div className='product-input' key = {i}>
                    <span>Product #{i}</span>
                    <label htmlFor='ProductName'>Product Title</label>
                    <input value={val.productTitle} onChange={e => handleChange(e, i)} placeholder='Product Name' type='text' name='productTitle'/>
                    <label htmlFor='ProductBrand'>Product Brand</label>
                    <input value={val.productBrand} onChange={e => handleChange(e, i)} placeholder='Product Brand' type='text' name='productBrand'/>
                    <label htmlFor='productQuantity'>Quantity</label>
                    <input value={val.productQuantity} onChange={ e => handleChange(e, i)} placeholder='Quantity' type='number' name='productQuantity'/>
                    <label htmlFor='productType'>Category</label>
                    <input value={val.productType} onChange={ e => handleChange(e, i)} placeholder='Category' type='text' name='productType'/>
                    <label htmlFor='productUnitPrice'>Unit Price (Tk.)</label>
                    <input value={val.productUnitPrice} onChange={ e => handleChange(e, i)} placeholder='Product Unit Price' type='number' name='productUnitPrice'/>
                    <button onClick={(e)=>handleDelete(e,i)}>Delete Product-</button>
                  </div>
                  )
                })
                
              }
          </div>
          <button type='submit' className='btn-supplier-submit'>Submit</button>
        </form>
      </div>

    </div>
  )
}

export default AddSupplier