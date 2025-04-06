import '../css/purchase.css'
import React from 'react'
import InfiniteProductList from '../components/infiniteproductlist'
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/loading';
import MoneyIcon from '@mui/icons-material/Money';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { useLocation } from "react-router-dom";
import { toast } from 'react-toastify'
import ProductCartListItem from '../components/productcartlistitem';
import CreatableSelect from 'react-select/creatable';
import {

  resetPurchase,
  insertProductPurchase,
  incrementCartItem,
  decrementCartItem,
  deleteCartItem,
  cartProductTotal,
  cartSubTotal,
  cartNetTotal,
  setPurchaseSettings,
  getPurchaseSettings,
  cartTotalLessAdjustment,
  insertPurchasePayType,
  insertPurchasePerson,
  insertTimeDate,
  registerPurchase,
  cartTotalCost,
  insertSupplierId,
  insertSupplierName,
  insertSupplierPhoneNumber,
  insertCashPaid,
  calculateChange,

} from '../redux/purchase/purchaseSlice';
import { allProducts, reset, updateProducts } from '../redux/products/productSlice';
import { getSupplier } from '../redux/supplier/supplierSlice';
import Salesettings from '../components/salesettings';
import Swal from 'sweetalert2';

const Purchase = () => {
  const type = "purchase"
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const location = useLocation()
  const { products, isLoading, hasMore } = useSelector((state) => state.products)
  const { suppliers, isSupplierLoading } = useSelector((state) => state.supplierState)
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const { cartItems,
    purchaseSubTotal,
    purchaseVAT,
    purchaseDiscount,
    purchaseTotal,
    purchaseTotalCost,
    purchasePayType,
    purchasePayByCard,
    purchasePayByCash,
    purchaseServedBy,
    purchaseLessAdjustment,
    purchaseVATAmount,
    purchaseDiscountAmount,
    purchaseLessAdjustmentToggle,
    purchaseCashPaid,
    purchaseChange,
    isPurchaseLoading,
    isPurchaseError,
    isPurchaseSuccess,
    purchaseSupplierId,
    purchaseSupplierName,
    purchaseSupplierPhoneNumber,

  } = useSelector((state => state.purchase))
  const [isSaleSettingsOpen, setIsSaleSettingsOpen] = useState(false)
  const [isReceiptOpen, setIsReceiptOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false);
  const [isNameFocused, setIsNameFocused] = useState(false);

  let productTemp = [], fetch = JSON.parse(localStorage.getItem('sale-settings')), salePayload

  const handleDecrement = (id, e) => {
    e.preventDefault()
    dispatch(decrementCartItem(id))
  }


  const handleIncrement = (id, e) => {
    e.preventDefault()
    const cartItem = cartItems.find((cart) => cart._id === id);
    const product = products.find((product) => product._id === id);

    if (cartItem && product) {
      dispatch(incrementCartItem(id));
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
      dispatch(incrementCartItem(id));
    } else {
      const productTempItem = productTemp.find((item) => item._id === id);
      console.log(productTempItem)
      if (productTempItem) {
        const payload = {
          _id: productTempItem._id,
          productTitle: productTempItem.productTitle,
          productQuantity: 1,
          productUnitPrice: productTempItem.productUnitPrice,
          productUnitCost: productTempItem.productUnitCost,
          productTotal: productTempItem.productUnitPrice,
          productCurrentPurchaseId: productTempItem.productCurrentPurchaseId || null,
          productImageUrl: productTempItem.productImageUrl
        };

        dispatch(insertProductPurchase(payload));
      }
    }

  }

  if (products && products.length !== productTemp.length) {
    productTemp = products
  }

  /* Function to load all the sale data. */
  const handleSaleLoad = () => {
    let purchaseTime, purchaseDate, payload, products, customerPayload, purchasepurchaseSupplierName, purchasesupplierPhoneNumber

    purchaseTime = new Date().toLocaleTimeString()
    purchaseDate = new Date().toLocaleDateString()

    payload = {
      purchaseTime,
      purchaseDate
    }

    dispatch(insertTimeDate(payload))

    // customerPayload = {
    //   purchaseSupplierName,
    //   supplierPhoneNumber,
    // }

    // dispatch(insertCustomerInfo(customerPayload))

    // purchasepurchaseSupplierName = purchaseSupplierName
    // purchasesupplierPhoneNumber = supplierPhoneNumber

    products = [...cartItems]
    let purchasePayload = {
      products,
      purchaseSubTotal,
      purchaseVAT,
      purchaseDiscount,
      purchaseTotal,
      purchaseTotalCost,
      purchasePayType,
      purchasePayByCard,
      purchasePayByCash,
      purchaseTime,
      purchaseDate,
      purchaseServedBy,
      purchaseLessAdjustment,
      purchaseVATAmount,
      purchaseDiscountAmount,
      purchaseSupplierId,
      purchasepurchaseSupplierName,
      purchasesupplierPhoneNumber,
      purchaseCashPaid,
      purchaseChange,
    }

    //setSalePayloadState(purchasePayload)
  }

  /* Function to handle confirm button click */
  const handleConfirm = (e) => {
    e.preventDefault()
    let purchaseTime, purchaseDate, payload, purchaseProducts, customerPayload, purchasepurchaseSupplierName, purchasesupplierPhoneNumber, flag = false, updateCustomerPayload, newCustomerPayload
    // customerPayload = {
    //   purchaseSupplierName,
    //   supplierPhoneNumber,
    // }

    // purchasepurchaseSupplierName = purchaseSupplierName
    // purchasesupplierPhoneNumber = supplierPhoneNumber
    // dispatch(insertCustomerInfo(customerPayload))

    purchaseTime = new Date().toLocaleTimeString()
    purchaseDate = new Date().toLocaleDateString()

    payload = {
      purchaseTime,
      purchaseDate
    }

    dispatch(insertTimeDate(payload))

    // if (customers.filter((customer) => customer.customePhoneNumbr === supplierPhoneNumber)) {

    //   customers.filter((customer) => customer.supplierPhoneNumber === supplierPhoneNumber).map((customer) => {

    //     let customerID, purchaseSupplierName, supplierPhoneNumber, customerTotalExpenditure = 0, customerTotalTrades = 0
    //     customerID = customer._id
    //     purchaseSupplierName = customer.purchaseSupplierName
    //     supplierPhoneNumber = customer.supplierPhoneNumber
    //     customerTotalExpenditure = customer.customerTotalExpenditure + purchaseTotal
    //     customerTotalTrades = customer.customerTotalTrades + 1

    //     const updatedCustomerData = {
    //       purchaseSupplierName,
    //       supplierPhoneNumber,
    //       customerTotalExpenditure,
    //       customerTotalTrades
    //     }

    //     updateCustomerPayload = {
    //       customerID,
    //       updatedCustomerData,
    //     }
    //     flag = true

    //   })
    // } else {

    //   if (supplierPhoneNumber !== '') {
    //     let customerTotalExpenditure = 0, customerTotalTrades = 0

    //     customerTotalExpenditure = customerTotalExpenditure + purchaseTotal
    //     customerTotalTrades = customerTotalTrades + 1

    //     newCustomerPayload = {
    //       purchaseSupplierName,
    //       supplierPhoneNumber,
    //       customerTotalExpenditure,
    //       customerTotalTrades
    //     }
    //     flag = false
    //   }
    // }




    purchaseProducts = [...cartItems]
    let purchasePayload = {
      purchaseProducts,
      purchaseSupplierId,
      purchaseSupplierName,
      purchaseSupplierPhoneNumber,
      purchaseSubTotal,
      purchaseVAT,
      purchaseDiscount,
      purchaseTotal,
      purchaseTotalCost,
      // purchasePayType,
      // purchasePayByCard,
      // purchasePayByCash,
      purchaseTime,
      purchaseDate,
      // purchaseServedBy,
      //purchaseLessAdjustment,
      purchaseVATAmount,
      purchaseDiscountAmount,
      purchaseCashPaid,
      purchaseChange,
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
        // handleSaleLoad()
        //setIsReceiptOpen(true)
        // if (flag) {
        //   dispatch(updateCustomer(updateCustomerPayload))
        // } else {
        //   dispatch(setCustomers(newCustomerPayload))
        // }


        dispatch(registerPurchase(purchasePayload))
        Swal.fire('Confirmed!', '', 'success')

      } else if (result.isDenied) {
        Swal.fire('Not Confirmed', '', 'info')
      }
    })



  }

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }

    dispatch(cartProductTotal())
    dispatch(cartSubTotal())
    if (fetch !== null)
      dispatch(getPurchaseSettings())
    else {

      let payload = {
        purchaseVAT,
        purchaseDiscount,
        purchaseLessAdjustmentToggle,
      }

      dispatch(setPurchaseSettings(payload))
    }

    dispatch(cartNetTotal())
    dispatch(cartTotalCost())
    if (fetch?.purchaseLessAdjustmentToggle)
      dispatch(cartTotalLessAdjustment())
    else {
      let payload = {
        purchaseVAT,
        purchaseDiscount,
        purchaseLessAdjustmentToggle,
      }
      dispatch(setPurchaseSettings(payload))
    }
    dispatch(insertPurchasePayType(paymentMethod))
    dispatch(insertPurchasePerson(user.userName))
    if (isPurchaseError) {
      toast.error("Purchase Confirmation Error!!")
    }
    if (isPurchaseSuccess){
      dispatch(resetPurchase())
      dispatch(allProducts({page: 1}))
    }
    //dispatch(insertCashPaid(customerCashPaid))
    dispatch(calculateChange())
  }, [user, navigate, dispatch, cartItems, purchaseTotal, paymentMethod, isPurchaseLoading, isPurchaseSuccess])

  useEffect(() => {
    if (suppliers.length == 0) {
      dispatch(getSupplier());
    }
  }, [suppliers, dispatch])

  const supplierOptions = suppliers.map(supplier => ({
    label: supplier.supplierName,
    value: supplier.supplierName,
    supplierPhoneNumber: supplier.supplierPhoneNumber,
    supplierEmail: supplier.supplierEmail,
    _id: supplier._id,
  }));

  const supplierPhoneOptions = suppliers.map(supplier => ({
    label: supplier.supplierPhoneNumber,
    value: supplier.supplierPhoneNumber,
    supplierName: supplier.supplierName,
    _id: supplier._id,
  }));

  const handleClearCart = () => {
    // setpurchaseSupplierName('')
    // setsupplierPhoneNumber('')
    // setCustomerCashPaid(0)
    dispatch(resetPurchase())
  }

  const handleReceipt = () => {
    //handleSaleLoad()
    // setIsReceiptOpen(true)
  }

  const handleSupplierNameChange = (value) => {
    dispatch(insertSupplierName({ supplierName: value }));
  }

  const handleSupplierPhoneNumberChange = (value) => {
    dispatch(insertSupplierPhoneNumber({ supplierPhoneNumber: value }));
  }

  const handleSupplierIdChange = (value) => {
    dispatch(insertSupplierId(value));
  } 

  const handleCashPaid = (value) => {
    dispatch(insertCashPaid(value));
  }

  return (
    <div className='purchase-container'>
      <div className='purchase-container-inner'>
        <div className='purchase-product-list'>
          <InfiniteProductList
            products={products}
            isLoading={isLoading}
            hasMore={hasMore}
            type={type}
            handleProductClick={handleProductClick} />
        </div>
        <div className='purchase-billing'>
          <div className='purchase-cart-container'>
            <span className='cart-header'><h1>Cart</h1></span>

            <hr></hr>
            <div className='payment-selector-btn'>
              <div className='cash-div'>

                <div className={`logo-tile logo-tile-hover ${paymentMethod === "Cash" ? "payment-checked" : ""}`}
                  onClick={(e) => setPaymentMethod("Cash")}
                >
                  <MoneyIcon className={`${paymentMethod === "Cash" ? "btn-icon-checked" : "btn-icon-unchecked"}`} />
                  <span className={` ${paymentMethod === "Cash" ? "checked-span" : "unchecked-span"}`}>
                    Cash
                  </span>
                </div>
              </div>

              <div className='credit-div'>

                <div className={`logo-tile logo-tile-hover ${paymentMethod === "Credit" ? "payment-checked" : ""}`}
                  onClick={(e) => setPaymentMethod("Credit")}>
                  <CreditCardIcon className={`${paymentMethod === "Credit" ? "btn-icon-checked" : "btn-icon-unchecked"}`} />
                  <span className={` ${paymentMethod === "Credit" ? "checked-span" : "unchecked-span"}`}>
                    Credit
                  </span>
                </div>

              </div>

            </div>
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
            <ProductCartListItem
              cartItems={cartItems}
              isLoading={isPurchaseLoading}
              handleIncrement={handleIncrement}
              handleDecrement={handleDecrement}
              handleClose={handleClose}
              type={type}
            />
            <hr></hr>
            <div className='product-total'>
              <section>
                <h4>Sub-Total:</h4>  <span><h4>৳&nbsp;{purchaseSubTotal.toFixed(2)}</h4></span>
              </section>
              <section>
                VAT({purchaseVAT}%):    <span>৳&nbsp;{purchaseVATAmount.toFixed(2)}</span>
              </section>
              <section>
                Discount({purchaseDiscount}%):  <span>৳&nbsp;-{purchaseDiscountAmount.toFixed(2)}</span>
              </section>
              <section>
                Less Adjustment: <span>৳&nbsp;-{purchaseLessAdjustment.toFixed(2)}</span>
              </section>
              <hr></hr>
              <section>
                <h4>Net Amount (Tk.):</h4> <span><h4>৳&nbsp;{purchaseTotal.toFixed(2)}</h4></span>
              </section>
            </div>
          </div>
        </div>
      </div>

      <div className='purchase-bottom-wrapper'>
        <div className='button-wrapper'>
          {/* {
            user.userType === 'admin' ? <button className='sale-options-btn' onClick={handleSaleSettings}>Settings</button> : ''
          } */}

          {/* {
              isSaleSettingsOpen && <Salesettings closeSaleSettings={() => { setIsSaleSettingsOpen(false) }} />
            } */}

          <button className='sale-options-btn-clear' onClick={handleClearCart}> Clear </button>
          <button className='sale-options-btn-confirm' onClick={(e) => { handleConfirm(e) }}>Confirm</button>
          <button className='sale-options-btn-receipt-preview' onClick={e => handleReceipt(e)}>Reciept</button>
        </div>


        {/* <div className='input-wrapper'>
          <label className='supplier-label' htmlFor='purchaseSupplierName'>Supplier Name</label>
          <CreatableSelect
            className='supplier-input'
            options={supplierOptions}
            value={supplierOptions.find(opt => opt.value === purchaseSupplierName) || { label: purchaseSupplierName, value: purchaseSupplierName }}
            onChange={(newValue) => {
              console.log('New value:', newValue);
              handleSupplierNameChange(newValue?.value || '');
              // Optional: If you want to auto-fill phone based on selection
              const matched = supplierOptions.find(opt => opt.value === newValue?.value);
              console.log("matched ",matched)
              if (matched) {
                handleSupplierPhoneNumberChange(matched.supplierPhoneNumber);
              }
            }}
            placeholder="Select or type supplier name"
            isClearable
            styles={{
              control: (base, state) => ({
                ...base,
                backgroundColor: 'transparent',
                border: 'none',
                boxShadow: 'none',
                minHeight: 'auto',
              }),
              // Optional: Remove extra padding/margins from input/other parts
              valueContainer: (base) => ({
                ...base,
                padding: 0,
              }),
              input: (base) => ({
                ...base,
                margin: 0,
                padding: 0,
              }),
              indicatorsContainer: (base) => ({
                ...base,
                padding: 0,
              }),
              menu: (base) => ({
                ...base,
                zIndex: 20, // Apply custom z-index here
              }),
            }}
          />
          <label className='supplier-label' htmlFor='supplierPhoneNumber'>Supplier Mobile No.</label>
          <CreatableSelect
            className='supplier-input'
            options={supplierPhoneOptions}
            value={
              supplierPhoneOptions.find(opt => opt.value === purchaseSupplierPhoneNumber) ||
              { label: purchaseSupplierPhoneNumber, value: purchaseSupplierPhoneNumber }
            }
            onChange={(newValue) => {
              console.log('New value phone:', newValue);

              handleSupplierPhoneNumberChange(newValue?.value || '');

              const matched = supplierPhoneOptions.find(opt => opt.value === newValue?.value);
              if (matched) {
                handleSupplierNameChange(newValue?.supplierName || '');
              }
            }}
            placeholder="Select or type supplier phone"
            isClearable
            styles={{
              control: (base, state) => ({
                ...base,
                backgroundColor: 'transparent',
                border: 'none',
                boxShadow: 'none',
                minHeight: 'auto',
              }),
              // Optional: Remove extra padding/margins from input/other parts
              valueContainer: (base) => ({
                ...base,
                padding: 0,
              }),
              input: (base) => ({
                ...base,
                margin: 0,
                padding: 0,
              }),
              indicatorsContainer: (base) => ({
                ...base,
                padding: 0,
              }),
              menu: (base) => ({
                ...base,
                zIndex: 20, // Apply custom z-index here
              }),
            }}
          />
          <label className='supplier-label' htmlFor='customerCashPaid'>Cash Paid</label>
          <input className='supplier-cash-input' value={purchaseCashPaid} onChange={e => { handleCashPaid(e.target.value) }} name='supplierCashPaid' type='number'></input>
        </div> */}

        <div className='input-supplier-wrapper'>
          {/* Row for Supplier Name and Supplier Phone */}
          <div className="row">
            <div>
              <label className='supplier-label' htmlFor='purchaseSupplierName'>Supplier Name</label>
              <div className={`supplier-input ${isNameFocused ? 'focused' : ''}`}>
                <CreatableSelect
                  className="w-full"
                  options={supplierOptions}
                  value={
                    supplierOptions.find(opt => opt.value === purchaseSupplierName) ||
                    { label: purchaseSupplierName, value: purchaseSupplierName }
                  }
                  onChange={(newValue) => {
                    handleSupplierNameChange(newValue?.value || '');
                    const matched = supplierOptions.find(opt => opt.value === newValue?.value);
                    if (matched) {
                      handleSupplierPhoneNumberChange(matched.supplierPhoneNumber);
                      handleSupplierIdChange(newValue?._id || '');
                    }
                  }}
                  onFocus={() => setIsNameFocused(true)}
                  onBlur={() => setIsNameFocused(false)}
                  placeholder="Select or type supplier name"
                  isClearable
                  styles={{
                    control: (base) => ({
                      ...base,
                      backgroundColor: 'transparent',
                      border: 'none',
                      boxShadow: 'none',
                      minHeight: 'auto',
                    }),
                    valueContainer: (base) => ({
                      ...base,
                      padding: 0,
                    }),
                    input: (base) => ({
                      ...base,
                      margin: 0,
                      padding: 0,
                    }),
                    indicatorsContainer: (base) => ({
                      ...base,
                      padding: 0,
                    }),
                    menu: (base) => ({
                      ...base,
                      zIndex: 20,
                    }),
                  }}
                />
              </div>
            </div>

            <div>
              <label className='supplier-label' htmlFor='supplierPhoneNumber'>Supplier Mobile No.</label>
              <div className={`supplier-input ${isFocused ? 'focused' : ''}`}>
                <CreatableSelect
                  options={supplierPhoneOptions}
                  value={
                    supplierPhoneOptions.find(opt => opt.value === purchaseSupplierPhoneNumber) ||
                    { label: purchaseSupplierPhoneNumber, value: purchaseSupplierPhoneNumber }
                  }
                  onChange={(newValue) => {
                    handleSupplierPhoneNumberChange(newValue?.value || '');
                    const matched = supplierPhoneOptions.find(opt => opt.value === newValue?.value);
                    if (matched) {
                      handleSupplierNameChange(newValue?.supplierName || '');
                      handleSupplierIdChange(newValue?._id || '');
                    }
                  }}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Select or type supplier phone"
                  isClearable
                  styles={{
                    control: (base) => ({
                      ...base,
                      backgroundColor: 'transparent',
                      border: 'none',
                      boxShadow: 'none',
                      minHeight: 'auto',
                    }),
                    valueContainer: (base) => ({
                      ...base,
                      padding: 0,
                    }),
                    input: (base) => ({
                      ...base,
                      margin: 0,
                      padding: 0,
                    }),
                    indicatorsContainer: (base) => ({
                      ...base,
                      padding: 0,
                    }),
                    menu: (base) => ({
                      ...base,
                      zIndex: 20,
                    }),
                  }}
                />
              </div>
            </div>
          </div>

          {/* Cash Paid on a separate row */}
          <label className='supplier-label' htmlFor='customerCashPaid'>Cash Paid</label>
          <input className='supplier-cash-input' value={purchaseCashPaid} onChange={e => { handleCashPaid(e.target.value) }} name='supplierCashPaid' type='number'></input>
        </div>

        {/* <div className='change-show-wrapper'>
          <h2>CHANGE :</h2>
          <span><h1>৳&nbsp;{saleChange}</h1></span>
        </div> */}

      </div>
    </div>

  )
}

export default Purchase