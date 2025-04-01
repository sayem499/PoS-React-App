import React from 'react'
import Loading from '../components/loading';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import "../css/productcartlistitem.css";

const ProductCartListItem = (props) => {
    const {
        cartItems,
        isLoading,
        handleIncrement,
        handleDecrement,
        handleClose,
        type
    } = props;

    const truncateText = (text, wordLimit) => {
        const words = text.split(" ");
        return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : text;
    };

    return (
        <div className='product-cart-list-container'>
            {cartItems && cartItems.map((product, key) => {

                return (
                    <div key={key} className='product-cart-list'>
                        {
                            isLoading && <Loading />
                        }
                        {/* <ul>
                            <li >
                                <section>
                                    <span>{product.productTitle}</span>
                                </section>
                                <section className=''>
                                    <input value={type === 'purchase' ? product.productUnitCost : product.productUnitPrice } /> 
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
                                        return <span key={key}>{ type === 'purchase' ? total.productTotalCost : total.productTotal }</span>
                                    })

                                    }
                                </section>
                                <span id='close-btn'><CloseIcon onClick={(e) => handleClose(product._id, e)} /></span>
                            </li>
                        </ul> */}
                        <ul className="purchase-product-billing-list">
                            <li>
                                {/* Product Title - Takes 2 columns */}
                                <section className="purchase-product-title" title={product.productTitle}>
                                    <img src={product.productImageUrl} alt={product.productTitle} className="product-image" />
                                    <span>{truncateText(product.productTitle, 3)}</span>
                                </section>

                                {/* Price Input - Takes 1 column */}
                                <section className="purchase-product-input">
                                    <input
                                        value={type === "purchase" ? product.productUnitCost : product.productUnitPrice}
                                    />
                                </section>

                                {/* Quantity Controls - Takes 1 column */}
                                <section className="purchase-product-quantity">
                                    <span id="unit-multiplier-btn">
                                        <RemoveIcon onClick={(e) => handleDecrement(product._id, e)} />
                                    </span>

                                    {cartItems
                                        .filter((count) => count._id === product._id)
                                        .map((tempCount, key) => (
                                            <span key={key} id="unit-multiplier">
                                                {tempCount.productQuantity}
                                            </span>
                                        ))}

                                    <span id="unit-multiplier-btn">
                                        <AddIcon onClick={(e) => handleIncrement(product._id, e)} />
                                    </span>
                                </section>

                                {/* Total Price - Takes 1 column */}
                                <section className="purchase-product-total">
                                    {cartItems
                                        ?.filter((total) => total._id === product._id)
                                        .map((total, key) => (
                                            <span key={key}>
                                                {type === "purchase" ? total.productTotalCost : total.productTotal}
                                            </span>
                                        ))}
                                </section>

                                {/* Close Button - Takes 1 column */}
                                <section className="purchase-product-close">
                                    <button className='purchase-product-close-button'>
                                        <CloseIcon onClick={(e) => handleClose(product._id, e)} />
                                    </button>

                                </section>
                            </li>
                        </ul>
                    </div>
                )
            })}
        </div>
    )
}

export default ProductCartListItem