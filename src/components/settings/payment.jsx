import React, { useState } from 'react'
import '../../css/settings/payment.css';

const Payment = () => {
    const [paymentTypes, setPaymentTypes] = useState([{ type_name: "Bikash", type_image: null }]);
    const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
    const [newTypeName, setNewTypeName] = useState('');
    const [newTypeImage, setNewTypeImage] = useState('');
    const handleAddPayment = () => {
        // setPaymentTypes(prev => [...prev, { type_name: newTypeName, type_image: newTypeImage }]);
        setNewTypeName('');
        setNewTypeImage('');
        setShowAddPaymentModal(false);
    };
    const handleCancel = () => {
        setNewTypeName('');
        setNewTypeImage('');
        setShowAddPaymentModal(false);
    }

    return (
        <div className='settings-payment-container'>
            <div className='settings-payment-add'>
                <button class="add-payment-btn" onClick={() => setShowAddPaymentModal(true)}>
                    <span class="plus-icon">+</span>
                    Add Payment
                </button>
            </div>
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
            {showAddPaymentModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Add Payment Type</h2>
                        <input
                            type="text"
                            placeholder="Payment Type Name"
                            value={newTypeName}
                            onChange={(e) => setNewTypeName(e.target.value)}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                        setNewTypeImage(reader.result); // Save base64 image
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }}
                        />

                        {newTypeImage && (
                            <div className="image-preview">
                                <img src={newTypeImage} alt="Preview" />
                            </div>
                        )}
                        <div className="modal-buttons">
                            <button onClick={handleAddPayment}>Add</button>
                            <button onClick={handleCancel}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Payment