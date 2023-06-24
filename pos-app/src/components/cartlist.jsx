import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';

function Cartlist({cartProduct}) {
    useEffect(()=>{

    },[cartProduct])
  return ( 
  <>

    { cartProduct !== [] && cartProduct.map((product, key)=>{
        console.log(cartProduct)
        return( 
          <div key={key} className='product-cart-list'>
            <ul>
              <li >
                <section>
                  <span>{product.title}</span>
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
   </>
  )
}

export default Cartlist