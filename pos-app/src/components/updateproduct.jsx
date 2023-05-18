import { useEffect, useState } from "react"
import '../css/updateproduct.css'


function Updateproduct({ row, closeUpdateProduct}) {

    const [productTitle, setProductTitle] = useState(row.productTitle)
    const [productBrand, setProductBrand] = useState(row.productBrand)
    const [productQuantity, setProductQuantity] = useState(row.productQuantity)
    const [productType, setProductType] = useState(row.productType)
    const [productUnitPrice, setProductUnitPrice] = useState(row.productUnitPrice) 

  const handleSubmit = (e) =>{
    e.preventDefault()
  }


  return (
    <div className='updateproduct-container' onClick={(e) => { if(e.target.className === 'updateproduct-container')  closeUpdateProduct()}}>
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
          <button type='submit' className='btn'>Submit</button>
        </form>
      </div>

    </div>
  )
}

export default Updateproduct