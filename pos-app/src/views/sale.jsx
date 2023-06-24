import '../css/sale.css'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { allProducts, reset } from '../redux/products/productSlice';
import { insertProduct, resetCart, deleteProduct } from '../redux/sale/cartSlice';
import MoneyIcon from '@mui/icons-material/Money';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CloseIcon from '@mui/icons-material/Close';
function Sale() {
  const navigate = useNavigate()
  const {user} = useSelector((state) => state.auth)
  const {products} = useSelector((state) => state.products)
  const {searchInput} = useSelector( (state) => state.search)
  const {cartProduct} = useSelector((state) => state.cart)
  const dispatch = useDispatch()
  const [paymentMethod, setPaymentMethod] = useState('Cash')
  let productTemp = []




  useEffect(()=>{
    if(!user){

      navigate('/login')
    }

    dispatch(allProducts())
    
   
    return()=>{
      dispatch(reset())
    }
  },[user, navigate,dispatch])

  if(products.products){
    productTemp = products.products
  }
  

  const handleProductClick = (id, e) => {

     e.preventDefault()
     if(cartProduct.some((product)=> product._id === id && cartProduct !== [])){
      console.log("Increment...")
     }else
      dispatch(insertProduct(productTemp.filter((product) =>  product._id === id)))

  }

  return (
    <div className="container">
        <div className='card-container'>
          <div className='table-header'> 
          <table>
              <tr>
                <th>Product Title</th>
                <th>Product Brand</th>
                <th>Product Quantity</th>
                <th>Product Unit Price</th>
              </tr>
          </table>
          </div>
          { searchInput && productTemp.filter((product) => product.productTitle.toLowerCase().includes(searchInput.toLowerCase())).map((product, key) => {
          return (
          <div className='card' key={key}  onClick = { e => handleProductClick(product._id,e)}>
            <ul >
              
                
                <li>
                <span>{product.productTitle}</span>
                <span>{product.productBrand}</span>
                <span>{product.productQuantity}</span>
                <span id='unit-price'>{product.productUnitPrice}</span>
                </li>
                
              
                
            
            </ul>
          </div>
          )
          })}

        </div>
        <div className='cart-container'>
          <span className='cart-header'><h1>Cart</h1></span>

          <hr></hr>
          <div className='payment-selector-btn'>
           <div className='cash-div'>
           <input
            id='cash' 
            type='radio'
            name='payment-method'
            value='Cash'
            onChange = {(e) => setPaymentMethod(e.target.value)}
            ></input>
           <div className='logo-tile'>
            <MoneyIcon className='btn-icon'/>
            <label for='cash'>
              Cash
            </label>
          </div>
           </div> 

        <div className='credit-div'> 
          <input
            id='credit'
            type='radio'
            name='payment-method'
            value='Credit'
            onChange = {(e) => setPaymentMethod(e.target.value)}
            ></input>
          <div className='logo-tile'>
          <CreditCardIcon className='btn-icon'/>
          <label for='credit'>
            Credit
          </label>
          </div>  
            
        </div>    
           
        </div>
        <hr></hr>
        <div className='cart-list-header'>
        <table>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
              </tr>
          </table>
        </div>
       <div className='product-cart-list-container'>
        {console.log()}
        {cartProduct && cartProduct.map((product, key) => {
          
         return( 
           <div key={key} className='product-cart-list'>
             <ul>
               <li >
                 <section>
                   <span>{product.productTitle}</span>
                 </section>
                 <section>
                   <span>{product.productUnitPrice}</span>
                 </section>
                 <section>
                   <span id='unit-multiplier-btn'>-</span>
                   <span id='unit-multiplier'>5</span>
                   <span id='unit-multiplier-btn'>+</span>
                 </section>
                 <section>
                   <span>100</span>
                 </section>
                 <span id='close-btn'><CloseIcon /></span>
               </li>
             </ul>
           </div>
         )
         })}
         </div> 
         <hr></hr>
         <div className='product-total'>
          <section>
            Sub-Total:  <span>100</span>
          </section>
          <section>
            VAT:    <span>15</span>
          </section>
          <section>
            Discount:  <span>0</span>
          </section>
          <section>
            Less Adjustment: <span>0</span>
          </section>
          <hr></hr>
          <section>
            <h4>Net Amount (Tk.):</h4> <span><h4>115</h4></span>
          </section>
         </div>
        </div>
    </div>
  )
}

export default Sale