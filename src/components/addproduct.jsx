import '../css/addproduct.css'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setProducts, reset, allProducts } from '../redux/products/productSlice'
import { imageUpload } from '../redux/upload/uploadSlice'
import { toast } from 'react-toastify'
import { Blocks } from 'react-loader-spinner'
import { useNavigate } from 'react-router-dom'
import BarcodeReader from 'react-barcode-reader'


function Addproduct({ closeAddProduct }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { products, isLoading, isError, isSuccess, message } = useSelector((state) => state.products)
  const [productTitle, setProductTitle] = useState('')
  const [productBrand, setProductBrand] = useState('')
  const [productQuantity, setProductQuantity] = useState(0)
  const [productType, setProductType] = useState('')
  const [productUnitPrice, setProductUnitPrice] = useState(0)
  const [productUnitCost, setProductUnitCost] = useState(0)
  const [productBarcode, setProductBarcode] = useState('')
  const [productImage, setProductImage] = useState('')
  const [preview, setPreview] = useState(null)


  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }

    if (isError) {
      toast.error(message)
    }


    return () => {
      dispatch(reset())
      dispatch(allProducts())
    }


  }, [isError, message, dispatch])

  useEffect(() => {
    console.log("Imgae Uploaded ", productImage)
  }, [productImage])


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductImage(file)
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    let productImageUrl = null;
    const payload = {
      type: 'products',
      file: productImage,
      data: {
        previousImageUrl: null
      }
    }

    const response = await dispatch(imageUpload(payload)).unwrap()
    productImageUrl = response.filePath
    if (productTitle === '' || productBrand === '' || productType === '')
      toast.error('Please fill the required fields!')

    const productData = {
      productTitle,
      productBrand,
      productQuantity,
      productType,
      productUnitPrice,
      productUnitCost,
      productBarcode,
      productImageUrl
    }

    try {
      dispatch(setProducts(productData))

    } catch (error) {
      console.log(error)
    }

    if (isSuccess) {
      toast.success('Product created successfully!')
    }

    setProductTitle('')
    setProductBrand('')
    setProductQuantity(0)
    setProductType('')
    setProductUnitPrice(0)
    setProductBarcode('No Code Entered!')
    setProductImage(null)


  }
  const handleScan = (data) => {
    setProductBarcode(data)
  }

  return (
    <div className='addproduct-container' onClick={(e) => { if (e.target.className === 'addproduct-container') closeAddProduct() }}>
      {<BarcodeReader onScan={handleScan} />}
      <div className='addproductform'>
        <span>ADD PRODUCT</span>
        <form onSubmit={handleSubmit}>
          <label htmlFor='productTitle'>Product Name</label>
          <input value={productTitle} onChange={e => setProductTitle(e.target.value)} placeholder='Product Name' type='text' name='productTitle' />
          <label htmlFor='productBrand'>Product Brand</label>
          <input value={productBrand} onChange={e => setProductBrand(e.target.value)} placeholder='Product Brand' type='text' name='productBrand' />
          <label htmlFor='productQuantity'>Quantity</label>
          <input value={productQuantity} onChange={e => setProductQuantity(e.target.value)} placeholder='Quantity' type='number' name='productQuantity' />
          <label htmlFor='productType'>Category</label>
          <input value={productType} onChange={e => setProductType(e.target.value)} placeholder='Category' type='text' name='productType' />
          <label htmlFor='productUnitPrice'>Unit Price (Tk.)</label>
          <input value={productUnitPrice} onChange={e => setProductUnitPrice(e.target.value)} placeholder='Product Unit Price' type='number' name='productUnitPrice' />
          <label htmlFor='productUnitCost'>Unit Cost (Tk.)</label>
          <input value={productUnitCost} onChange={e => setProductUnitCost(e.target.value)} placeholder='Product Unit Cost' type='number' name='productUnitCost' />
          <label htmlFor='productBarcode'>Product Barcode</label>
          <input value={productBarcode} onChange={e => setProductBarcode(e.target.value)} placeholder='Product Barcode' type='text' name='productBarcode' />
          <img src={preview} alt="Description" width="300" height="200" />
          <label htmlFor="productImage">Product Image</label>
          <input
            type="file"
            accept="image/*"
            name="productImage"
            onChange={handleImageChange}
          />
          <button type='submit' className='btn'>Submit</button>
        </form>
      </div>

    </div>
  )
}

export default Addproduct