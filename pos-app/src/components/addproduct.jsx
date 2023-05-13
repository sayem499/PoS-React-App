import '../css/addproduct.css'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { Blocks } from 'react-loader-spinner'


function Addproduct({closeAddProduct}) {
    const [productName, setProductName] = useState('')
    const [productBrand, setProductBrand] = useState('')
    const [productQuantity, setProductQuantity] = useState(0)
    const [productCategory, setProductCategory] = useState('')
    const [productPrice, setProductPrice] = useState(0)


    const handleSubmit = (e) => {
      e.preventDefault()




    }


  return (
    <div className='addproduct-container' onClick={(e) => { if(e.target.className === 'addproduct-container')  closeAddProduct()}}>
      <div className='addproductform'>
        <span>ADD PRODUCT</span>
        <form onSubmit={handleSubmit}>
          <label htmlform='Product Name'>Product Name</label>
          <input value={productName} onChange={(e) => setProductName(e.target.value)} placeholder='Product Name' type='text'></input>
          <label htmlform='Product Brand'>Product Brand</label>
          <input value={productBrand} onChange={(e) => setProductBrand(e.target.value)} placeholder='Product Brand' type='text'></input>
          <label htmlform='Quantity'>Quantity</label>
          <input value={productQuantity} onChange={(e) => setProductQuantity(e.target.value)} placeholder='Quantity' type='number'></input>
          <label htmlform='Category'>Category</label>
          <input value={productCategory} onChange={(e) => setProductCategory(e.target.value)} placeholder='Category' type='text'></input>
          <label htmlform='Unit Price'>Unit Price (Tk.)</label>
          <input value={productPrice} onChange={(e) => setProductPrice(e.target.value)} placeholder='Product Unit Price' type='number'></input>
        </form>
        <button type='submit' className='btn'>Submit</button>
      </div>

    </div>
  )
}

export default Addproduct