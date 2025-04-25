import React, { useState } from 'react'
import '../../css/settings/payment.css';

const Payment = () => {
    const [paymentTypes, setPaymentTypes] = useState([{type_name: "Bikash", type_image: null}]);
    return (
        <div className='settings-payment-container'>
            {
                paymentTypes.length > 0 ? <div className='settings-payment-card'>
                    {
                        paymentTypes.map((payment) => (
                            <div className='settings-payment-card-item'>
                                <span>{payment?.type_name}</span>
                                <span>
                                    {payment?.type?.image
                                        ? <img src={payment.type.image} alt={payment.type_name} />
                                        : payment?.type_name
                                            ?.split(' ')
                                            .map(word => word[0])
                                            .join('')
                                    }
                                </span>
                            </div>
                        )
                        )
                    }
                </div> :
                    <div className='settings-payment-notfound'>No Payment Type Data Found.</div>
            }
        </div>
    )
}

export default Payment