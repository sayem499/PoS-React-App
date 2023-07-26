import '../css/receipt.css'

const Receipt = (payload) => {
  return (
    <div className='receipt-container'>
        <div className='receipt-wrapper'>
          <div className='receipt'>

            <div className='receipt-header'>
              <h3>Sale Receipt</h3>
            </div>
            <div className='receipt-date-time'>
              <span className='receipt-date'>Date:</span>
              <span className='receipt-time'>Time:</span>
            </div>

            <div className='receipt-list-header'>
              <span>SL no.</span>
              <span>Item Title</span>
              <span>Qty</span>
              <span>Price</span>
              <span>Total</span>
            </div>
            <hr></hr>

            <div className='receipt-list-items'>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>

            <hr></hr>
            <div className='receipt-sale-info'>
              <span>Total:</span>
              <span>1489.00</span>
            </div>
            <div className='receipt-sale-info'>
              <span>VAT:</span>
              <span>0.00</span>
            </div>
            <div className='receipt-sale-info'>
              <span>Discount:</span>
              <span>-58.83</span>
            </div>
            <div className='receipt-sale-info'>
              <span>Less Adjustment:</span>
              <span>0.00</span>
            </div>
            <div className='receipt-sale-info'>
              <span className='receipt-net-total'>Net Total:</span>
              <span className='receipt-net-total'>1390.00</span>
            </div>
            <div className='receipt-sale-info'>
              <span>PayType:</span>
              <span>Cash</span>
            </div>
            <div className='receipt-sale-info'>
              <span>Pay By Card:</span>
              <span>0.00</span>
            </div>
            <div className='receipt-sale-info'>
              <span>Pay By Cash:</span>
              <span>1390.00</span>
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