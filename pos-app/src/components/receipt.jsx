import '../css/receipt.css'
import { forwardRef } from 'react'

export const Receipt = forwardRef(({ payload, closeReceipt}, ref) => {
  


  return (
    <div className='receipt-container' onClick={(e) => { if (e.target.className === 'receipt-container') closeReceipt() }}>
      <div className='receipt-wrapper'>
        <div className='receipt' ref={ref}>

          <div className='receipt-header'>
            <h3>Sale Receipt</h3>
          </div>
          <div className='receipt-date-time'>
            <span className='receipt-date'>Date:{payload.saleDate}</span>
            <span className='receipt-time'>Time:{payload.saleTime}</span>
          </div>
          <hr></hr>
          <div className='receipt-list-items'>
          <table cellSpacing="5">
            <thead align='left' border='1'>
              <tr>
                <th>SL no.</th>
                <th>Item Title</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            {
              payload.products.map((items, key) => {
                return (
                  <tbody key={key} align='left'>
                    <tr>
                      <td>{key}</td>
                      <td>{items.productTitle}</td>
                      <td>{items.productQuantity}</td>
                      <td>{items.productUnitPrice}</td>
                      <td>{items.productTotal}</td>
                    </tr>
                  </tbody>
                )
              })
            }
          </table>
          </div>
          <hr></hr>
          <div className='receipt-sale-info'>
            <span>Total:</span>
            <span>{payload.saleSubTotal}</span>
          </div>
          <div className='receipt-sale-info'>
            <span>VAT({payload.saleVAT}%):</span>
            <span>{payload.saleVATAmount}</span>
          </div>
          <div className='receipt-sale-info'>
            <span>Discount({payload.saleDiscount}%):</span>
            <span>-{payload.saleDiscountAmount.toFixed(2)}</span>
          </div>
          <div className='receipt-sale-info'>
            <span>Less Adjustment:</span>
            <span>-{payload.saleLessAdjustment.toFixed(2)}</span>
          </div>
          <div className='receipt-sale-info'>
            <span className='receipt-net-total'>Net Total:</span>
            <span className='receipt-net-total'>{payload.saleTotal}</span>
          </div>
          <div className='receipt-sale-info'>
            <span>PayType:</span>
            <span>{payload.salePayType}</span>
          </div>
          <div className='receipt-sale-info'>
            <span>Pay By Card:</span>
            <span>{payload.salePayByCard}</span>
          </div>
          <div className='receipt-sale-info'>
            <span>Pay By Cash:</span>
            <span>{payload.salePayByCash}</span>
          </div>
          <hr></hr>
          <div className='receipt-footer'>
            <span>Software Made by SaMBoY</span>
          </div>
        </div>

      </div>
    </div>
  )
})

export default Receipt