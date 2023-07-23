import '../css/addsupplier.css'
import { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { setSupplier, getSupplier, updateSupplier, resetSuppliers } from '../redux/supplier/supplierSlice'
import BarcodeReader from 'react-barcode-reader'

function AddSupplier({ closeAddSupplier }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [supplierName, setSupplierName] = useState('')
  const [supplierPhoneNumber, setSupplierPhoneNumber] = useState('')
  const [supplierAddress, setSupplierAddress] = useState('')
  const [supplierEmail, setSupplierEmail] = useState('')
  const [productTitle, setProductTitle] = useState('')
  const [productBrand, setProductBrand] = useState('')
  const [productQuantity, setProductQuantity] = useState(0)
  const [productType, setProductType] = useState('')
  const [productUnitPrice, setProductUnitPrice] = useState(0)
  const [productBarcode, setProductBarcode] = useState('')
  const SupplierExists = useRef(false)
  const supplierProductsRef = useRef('')


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
        let productData = {
          productTitle,
          productBrand,
          productQuantity,
          productType,
          productUnitPrice,
          productBarcode,
        }


        supplierProduct.splice(supplier.supplierProducts.length, 0, productData)
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
      }
    })

    if (!SupplierExists.current) {

        let productData = {
          productTitle,
          productBrand,
          productQuantity,
          productType,
          productUnitPrice,
          productBarcode,
        }

      let supplierProducts = productData
      supplierProductsRef.current = productData
      
      const supplierData = {
        supplierProducts,
        supplierName,
        supplierPhoneNumber,
        supplierAddress,
        supplierEmail,
      }

      try {
        dispatch(setSupplier(supplierData))

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

 

  const handleScan = (data) => {
    setProductBarcode(data)
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
          <span>Suplier Product</span>
          <div className='product-input-container'>
          {<BarcodeReader onScan={handleScan} />}
            <div className='product-input'>
              <label htmlFor='ProductName'>Product Title</label>
              <input value={productTitle} onChange={e => setProductTitle(e.target.value)} placeholder='Product Name' type='text' name='productTitle' />
              <label htmlFor='ProductBrand'>Product Brand</label>
              <input value={productBrand} onChange={e => setProductBrand(e.target.value)} placeholder='Product Brand' type='text' name='productBrand' />
              <label htmlFor='productQuantity'>Quantity</label>
              <input value={productQuantity} onChange={e => setProductQuantity(e.target.value)} placeholder='Quantity' type='number' name='productQuantity' />
              <label htmlFor='productType'>Category</label>
              <input value={productType} onChange={e => setProductType(e.target.value)} placeholder='Category' type='text' name='productType' />
              <label htmlFor='productUnitPrice'>Unit Price (Tk.)</label>
              <input value={productUnitPrice} onChange={e => setProductUnitPrice(e.target.value)} placeholder='Product Unit Price' type='number' name='productUnitPrice' />
              <label htmlFor='productBarcode'>Product Barcode</label>
              <input value={productBarcode} onChange={e => setProductBarcode(e.target.value)} placeholder='Product Barcode' type='text' name='productBarcode' />
            </div>
          </div>
          <button type='submit' className='btn-supplier-submit'>Submit</button>
        </form>
      </div>

    </div>
  )
}

export default AddSupplier