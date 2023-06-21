import '../css/sale.css'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { allProducts, reset } from '../redux/products/productSlice';

function Sale() {
  const navigate = useNavigate()
  const {user} = useSelector((state) => state.auth)
  const {products} = useSelector((state) => state.products)
  const {searchInput} = useSelector( (state) => state.search)
  const dispatch = useDispatch()
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
          <div className='card'>
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
          
        </div>
    </div>
  )
}

export default Sale