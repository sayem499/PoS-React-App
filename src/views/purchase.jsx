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
  insertCustomerInfo,
  insertCashPaid,
  calculateChange,

} from '../redux/purchase/purchaseSlice';


const Purchase = () => {
  const type = "purchase"
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const location = useLocation()
  const { products, isLoading, hasMore } = useSelector((state) => state.products)
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
  } = useSelector((state => state.purchase))

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
    //dispatch(insertCashPaid(customerCashPaid))
    dispatch(calculateChange())
  }, [user, navigate, dispatch, cartItems, purchaseTotal, paymentMethod, isPurchaseLoading])

  return (
    <div className='purchase-container'>
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
  )
}

export default Purchase