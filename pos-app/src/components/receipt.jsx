import '../css/receipt.css'

const Receipt = ({payload,closeReceipt}) => {
  return (
    <div className='receipt-container' onClick={ (e) => { if(e.target.className === 'receipt-container') closeReceipt() }}>
        <div className='receipt-wrapper'>
          <div className='receipt'>

            <div className='receipt-header'>
              <h3>Sale Receipt</h3>
            </div>
            <div className='receipt-date-time'>
              <span className='receipt-date'>Date:{payload.saleDate}</span>
              <span className='receipt-time'>Time:{payload.saleTime}</span>
            </div>

            <div className='receipt-list-header'>
              <span>SL no.</span>
              <span>Item Title</span>
              <span>Qty</span>
              <span>Price</span>
              <span>Total</span>
            </div>
            <hr></hr>
          {
          payload.products.map((items,key) => {
           return <div key={key} className='receipt-list-items'>
              <span>{key}</span>
              <span>{items.productTitle}</span>
              <span>{items.productQuantity}</span>
              <span>{items.productUnitPrice}</span>
              <span>{items.productTotal}</span>
            </div>
          })
            
          }
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
              <span>{payload.saleLessAdjustment.toFixed(2)}</span>
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
}

export default Receipt