import { useEffect, useState } from "react"
import '../css/updateproduct.css'
import { updateProducts, reset, allProducts } from '../redux/products/productSlice'
import { useDispatch, useSelector } from "react-redux"
import { toast } from 'react-toastify'
import { useNavigate } from "react-router-dom"
import BarcodeReader from 'react-barcode-reader'



function Updateproduct({ row, closeUpdateProduct}) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {products, isSuccess, isError, isLoaing, message} = useSelector((state) => state.products)
    const {user} = useSelector((state) => state.auth)
    const [productTitle, setProductTitle] = useState(row.productTitle)
    const [productBrand, setProductBrand] = useState(row.productBrand)
    const [productQuantity, setProductQuantity] = useState(row.productQuantity)
    const [productType, setProductType] = useState(row.productType)
    const [productUnitPrice, setProductUnitPrice] = useState(row.productUnitPrice) 
    const [productBarcode, setProductBarcode ] = useState('')

    useEffect(() => {
        
        if(!user){
            navigate('/login')
        }
        if(isError){
            toast.error(message)
          } 
        return() => {
          dispatch(reset())
          dispatch(allProducts())
        }  
       
    },[user, isError, message, navigate, dispatch])


  const handleSubmit = (e) =>{
    e.preventDefault()

    if (productTitle === '' || productBrand === '' || productType === '')
      toast.error('Please fill the required fields!')
    else {
      const updatedProductData = {
        productTitle,
        productBrand,
        productQuantity,
        productType,
        productUnitPrice,
        productBarcode
      }
      let productID = row._id
      const payload = {
        productID,
        updatedProductData,
      }

      dispatch(updateProducts(payload))
    }


    if (isSuccess) {
      toast.success('Product updated successfully!')
    }
  }

  const handleScan = (data) => {
    setProductBarcode(data)
  }

  return (
    <div className='updateproduct-container' onClick={(e) => { if(e.target.className === 'updateproduct-container')  closeUpdateProduct()}}>
      <BarcodeReader onScan = {handleScan}/>
      <div className='updateproductform'>
        <span>UPDATE PRODUCT</span>
        <form onSubmit={handleSubmit}>
          <label htmlFor='Product Name'>Product Name</label>
          <input value={productTitle} onChange={e => setProductTitle(e.target.value)} placeholder='Product Name' type='text' name='productTitle'/>
          <label htmlFor='Product Brand'>Product Brand</label>
          <input value={productBrand} onChange={e => setProductBrand(e.target.value)} placeholder='Product Brand' type='text' name='productBrand'/>
          <label htmlFor='Quantity'>Quantity</label>
          <input value={productQuantity} onChange={ e => setProductQuantity(e.target.value)} placeholder='Quantity' type='number' name='productQuantity'/>
          <label htmlFor='Category'>Category</label>
          <input value={productType} onChange={ e => setProductType(e.target.value)} placeholder='Category' type='text' name='productType'/>
          <label htmlFor='Unit Price'>Unit Price (Tk.)</label>
          <input value={productUnitPrice} onChange={ e => setProductUnitPrice(e.target.value)} placeholder='Product Unit Price' type='number' name='productUnitPrice'/>
          <label htmlFor='productBarcode'>Product Barcode</label>
          <input value={productBarcode} onChange={e => setProductBarcode(e.target.value)} placeholder='Product Barcode' type='text' name='productBarcode'/>
          <button type='submit' className='btn'>Submit</button>
        </form>
      </div>

    </div>
  )
}

export default Updateproduct