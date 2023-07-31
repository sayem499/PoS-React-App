import '../css/sale.css'
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { allProducts, reset, updateProducts } from '../redux/products/productSlice';
import { setSearchRef } from '../redux/search/searchSlice';
import {
  resetSale,
  insertProductSale,
  incrementCartItem,
  decrementCartItem,
  deleteCartItem,
  cartProductTotal,
  cartSubTotal,
  cartNetTotal,
  getSaleSettings,
  cartTotalLessAdjustment,
  insertSalePayType,
  insertSalePerson,
  insertTimeDate,
  registerSale,
  cartTotalCost,
} from '../redux/sale/saleSlice';
import { toast } from 'react-toastify'
import Loading from '../components/loading';
import MoneyIcon from '@mui/icons-material/Money';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Salesettings from '../components/salesettings';
import BarcodeReader from 'react-barcode-reader'
import Swal from 'sweetalert2';
import Receipt from '../components/receipt';

function Sale() {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { products } = useSelector((state) => state.products)
  const { searchInput, searchRef } = useSelector((state) => state.search)
  const { cartItems,
    saleSubTotal,
    saleVAT,
    saleDiscount,
    saleTotal,
    saleTotalCost,
    salePayType,
    salePayByCard,
    salePayByCash,
    saleServedBy,
    saleLessAdjustment,
    saleVATAmount,
    saleDiscountAmount,
    isSaleLoading,
    isSaleError,
    isSaleSuccess,
  } = useSelector((state => state.sale))
  const dispatch = useDispatch()
  const [paymentMethod, setPaymentMethod] = useState('Cash')
  const [isSaleSettingsOpen, setIsSaleSettingsOpen] = useState(false)
  const [productBarcode, setProductBarcode] = useState('')
  const [isReceiptOpen, setIsReceiptOpen] = useState(false)
  const [salePayloadState, setSalePayloadState] = useState()
  const elementRef = useRef(null)
  let productTemp = [], fetch = JSON.parse(localStorage.getItem('sale-settings')), salePayload





  useEffect(() => {

    if (!user) {

      navigate('/login')
    }
    if (productTemp.length === 0 || products.length > productTemp || products.length < productTemp)
      dispatch(allProducts())
    dispatch(cartProductTotal())
    dispatch(cartSubTotal())
    if (fetch)
      dispatch(getSaleSettings())
    dispatch(cartNetTotal())
    dispatch(cartTotalCost())
    if (fetch.saleLessAdjustmentToggle)
      dispatch(cartTotalLessAdjustment())
    dispatch(insertSalePayType(paymentMethod))
    dispatch(insertSalePerson(user.userName))
    if (isSaleError) {
      toast.error("Sale Confirmation Error!!")
    }

    if (isSaleSuccess) {
      cartItems?.forEach((cartProduct) => {
        products?.filter((product) => product._id === cartProduct._id).forEach((product) => {
          let productID = product._id,
            productTitle = product.productTitle,
            productBrand = product.productBrand,
            productQuantity = product.productQuantity - cartProduct.productQuantity,
            productType = product.productType,
            productUnitPrice = product.productUnitPrice,
            productUnitCost = product.productUnitCost,
            productBarcode = product.productBarcode

          let updatedProductData = {
            productTitle,
            productBrand,
            productQuantity,
            productType,
            productUnitPrice,
            productUnitCost,
            productBarcode,
          }

          let payload = {
            productID,
            updatedProductData
          }
          dispatch(updateProducts(payload))
        })
      })
      setTimeout(() => {
        toast.success("Sale Confirmed Successfully!!")
        dispatch(resetSale())
      }, 2000)

    }

    
    document.addEventListener('keydown', handleKeyPress)
    
     
    return () =>   {document.removeEventListener('keydown', handleKeyPress)             
      }

  }, [user, navigate, dispatch, searchRef,productBarcode, cartItems, saleTotal, paymentMethod, isSaleLoading])

  if (products && products.length !== productTemp.length) {
    productTemp = products
  }

  const handleDecrement = (id, e) => {
    e.preventDefault()
    dispatch(decrementCartItem(id))
  }


  const handleIncrement = (id, e) => {
    e.preventDefault()
    cartItems?.filter((cart) => cart._id === id).forEach((cart) => {
      products.filter((product) => product._id === id).map((product) => {
        if(product.productQuantity - cart.productQuantity > 0){
          dispatch(incrementCartItem(id))
        }else{
          toast.error("Not enough products in stock!!")
        }
      })
      
    })
  }

  const handleClose = (id, e) => {
    e.preventDefault()
    dispatch(deleteCartItem(id))

  }

  const handleProductClick = (id, e) => {

    e.preventDefault()
    let payload, productTitle, productQuantity, productUnitPrice, productUnitCost, productTotal, _id
    if (cartItems?.some((cart) => cart._id === id && cartItems !== [])) {
      cartItems?.filter((cart) => cart._id === id).forEach((cart) => {
        products.filter((product) => product._id === id).map((product) => {
          if(product.productQuantity - cart.productQuantity >= 0){
            dispatch(incrementCartItem(id))
          }else{
            toast.error("Not enough products in stock!!")
          }
        })
        
      })
    } else {
        products.filter((product) => product._id === id).map((product) => {
          if(product.productQuantity > 0){
            productTemp.filter((product) => product._id === id).forEach((product) => {
              _id = product._id
              productTitle = product.productTitle
              productQuantity = 1
              productUnitPrice = product.productUnitPrice
              productUnitCost = product.productUnitCost
              productTotal = productQuantity * productUnitPrice
            })
            payload = {
              _id,
              productTitle,
              productQuantity,
              productUnitPrice,
              productUnitCost,
              productTotal,
            }
      
            dispatch(insertProductSale(payload))
          }else{
            toast.error("Not enough products in stock!!")
          }
        })
        
      
    }

  }

  const handleSaleSettings = () => {
    setIsSaleSettingsOpen(true)
  }

  const handleClearCart = () => {
    dispatch(resetSale())
  }

  const handleConfirm = () => {
    
    let saleTime, saleDate, payload, products
        saleTime = new Date().toLocaleTimeString()
        saleDate = new Date().toLocaleDateString()

        payload = {
          saleTime,
          saleDate
        }

        dispatch(insertTimeDate(payload))

        products = [...cartItems]
        salePayload = {
          products,
          saleSubTotal,
          saleVAT,
          saleDiscount,
          saleTotal,
          saleTotalCost,
          salePayType,
          salePayByCard,
          salePayByCash,
          saleTime,
          saleDate,
          saleServedBy,
          saleLessAdjustment,
          saleVATAmount,
          saleDiscountAmount,
        }
    
    Swal.fire({
      title: 'Confirm Sale?',
      showDenyButton: true,
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Confirm',
      denyButtonText: `Don't Confirm`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        dispatch(registerSale(salePayload))
        Swal.fire('Confirmed!', '', 'success')

      } else if (result.isDenied) {
        Swal.fire('Not Confirmed', '', 'info')
      } 
    })



  }


  const handleSaleLoad = () => {
    let saleTime, saleDate, payload, products
        saleTime = new Date().toLocaleTimeString()
        saleDate = new Date().toLocaleDateString()

        payload = {
          saleTime,
          saleDate
        }

        dispatch(insertTimeDate(payload))

        products = [...cartItems]
        salePayload = {
          products,
          saleSubTotal,
          saleVAT,
          saleDiscount,
          saleTotal,
          saleTotalCost,
          salePayType,
          salePayByCard,
          salePayByCash,
          saleTime,
          saleDate,
          saleServedBy,
          saleLessAdjustment,
          saleVATAmount,
          saleDiscountAmount,
        }

        setSalePayloadState(salePayload)
  }

  



  const handleScan = (data) => {
    setProductBarcode(data)
  }

  const filteredProducts = productTemp.filter(product => {
    return product.productTitle.toLowerCase().includes(searchInput.toLowerCase())

  })

  const handleReceipt = () => {
        handleSaleLoad()
        setIsReceiptOpen(true)
  }

  const handleKeyPress = (e) => {
    if (searchRef === 'container-column'&& e.key === 'Enter' && e.key !== ' '  ){
      e.preventDefault()
       handleConfirm();
    }
  }

  const handleDispatch =()=>{
    dispatch(setSearchRef(elementRef.current.className))
  }

  return (
    
    <div className='container-column' ref={elementRef} onClick={handleDispatch}>

     {
     isReceiptOpen && <Receipt payload={salePayloadState} closeReceipt={() => {setIsReceiptOpen(false)}}/>}
      {
        productBarcode && productTemp.filter((product) => product.productBarcode === productBarcode).forEach((product) => {
          if (cartItems?.some((cart) => cart._id === product._id && cartItems !== [])) {
            cartItems?.filter((cart) => cart._id === product._id).forEach((cart) => {
              dispatch(incrementCartItem(product._id))
              setProductBarcode('')
            })

          } else {
            let payload, productTitle, productQuantity, productUnitPrice, productUnitCost, productTotal, _id
            _id = product._id
            productTitle = product.productTitle
            productQuantity = 1
            productUnitPrice = product.productUnitPrice
            productUnitCost = product.productUnitCost
            productTotal = productQuantity * productUnitPrice

            payload = {
              _id,
              productTitle,
              productQuantity,
              productUnitPrice,
              productUnitCost,
              productTotal,
            }

            dispatch(insertProductSale(payload))
            setProductBarcode('')

          }
        })
      }
      <div className="container-row">
        <div className='card-container'>
          <div className='table-header'>
            <BarcodeReader onScan={handleScan} />
            <table className='table-header-table'>
              <tr>
                <th>Product Title</th>
                <th>Product Brand</th>
                <th>Product Quantity</th>
                <th>Product Unit Price</th>
              </tr>
            </table>

          </div>
          {filteredProducts.map((product, key) => {
            return (
              <div className='card' key={key} onClick={e => handleProductClick(product._id, e, product.productUnitPrice)}>
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
                defaultChecked={paymentMethod}
                onClick={(e) => setPaymentMethod(e.target.value)}
              ></input>
              <div className='logo-tile'>
                <MoneyIcon className='btn-icon' />
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
                onClick={(e) => setPaymentMethod(e.target.value)}
              ></input>
              <div className='logo-tile'>
                <CreditCardIcon className='btn-icon' />
                <label for='credit'>
                  Credit
                </label>
              </div>

            </div>

          </div>
          <hr></hr>
          <div className='cart-list-header'>
            <table className='cart-list-header-table-header'>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
              </tr>
            </table>
          </div>
          <div className='product-cart-list-container'>
            {cartItems && cartItems.map((product, key) => {

              return (
                <div key={key} className='product-cart-list'>
                  {
                    isSaleLoading && <Loading />
                  }
                  <ul>
                    <li >
                      <section>
                        <span>{product.productTitle}</span>
                      </section>
                      <section>
                        <span>{product.productUnitPrice}</span>
                      </section>
                      <section>
                        <span id='unit-multiplier-btn'><RemoveIcon onClick={e => handleDecrement(product._id, e)} /></span>
                        {

                          cartItems.filter((count) => count._id === product._id).map((tempCount, key) => {
                            return <span key={key} id='unit-multiplier'>{tempCount.productQuantity}</span>
                          })
                        }


                        <span id='unit-multiplier-btn'><AddIcon onClick={e => handleIncrement(product._id, e)} /></span>
                      </section>
                      <section>

                        {cartItems?.filter((total) => total._id === product._id).map((total, key) => {
                          return <span key={key}>{total.productTotal}</span>
                        })

                        }
                      </section>
                      <span id='close-btn'><CloseIcon onClick={(e) => handleClose(product._id, e)} /></span>
                    </li>
                  </ul>
                </div>
              )
            })}
          </div>
          <hr></hr>
          <div className='product-total'>
            <section>
              <h4>Sub-Total:</h4>  <span><h4>৳&nbsp;{saleSubTotal.toFixed(2)}</h4></span>
            </section>
            <section>
              VAT({saleVAT}%):    <span>৳&nbsp;{saleVATAmount.toFixed(2)}</span>
            </section>
            <section>
              Discount({saleDiscount}%):  <span>৳&nbsp;-{saleDiscountAmount.toFixed(2)}</span>
            </section>
            <section>
              Less Adjustment: <span>৳&nbsp;-{saleLessAdjustment.toFixed(2)}</span>
            </section>
            <hr></hr>
            <section>
              <h4>Net Amount (Tk.):</h4> <span><h4>৳&nbsp;{saleTotal.toFixed(2)}</h4></span>
            </section>
          </div>
        </div>

      </div>
      <div className='button-container'>
        <div className='button-wrapper'>
          {
            user.userType === 'admin' ? <button className='sale-options-btn' onClick={handleSaleSettings}>Settings</button> : ''
          }

          {
            isSaleSettingsOpen && <Salesettings closeSaleSettings={() => { setIsSaleSettingsOpen(false) }} />
          }

          <button className='sale-options-btn-clear' onClick={handleClearCart}> Clear </button>
          <button className='sale-options-btn-confirm' onClick={(e) => { handleConfirm(e) }}>Confirm</button>
          <button className='sale-options-btn-receipt-preview' onClick={e => handleReceipt(e)  }>Reciept Preview</button>
         
        </div>
      </div>
    </div>
  )
}

export default Sale