import '../css/purchase.css'
import React from 'react'
import InfiniteProductList from '../components/infiniteproductlist'

const Purchase = () => {
  return (
    <div className='purchase-container'>
      <div className='purchase-product-list'>
        <InfiniteProductList />
      </div>
      <div className='purchase-billing'></div>
      
    </div>
  )
}

export default Purchase