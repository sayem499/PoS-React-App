import '../css/sale.css'
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { allProducts, reset, updateProducts } from '../redux/products/productSlice';
import { setSearchRef } from '../redux/search/searchSlice';
import { useReactToPrint } from 'react-to-print';
import { getCustomers, setCustomers, updateCustomer } from '../redux/customer/customerSlice';
import {

  resetSale,
  insertProductSale,
  incrementCartItem,
  decrementCartItem,
  deleteCartItem,
  cartProductTotal,
  cartSubTotal,
  cartNetTotal,
  setSaleSettings,
  getSaleSettings,
  cartTotalLessAdjustment,
  insertSalePayType,
  insertSalePerson,
  insertTimeDate,
  registerSale,
  cartTotalCost,
  insertCustomerInfo,
  insertCashPaid,
  calculateChange,

} from '../redux/sale/saleSlice';
import { getPurchaseById, allPurchases, updatePurchases } from '../redux/purchase/purchaseSlice';
import { allPaymentTypes } from '../redux/payment/paymentSlice';
import { toast } from 'react-toastify'
import { useLocation } from "react-router-dom";
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
import ProductCartListItem from '../components/productcartlistitem';
import InfiniteProductList from '../components/infiniteproductlist';

function Sale() {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { products, isLoading, hasMore } = useSelector((state) => state.products)
  const { purchase } = useSelector((state) => state.purchase)
  const { searchInput, searchRef } = useSelector((state) => state.search)
  const { customers } = useSelector((state) => state.customerState)
  const { paymentTypes } = useSelector((state) => state.paymentTypeState)
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
    saleLessAdjustmentToggle,
    saleCashPaid,
    saleChange,
    isSaleLoading,
    isSaleError,
    isSaleSuccess,
  } = useSelector((state => state.sale))
  const dispatch = useDispatch()
  const location = useLocation()
  const [paymentMethod, setPaymentMethod] = useState('Cash')
  const [isSaleSettingsOpen, setIsSaleSettingsOpen] = useState(false)
  const [productBarcode, setProductBarcode] = useState('')
  const [isReceiptOpen, setIsReceiptOpen] = useState(false)
  const [salePayloadState, setSalePayloadState] = useState()
  const [customerName, setCustomerName] = useState('')
  const [customerPhoneNumber, setCustomerPhoneNumber] = useState('')
  const [customerCashPaid, setCustomerCashPaid] = useState(0)
  const elementRef = useRef(null)
  const printRef = useRef()
  let productTemp = [], fetch = JSON.parse(localStorage.getItem('sale-settings')), salePayload
  const type = 'sale';
  const [showPaymentAccounts, setShowPaymentAccounts] = useState(false)
  const [clickedPayment, setClickedPayment] = useState(null);

  const handlePaymentClick = (payment) => {
    setClickedPayment(payment);
    setShowPaymentAccounts(!showPaymentAccounts);
  };



  useEffect(() => {

    if (!user) {

      navigate('/login')
    }
    dispatch(getCustomers())

    if (productTemp.length === 0 || products.length > productTemp || products.length < productTemp) {
      dispatch(allProducts())
    }

    if (location.pathname === "/sale") {
      dispatch(allProducts())
    }

    if (paymentTypes.length === 0) {
      dispatch(allPaymentTypes())
    }

    dispatch(cartProductTotal())
    dispatch(cartSubTotal())
    if (fetch !== null)
      dispatch(getSaleSettings())
    else {

      let payload = {
        saleVAT,
        saleDiscount,
        saleLessAdjustmentToggle,
      }

      dispatch(setSaleSettings(payload))
    }

    dispatch(cartNetTotal())
    dispatch(cartTotalCost())
    if (fetch?.saleLessAdjustmentToggle)
      dispatch(cartTotalLessAdjustment())
    else {
      let payload = {
        saleVAT,
        saleDiscount,
        saleLessAdjustmentToggle,
      }
      dispatch(setSaleSettings(payload))
    }
    dispatch(insertSalePayType(paymentMethod))
    dispatch(insertSalePerson(user.userName))
    if (isSaleError) {
      toast.error("Sale Confirmation Error!!")
    }
    dispatch(insertCashPaid(customerCashPaid))
    dispatch(calculateChange())

    if (isSaleSuccess) {
      handlePrint()
      handleQuantityUpdate();
      setIsReceiptOpen(false);
      setTimeout(() => {
        toast.success("Sale Confirmed Successfully!!")
        dispatch(resetSale())
      }, 2000)

    }

    document.addEventListener('keydown', handleKeyPress)

    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }

  }, [user, navigate, dispatch, location.pathname, searchRef, productBarcode, cartItems, saleTotal, paymentMethod, isSaleLoading, customerCashPaid])

  if (products && products.length !== productTemp.length) {
    productTemp = products
  }

  const handleQuantityUpdate = async () => {
    const updatedProducts = await Promise.all(
      cartItems.map(async (cartProduct) => {
        let productCurrentPurchaseId = null;
        const product = products.find((p) => p._id === cartProduct._id);
        if (!product) return null;

        try {
          if (product.productCurrentPurchaseId) {
            let purchase = await dispatch(getPurchaseById(product.productCurrentPurchaseId)).unwrap();

            // Update productQuantitySold for the matching purchase product
            let updatedPurchase = {
              ...purchase,
              purchaseProducts: purchase.purchaseProducts.map((purchaseProduct) => {
                if (purchaseProduct._id === product._id) {
                  return {
                    ...purchaseProduct,
                    productQuantitySold: purchaseProduct.productQuantitySold + cartProduct.productQuantity,
                  };
                }
                return purchaseProduct;
              }),
            };

            // Update the purchase record in the database
            await dispatch(updatePurchases({ purchaseID: purchase._id, updatedPurchaseData: updatedPurchase })).unwrap();

            // Get updated product stock data
            const currentProductData = updatedPurchase.purchaseProducts.find((p) => p._id === product._id);
            let productCurrentPurchaseId = product.productCurrentPurchaseId;

            // If the current purchase is fully sold, find a new one
            if (currentProductData.productQuantitySold === currentProductData.productQuantity) {
              let allPurchases = await dispatch(allPurchases()).unwrap(); // Fetch all purchases

              let newPurchase = allPurchases.find((p) =>
                p.purchaseProducts.some(
                  (prod) => prod._id === product._id && prod.productQuantitySold < prod.productQuantity
                )
              );

              if (newPurchase) {
                productCurrentPurchaseId = newPurchase._id;
              }
            }
          }

          return {
            productID: product._id,
            productTitle: product.productTitle,
            productBrand: product.productBrand,
            productQuantity: product.productQuantity - cartProduct.productQuantity,
            productType: product.productType,
            productUnitPrice: product.productUnitPrice,
            productUnitCost: product.productUnitCost,
            productBarcode: product.productBarcode,
            productCurrentPurchaseId,
          }


        } catch (error) {
          console.error("Error updating purchase:", error);
          return null;
        }
      })
    );

    // Filter out null values before dispatching
    const validUpdatedProducts = updatedProducts.filter((p) => p !== null);

    // Create the payload for each product
    const payload = validUpdatedProducts.map((product) => {
      return {
        productID: product.productID,  // unique ID
        updatedProductData: product,   // updated data for the product
      };
    });

    // Dispatch each product individually
    payload.forEach((productPayload) => {
      dispatch(updateProducts(productPayload));
    });
  };

  const handleDecrement = (id, e) => {
    e.preventDefault()
    dispatch(decrementCartItem(id))
  }


  const handleIncrement = (id, e) => {
    e.preventDefault()
    const cartItem = cartItems.find((cart) => cart._id === id);
    const product = products.find((product) => product._id === id);

    if (cartItem && product) {
      if (product.productQuantity - cartItem.productQuantity > 0) {
        dispatch(incrementCartItem(id));
      } else {
        toast.error("Not enough products in stock!!");
      }
    }
  }

  const handleClose = (id, e) => {
    e.preventDefault()
    dispatch(deleteCartItem(id))

  }

  const handleProductClick = (id, e) => {

    e.preventDefault()
    const cartItem = cartItems.find((cart) => cart._id === id);
    const product = products.find((product) => product._id === id);

    if (cartItem && product) {
      if (product.productQuantity - cartItem.productQuantity >= 0) {
        dispatch(incrementCartItem(id));
      } else {
        toast.error("Not enough products in stock!!");
      }
    } else {
      if (product && product.productQuantity > 0) {
        const productTempItem = productTemp.find((item) => item._id === id);

        if (productTempItem) {
          const payload = {
            _id: productTempItem._id,
            productTitle: productTempItem.productTitle,
            productQuantity: 1,
            productUnitPrice: productTempItem.productUnitPrice,
            productUnitCost: productTempItem.productUnitCost,
            productTotal: productTempItem.productUnitPrice,
            productImageUrl: productTempItem.productImageUrl,
            productCurrentPurchaseId: productTempItem.productCurrentPurchaseId || null,
          };

          dispatch(insertProductSale(payload));
        }
      } else {
        toast.error("Not enough products in stock!!");
      }
    }

  }

  const handleSaleSettings = () => {
    setIsSaleSettingsOpen(true)
  }

  const handleClearCart = () => {
    setCustomerName('')
    setCustomerPhoneNumber('')
    setCustomerCashPaid(0)
    dispatch(resetSale())
  }


  /* Function to handle confirm button click */
  const handleConfirm = (e) => {
    e.preventDefault()
    let saleTime, saleDate, payload, products, customerPayload, saleCustomerName, saleCustomerPhoneNumber, flag = false, updateCustomerPayload, newCustomerPayload
    customerPayload = {
      customerName,
      customerPhoneNumber,
    }

    saleCustomerName = customerName
    saleCustomerPhoneNumber = customerPhoneNumber
    dispatch(insertCustomerInfo(customerPayload))

    saleTime = new Date().toLocaleTimeString()
    saleDate = new Date().toLocaleDateString()

    payload = {
      saleTime,
      saleDate
    }

    dispatch(insertTimeDate(payload))

    if (customers.filter((customer) => customer.customePhoneNumbr === customerPhoneNumber)) {

      customers.filter((customer) => customer.customerPhoneNumber === customerPhoneNumber).map((customer) => {

        let customerID, customerName, customerPhoneNumber, customerTotalExpenditure = 0, customerTotalTrades = 0
        customerID = customer._id
        customerName = customer.customerName
        customerPhoneNumber = customer.customerPhoneNumber
        customerTotalExpenditure = customer.customerTotalExpenditure + saleTotal
        customerTotalTrades = customer.customerTotalTrades + 1

        const updatedCustomerData = {
          customerName,
          customerPhoneNumber,
          customerTotalExpenditure,
          customerTotalTrades
        }

        updateCustomerPayload = {
          customerID,
          updatedCustomerData,
        }
        flag = true

      })
    } else {

      if (customerPhoneNumber !== '') {
        let customerTotalExpenditure = 0, customerTotalTrades = 0

        customerTotalExpenditure = customerTotalExpenditure + saleTotal
        customerTotalTrades = customerTotalTrades + 1

        newCustomerPayload = {
          customerName,
          customerPhoneNumber,
          customerTotalExpenditure,
          customerTotalTrades
        }
        flag = false
      }
    }




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
      saleCustomerName,
      saleCustomerPhoneNumber,
      saleCashPaid,
      saleChange,
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
        handleSaleLoad()
        setIsReceiptOpen(true)
        if (flag) {
          dispatch(updateCustomer(updateCustomerPayload))
        } else {
          dispatch(setCustomers(newCustomerPayload))
        }


        dispatch(registerSale(salePayload))
        // dispatch(allProducts({page: 1}))
        Swal.fire('Confirmed!', '', 'success')

      } else if (result.isDenied) {
        Swal.fire('Not Confirmed', '', 'info')
      }
    })



  }


  /* Function to load all the sale data. */
  const handleSaleLoad = () => {
    console.log(printRef.current)
    let saleTime, saleDate, payload, products, customerPayload, saleCustomerName, saleCustomerPhoneNumber

    saleTime = new Date().toLocaleTimeString()
    saleDate = new Date().toLocaleDateString()

    payload = {
      saleTime,
      saleDate
    }

    dispatch(insertTimeDate(payload))

    customerPayload = {
      customerName,
      customerPhoneNumber,
    }

    dispatch(insertCustomerInfo(customerPayload))

    saleCustomerName = customerName
    saleCustomerPhoneNumber = customerPhoneNumber

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
      saleCustomerName,
      saleCustomerPhoneNumber,
      saleCashPaid,
      saleChange,
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
    if (searchRef === 'container-column' && e.key === 'Enter' && e.key !== ' ') {
      e.preventDefault()
      handleConfirm();
    } else if (searchRef === 'container-column' && e.key === 'Escape' && e.key !== ' ') {
      e.preventDefault()
      handleClearCart()
    }
  }

  const handleDispatch = () => {
    dispatch(setSearchRef(elementRef.current.className))
  }

  /* Function to handle receipt print*/
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    pageStyle: () => "align-items: center margin: 0px justify-content: center",
  });

  return (

    <div className='container-column' ref={elementRef} onClick={handleDispatch}>

      {
        isReceiptOpen && <Receipt payload={salePayloadState} closeReceipt={() => { setIsReceiptOpen(false) }} ref={printRef} />}
      {
        productBarcode && productTemp.filter((product) => product.productBarcode === productBarcode).forEach((product) => {
          if (cartItems?.some((cart) => cart._id === product._id && cartItems.length > 0)) {
            cartItems?.filter((cart) => cart._id === product._id).forEach((cart) => {
              dispatch(incrementCartItem(product._id))
              setProductBarcode('')
            })

          } else {
            let payload, productTitle, productQuantity, productUnitPrice, productUnitCost, productTotal, _id, productCurrentPurchaseId
            _id = product._id
            productTitle = product.productTitle
            productQuantity = 1
            productUnitPrice = product.productUnitPrice
            productUnitCost = product.productUnitCost
            productTotal = productQuantity * productUnitPrice
            productCurrentPurchaseId = product?.productCurrentPurchaseId ? product?.productCurrentPurchaseId : null

            payload = {
              _id,
              productTitle,
              productQuantity,
              productUnitPrice,
              productUnitCost,
              productTotal,
              productCurrentPurchaseId,
            }

            dispatch(insertProductSale(payload))
            setProductBarcode('')

          }
        })
      }
      <div className="container-row">
        <div className='card-container'>
          {/* <div className='table-header'>
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
          })} */}
          <InfiniteProductList
            products={filteredProducts}
            isLoading={isLoading}
            hasMore={hasMore}
            type={type}
            handleProductClick={handleProductClick} />

        </div>
        <div className='cart-container'>
          <span className='cart-header'><h1>Cart</h1></span>

          <hr></hr>
          <div className='payment-selector-btn'>
            {paymentTypes.length > 0 ? (paymentTypes?.map((payment) => (
              <div className='cash-div'>
                <div className={`logo-tile logo-tile-hover `}  //${paymentMethod === "Cash" ? "payment-checked" : ""}
                  onClick={(e) => handlePaymentClick(payment)}>
                  {/* <MoneyIcon className={` btn-icon-unchecked  `} // "btn-icon-checked"
                  /> */}
                  <span  //${paymentMethod === "Cash" ? "checked-span" : "unchecked-span"}
                  >
                    {payment?.type_image
                      ? <img src={payment.type_image} alt={payment.type_name} style={{ height: '50px', width: '60px' }} />
                      : payment?.type_name
                        ?.split(' ')
                        .map(word => word[0])
                        .join('')
                    }
                  </span>
                </div>
                {/* {
                  showPaymentAccounts && payment?.paymentAccounts?.map((accounts) => (
                    <div className="dropdown-wrapper">
                      <select className="account-dropdown">
                        <option value="">Select Account</option>
                        {
                          showPaymentAccounts && payment?.paymentAccounts?.map((account, index) => (
                            <option key={index} value={account.id}>
                              {account.account_name} ({account.account_number})
                            </option>
                          ))
                        }
                      </select>
                    </div>
                  ))
                } */}
              </div>

            ))) : <span>Create Payemnt Methods from Settings</span>

            }
            {/* <div className='credit-div'>
              <div className={`logo-tile logo-tile-hover ${paymentMethod === "Credit" ? "payment-checked" : ""}`}
                onClick={(e) => setPaymentMethod("Credit")}>
                <CreditCardIcon className={`${paymentMethod === "Credit" ? "btn-icon-checked" : "btn-icon-unchecked"}`} />
                <span className={` ${paymentMethod === "Credit" ? "checked-span" : "unchecked-span"}`}>
                  Credit
                </span>
              </div>
            </div> */}

          </div>
          {showPaymentAccounts && clickedPayment?.paymentAccounts?.length > 0 && (
            <div className="dropdown-wrapper">
              <div className="close-icon-square">
                <CloseIcon onClick={() => setShowPaymentAccounts(false)} style={{ color: 'white', height: '15px', width: '15px' }} />
              </div>
              <select className="account-dropdown">
                <option value="">Select Account</option>
                {clickedPayment.paymentAccounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.account_name} ({account.account_number})
                  </option>
                ))}
              </select>
            </div>
          )}
          <hr></hr>
          {/* <div className='cart-list-header'>
            <table className='cart-list-header-table-header'>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
              </tr>
            </table>
          </div> */}
          {/* <div className='product-cart-list-container'>
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
          </div> */}
          <ProductCartListItem
            cartItems={cartItems}
            isLoading={isSaleLoading}
            handleIncrement={handleIncrement}
            handleDecrement={handleDecrement}
            handleClose={handleClose}
            type={type}
          />
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
      <div className='bottom-container'>
        <div className='bottom-wrapper'>
          <div className='button-wrapper'>
            {
              user.userType === 'admin' ? <button className='sale-options-btn' onClick={handleSaleSettings}>Settings</button> : ''
            }

            {
              isSaleSettingsOpen && <Salesettings closeSaleSettings={() => { setIsSaleSettingsOpen(false) }} />
            }

            <button className='sale-options-btn-clear' onClick={handleClearCart}> Clear </button>
            <button className='sale-options-btn-confirm' onClick={(e) => { handleConfirm(e) }}>Confirm</button>
            <button className='sale-options-btn-receipt-preview' onClick={e => handleReceipt(e)}>Reciept</button>
          </div>


          <div className='input-wrapper'>
            <label htmlFor='customerName'>Customer Name</label>
            <input className='customer-name-input' value={customerName} onChange={e => setCustomerName(e.target.value)} name='customerName' type='text'></input>
            <label htmlFor='customerPhoneNumber'>Customer Mobile No.</label>
            <input className='customer-phone-number-input' value={customerPhoneNumber} onChange={e => setCustomerPhoneNumber(e.target.value)} name='customerPhoeNumber' type='text'></input>
            <label htmlFor='customerCashPaid'>Cash Paid</label>
            <input className='cash-paid-input' value={customerCashPaid} onChange={e => { setCustomerCashPaid(e.target.value) }} name='customerCashPaid' type='number'></input>
          </div>

          <div className='change-show-wrapper'>
            <h2>CHANGE :</h2>
            <span><h1>৳&nbsp;{saleChange}</h1></span>
          </div>

        </div>

      </div>
    </div>
  )
}

export default Sale