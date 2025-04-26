import React, { useState, useEffect } from 'react'
import '../../css/settings/payment.css';
import { useSelector, useDispatch } from 'react-redux'
import { imageUpload } from '../../redux/upload/uploadSlice'
import { allPaymentTypes, setPaymentType } from '../../redux/payment/paymentSlice';
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Payment = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)
    const { paymentTypes, isPaymentTypesLoading, isPaymentTypesError, isPaymentTypesSuccess, message } = useSelector((state) => state.paymentTypeState)
    //const [paymentTypes, setPaymentTypes] = useState([]);
    const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
    const [newTypeName, setNewTypeName] = useState('');
    const [newTypeImage, setNewTypeImage] = useState('');
    const [newTypeImageFile, setNewTypeImageFile] = useState('');
    const handleAddPayment = async (e) => {
        let paymentTypeImageUrl = null;
        if (newTypeImageFile) {
            const payload = {
                type: 'paymentTypes',
                file: newTypeImageFile,
                data: {
                    previousImageUrl: null
                }
            }

            const response = await dispatch(imageUpload(payload)).unwrap()
            paymentTypeImageUrl = response.filePath
        }
        if (newTypeName === '')
            toast.error('Please fill the required fields!')

        let paymentTypeData = {
            type_name: newTypeName,
            type_image: paymentTypeImageUrl
        }

        try {
            dispatch(setPaymentType(paymentTypeData))

        } catch (error) {
            console.log(error)
        }

        if (isPaymentTypesSuccess) {
            toast.success('Payment type created successfully!')
        }

        setNewTypeName('');
        setNewTypeImage('');
        setShowAddPaymentModal(false);
    };
    const handleCancel = () => {
        setNewTypeName('');
        setNewTypeImage('');
        setShowAddPaymentModal(false);
    }

    useEffect(() => {
        if (!user) {
            navigate('/login')
        }

        if(paymentTypes.length === 0){
            dispatch(allPaymentTypes())
        }
        console.log(paymentTypes)

    }, [])

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
                                <span className='settings-payment-typename'>{payment?.type_name}</span>
                                <span>
                                    {payment?.type_image
                                        ? <img src={payment.type_image} alt={payment.type_name} style={{ height: '50px', width: '60px' }} />
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
                                    setNewTypeImageFile(file);
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