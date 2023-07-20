import '../css/addsupplier.css'
import { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { setSupplier, getSupplier, updateSupplier, resetSuppliers } from '../redux/supplier/supplierSlice'


function AddSupplier({ closeAddSupplier }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [supplierProductsState, setSupplierProductsState] = useState([{
    productTitle: '',
    productBrand: '',
    productQuantity: 0,
    productType: '',
    productUnitPrice: 0,
    productBarcode: ''
  }])
  const [supplierName, setSupplierName] = useState('')
  const [supplierPhoneNumber, setSupplierPhoneNumber] = useState('')
  const [supplierAddress, setSupplierAddress] = useState('')
  const [supplierEmail, setSupplierEmail] = useState('')
  const [supplierProductBarcode, setSupplierProductBarcode] = useState('')
  const SupplierExists = useRef(false)


  const { suppliers, isSupplierLoading, isSupplierError, isSupplierSuccess, message } = useSelector((state) => state.supplierState)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }

    if (isSupplierError) {
      toast.error(message)
    }


    return () => {
      dispatch(resetSuppliers())
      dispatch(getSupplier())
    }



  }, [user, isSupplierError, message, dispatch, navigate])



  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (supplierName === '' || supplierPhoneNumber === '')
      toast.error('Please fill the required fields!')

    suppliers.filter((supplier) => supplier.supplierName === supplierName || supplier.supplierPhoneNumber === supplierPhoneNumber).forEach((supplier) => {
      if (supplier.supplierName === supplierName || supplier.supplierPhoneNumber === supplierPhoneNumber) {
        SupplierExists.current = true

        let supplierName = supplier.supplierName
        let supplierPhoneNumber = supplier.supplierPhoneNumber
        let supplierAddress = supplier.supplierAddress
        let supplierEmail = supplier.supplierEmail
        let supplierProduct = [...supplier.supplierProducts]
        supplierProductsState.forEach((product) => {
          supplierProduct.splice(supplier.supplierProducts.length, 0, product)
        })
        let supplierProducts = supplierProduct
        const updatedSupplierData = {
          supplierProducts,
          supplierName,
          supplierPhoneNumber,
          supplierAddress,
          supplierEmail,
        }

        let supplierID = supplier._id
        const payload = {
          supplierID,
          updatedSupplierData,
        }

        dispatch(updateSupplier(payload))

        if (isSupplierSuccess) {
          toast.success('Supplier Exists! updated supplier successfully!')
        }
        setSupplierName('')
        setSupplierPhoneNumber('')
        setSupplierAddress('')
        setSupplierEmail('')
      } else {
        let supplierProducts = supplierProductsState
        const customerData = {
          supplierProducts,
          supplierName,
          supplierPhoneNumber,
          supplierAddress,
          supplierEmail,
        }

        try {
          dispatch(setSupplier(customerData))

        } catch (error) {
          console.log(error)
        }

        if (isSupplierSuccess) {
          toast.success('Supplier created successfully!')
        }

        setSupplierName('')
        setSupplierPhoneNumber('')
        setSupplierAddress('')
        setSupplierEmail('')
      }


    })
    
    if (!SupplierExists.current) {
      let supplierProducts = supplierProductsState
      const customerData = {
        supplierProducts,
        supplierName,
        supplierPhoneNumber,
        supplierAddress,
        supplierEmail,
      }

      try {
        dispatch(setSupplier(customerData))

      } catch (error) {
        console.log(error)
      }

      if (isSupplierSuccess) {
        toast.success('Supplier created successfully!')
      }

      setSupplierName('')
      setSupplierPhoneNumber('')
      setSupplierAddress('')
      setSupplierEmail('')
    }

  }

  const handleClick = (e) => {
    e.preventDefault()

    setSupplierProductsState([...supplierProductsState, {
      productTitle: '',
      productBrand: '',
      productQuantity: 0,
      productType: '',
      productUnitPrice: 0,
      productBarcode: ''
    }])

  }

  const handleChange = (e, i) => {
    e.preventDefault()
    const { name, value } = e.target
    const onChangeValue = [...supplierProductsState]
    if (name === 'productQuantity' || name === 'productUnitPrice') {
      onChangeValue[i][name] = parseInt(value)
    } else {
      onChangeValue[i][name] = value
    }
    setSupplierProductsState(onChangeValue)
  }

  const handleDelete = (e, i) => {
    e.preventDefault()
    const deleteVal = [...supplierProductsState]
    deleteVal.splice(i, 1)
    setSupplierProductsState(deleteVal)
  }


  return (
    <div className='addsupplier-container' onClick={(e) => { if (e.target.className === 'addsupplier-container') closeAddSupplier() }}>
      <div className='addsupplierform'>
        <span>ADD SUPPLIER</span>
        <form onSubmit={handleSubmit}>
          <label htmlFor='supplierName'>Supplier Name</label>
          <input value={supplierName} onChange={e => setSupplierName(e.target.value)} placeholder='Supplier Name' type='text' name='supplierName' />
          <label htmlFor='supplierPhoneNumber'>Supplier Mobile No.</label>
          <input value={supplierPhoneNumber} onChange={e => setSupplierPhoneNumber(e.target.value)} placeholder='Supplier Mobile Number' type='tel' name='supplierPhoneNumber' />
          <label htmlFor='supplierAddress'>Supplier Address</label>
          <input value={supplierAddress} onChange={e => setSupplierAddress(e.target.value)} placeholder='Supplier Address' type='text' name='supplierAddress'></input>
          <label htmlFor='supplierEmail'>Supplier E-mail</label>
          <input value={supplierEmail} onChange={e => setSupplierEmail(e.target.value)} placeholder='Supplier Email' type='email' name='supplierEmail'></input>
          <span>Suplier Products</span>
          <button className='btn-add-supplier-product' onClick={(e) => handleClick(e)}>Add Product+</button>
          <div className='product-input-container'>

            {
              supplierProductsState.map((val, i) => {
                return (
                  <div className='product-input' key={i}>
                    <span>Product #{i}</span>
                    <label htmlFor='ProductName'>Product Title</label>
                    <input value={val.productTitle} onChange={e => handleChange(e, i)} placeholder='Product Name' type='text' name='productTitle' />
                    <label htmlFor='ProductBrand'>Product Brand</label>
                    <input value={val.productBrand} onChange={e => handleChange(e, i)} placeholder='Product Brand' type='text' name='productBrand' />
                    <label htmlFor='productQuantity'>Quantity</label>
                    <input value={val.productQuantity} onChange={e => handleChange(e, i)} placeholder='Quantity' type='number' name='productQuantity' />
                    <label htmlFor='productType'>Category</label>
                    <input value={val.productType} onChange={e => handleChange(e, i)} placeholder='Category' type='text' name='productType' />
                    <label htmlFor='productUnitPrice'>Unit Price (Tk.)</label>
                    <input value={val.productUnitPrice} onChange={e => handleChange(e, i)} placeholder='Product Unit Price' type='number' name='productUnitPrice' />
                    <label htmlFor='productBarcode'>Product Barcode</label>
                    <input value={supplierProductBarcode} onChange={e => handleChange(e, i)} placeholder='Product Barcode' type='text' name='productBarcode'/>
                    <button onClick={(e) => handleDelete(e, i)}>Delete Product-</button>
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