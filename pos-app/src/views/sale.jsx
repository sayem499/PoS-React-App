import '../css/sale.css'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { allProducts, reset } from '../redux/products/productSlice';
import MoneyIcon from '@mui/icons-material/Money';
import CreditCardIcon from '@mui/icons-material/CreditCard';

function Sale() {
  const navigate = useNavigate()
  const {user} = useSelector((state) => state.auth)
  const {products} = useSelector((state) => state.products)
  const {searchInput} = useSelector( (state) => state.search)
  const dispatch = useDispatch()
  const [paymentMethod, setPaymentMethod] = useState('Cash')
  let productTemp = []

  useEffect(()=>{
    if(!user){

      navigate('/login')
    }

    dispatch(allProducts())
   

  },[user, navigate,dispatch])

  if(products.products){
    productTemp = products.products
    console.log(productTemp)
  }

  const handleProductClick = () =>{

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
          <div className='card' onClick={handleProductClick}>
            <ul>
              
                
                <li key={key}>
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
         <div className='product-cart-list'>
         <ul>
              
                
              <li>
              <span>Vasline</span>
              <span> 30</span>
              <span>120</span>
              <span>+</span>
              <span></span>
              <span>-</span>
              <span></span>
              </li>
              
            
              
          
          </ul>
         </div>

        </div>
    </div>
  )
}

export default Sale