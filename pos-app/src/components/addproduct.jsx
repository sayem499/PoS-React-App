import '../css/addproduct.css'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setProducts, reset , allProducts} from '../redux/products/productSlice'
import { toast } from 'react-toastify'
import { Blocks } from 'react-loader-spinner'
import { useNavigate } from 'react-router-dom'
import BarcodeReader from 'react-barcode-reader'


function Addproduct({closeAddProduct}) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
    const { products, isLoading, isError, isSuccess, message } = useSelector( (state) => state.products)
    const [productTitle, setProductTitle] = useState('')
    const [productBrand, setProductBrand] = useState('')
    const [productQuantity, setProductQuantity] = useState(0)
    const [productType, setProductType] = useState('')
    const [productUnitPrice, setProductUnitPrice] = useState(0)
    const [productBarcode, setProductBarcode ] = useState('')

   
    const  { user } = useSelector( (state) => state.auth)

    useEffect( () => {
      if(!user){
        navigate('/login')
      }
      
      if(isError){
        toast.error(message)
      }
      

      return() =>{ 
        dispatch(reset()) 
        dispatch(allProducts())
      }
      

    },[ isError, message, dispatch ])

  

    const handleSubmit = (e) => {
      e.preventDefault()
    
      if( productTitle === '' || productBrand === '' || productType === '')
        toast.error('Please fill the required fields!')

        const productData = {
          productTitle,
          productBrand,
          productQuantity,
          productType,
          productUnitPrice,
          productBarcode
        }

        try{
          dispatch(setProducts(productData))

        }catch (error){
          console.log(error)
        }
        
        if(isSuccess){
          toast.success('Product created successfully!')
        }

        setProductTitle('')
        setProductBrand('')
        setProductQuantity(0)
        setProductType('')
        setProductUnitPrice(0)
        setProductBarcode('No Code Entered!')


    }
    const handleScan = (data) => {
      setProductBarcode(data)
    }

  return (
    <div className='addproduct-container' onClick={(e) => { if(e.target.className === 'addproduct-container')  closeAddProduct()}}>
      {<BarcodeReader onScan = {handleScan}/>}
      <div className='addproductform'>
        <span>ADD PRODUCT</span>
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

export default Addproduct