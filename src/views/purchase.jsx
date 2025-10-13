import '../css/purchase.css'
import React from 'react'
import InfiniteProductList from '../components/infiniteproductlist'
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/loading';
import MoneyIcon from '@mui/icons-material/Money';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { useLocation } from "react-router-dom";
import { toast } from 'react-toastify'
import ProductCartListItem from '../components/productcartlistitem';
import CreatableSelect from 'react-select/creatable';
import { allPaymentTypes } from '../redux/payment/paymentSlice';
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
  const { paymentTypes } = useSelector((state) => state.paymentTypeState)

  let productTemp = [], fetch = JSON.parse(localStorage.getItem('sale-settings')), salePayload
  const [clickedPayment, setClickedPayment] = useState(null);
  const [selectedAccountsMap, setSelectedAccountsMap] = useState({});
  const [accountInputsPerPayment, setAccountInputsPerPayment] = useState({});
  const [multipayment, setMultipayment] = useState([]);
  const selectedAccounts = selectedAccountsMap[clickedPayment?._id] || [];
  const [showPaymentAccounts, setShowPaymentAccounts] = useState(false)
  
  
  const handlePaymentClick = (payment) => {
    setClickedPayment(payment);
    setShowPaymentAccounts(!showPaymentAccounts);

    setSelectedAccountsMap((prev) => {
      if (!prev[payment._id]) {
        const firstAccount = payment.paymentAccounts[0];
        return {
          ...prev,
          [payment._id]: firstAccount
            ? [{ accountId: firstAccount._id, amount: '' }]
            : [],
        };
      }
      return prev; // already exists
    });
  };


    useEffect(() => {
      if (clickedPayment?._id && clickedPayment.paymentAccounts?.length > 0) {
        setSelectedAccountsMap(prev => {
          // If already exists, keep it; else initialize it with the first account
          if (prev[clickedPayment._id]) return prev;
  
          return {
            ...prev,
            [clickedPayment._id]: [
              {
                accountId: clickedPayment.paymentAccounts[0]._id,
                amount: ''
              }
            ]
          };
        });
      }
    }, [clickedPayment]);
  
    useEffect(() => {
      console.log("Multipayment ....... ", multipayment);
      console.log("selectedAccountsMap ....... ", selectedAccountsMap);
    }, [multipayment])
    useEffect(() => {
      if (clickedPayment?._id && !accountInputsPerPayment[clickedPayment._id]) {
        setAccountInputsPerPayment(prev => ({
          ...prev,
          [clickedPayment._id]: [{ id: '', amount: '' }]
        }));
      }
    }, [clickedPayment]);
  
    const handleAddAccount = () => {
      const existingAccounts = selectedAccountsMap[clickedPayment._id] || [];
      const nextAccount = clickedPayment.paymentAccounts[existingAccounts.length];
  
      if (nextAccount) {
        setSelectedAccountsMap(prev => ({
          ...prev,
          [clickedPayment._id]: [
            ...existingAccounts,
            { accountId: nextAccount._id, amount: '' }
          ]
        }));
      }
    };
  
    const handleAccountChange = (index, field, value) => {
      setSelectedAccountsMap(prev => {
        const updatedAccounts = [...(prev[clickedPayment._id] || [])];
        updatedAccounts[index] = {
          ...updatedAccounts[index],
          [field]: value
        };
        return {
          ...prev,
          [clickedPayment._id]: updatedAccounts
        };
      });
    };
  
    const handleSelectChange = (index, value) => {
      const updated = [...accountInputsPerPayment[clickedPayment._id]];
      updated[index].id = value;
      setAccountInputsPerPayment(prev => ({
        ...prev,
        [clickedPayment._id]: updated
      }));
    };
  
    const handleAmountChange = (index, value) => {
      const updated = [...accountInputsPerPayment[clickedPayment._id]];
      updated[index].amount = value;
      setAccountInputsPerPayment(prev => ({
        ...prev,
        [clickedPayment._id]: updated
      }));
    };
  
  const handleDone = () => {
    const selected = selectedAccountsMap[clickedPayment._id] || [];
  
    const enriched = selected.map((entry) => {
      const account = clickedPayment.paymentAccounts.find(
        (acc) => acc._id === entry.accountId
      );
  
      return {
        accountId: account?._id,
        payment_type_id: account?.payment_type_id,
        amount: parseFloat(entry.amount) || 0,
      };
    });
  
    setMultipayment((prev) => {
      // Combine previous and new entries
      const combined = [...prev?.filter(
        (entry) => !enriched.find((e) => e.accountId === entry.accountId)
      ), ...enriched];
  
      // Remove duplicates by accountId
      const unique = [];
      const seenIds = new Set();
  
      for (const item of combined) {
        if (!seenIds.has(item.accountId)) {
          unique.push(item);
          seenIds.add(item.accountId);
        }
      }
  
      const totalPaid = unique.reduce((sum, item) => sum + item.amount, 0);
  
      return unique;
    });
  
    setShowPaymentAccounts(false);
  };
  
  useEffect(() => {
    const container = document.getElementById("paymentScroll");
    if (!container) return;
  
    let isDown = false;
    let startX;
    let scrollLeft;
  
    const handleMouseDown = (e) => {
      isDown = true;
      container.classList.add("active");
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    };
  
    const handleMouseLeave = () => {
      isDown = false;
      container.classList.remove("active");
    };
  
    const handleMouseUp = () => {
      isDown = false;
      container.classList.remove("active");
    };
  
    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2; // scroll speed
      container.scrollLeft = scrollLeft - walk;
    };
  
    const handleWheel = (e) => {
      if (e.deltaY === 0) return;
      e.preventDefault(); // prevent vertical scroll
      container.scrollLeft += e.deltaY;
    };
  
    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("wheel", handleWheel, { passive: false });
  
    // Clean up
    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("wheel", handleWheel);
    };
  }, []);


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
    let purchaseTime, purchaseDate, payload, purchaseProducts, multiPayment, customerPayload, purchasepurchaseSupplierName, purchasesupplierPhoneNumber, flag = false, updateCustomerPayload, newCustomerPayload
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
    multiPayment = [...multipayment]
    let purchasePayload = {
      purchaseProducts,
      multiPayment,
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

    if (paymentTypes.length === 0) {
      dispatch(allPaymentTypes())
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
          <div className='payment-selector-btn' id="paymentScroll">
            {paymentTypes.length > 0 ? (paymentTypes?.map((payment, index) => (
              <div className='cash-div' key={index}>
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

            ))) : <span className='no-payment-method-text'>Create Payemnt Methods from Settings</span>

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
              <div className="dropdown-header">
                <span className="dropdown-title">Payment Accounts</span>
                <div
                  className="close-icon-square"
                  onClick={() => setShowPaymentAccounts(false)}
                >
                  <CloseIcon style={{ color: 'white', height: '15px', width: '15px' }} />
                </div>
              </div>

              {selectedAccounts.map((entry, index) => (
                <div key={index}>
                  <select
                    className="account-dropdown"
                    value={entry.accountId}
                    onChange={(e) =>
                      handleAccountChange(index, 'accountId', e.target.value)
                    }
                  >
                    <option value="">Select Account</option>
                    {clickedPayment.paymentAccounts.map((account) => (
                      <option key={account._id} value={account._id}>
                        {account.account_name} ({account.account_number})
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    name="account_amount"
                    className="account-amount-input"
                    placeholder="Enter amount"
                    value={entry.amount}
                    onChange={(e) =>
                      handleAccountChange(index, 'amount', e.target.value)
                    }
                  />
                </div>
              ))}

              {selectedAccounts.length < clickedPayment.paymentAccounts.length && (
                <div className="add-account-row" onClick={handleAddAccount}>
                  <span className="add-account-text">Add another account</span>
                  <AddIcon className="add-account-icon" />
                </div>
              )}

              <button className="done-button" onClick={handleDone}>
                Done
              </button>
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