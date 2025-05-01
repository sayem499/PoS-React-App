import React, { useState, useEffect } from 'react'
import '../../css/settings/payment.css';
import { useSelector, useDispatch } from 'react-redux'
import { imageUpload } from '../../redux/upload/uploadSlice'
import { allPaymentTypes, setPaymentType, updatePaymentType, deletePaymentType } from '../../redux/payment/paymentSlice';
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import PaymentAccountModal from './paymentaccountmodal';

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
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingPaymentId, setEditingPaymentId] = useState(null);
    const [showPaymentAccountModal, setShowPaymentAccountModal] = useState(false);

    const handleUpdatePayment = async () => {
        let paymentTypeImageUrl = newTypeImage;
    
        if (newTypeImageFile) {
            const payload = {
                type: 'paymentTypes',
                file: newTypeImageFile,
                data: {
                    previousImageUrl: newTypeImage,
                },
            };
            console.log("newTypeImage ............... ", newTypeImage)
            const response = await dispatch(imageUpload(payload)).unwrap();
            paymentTypeImageUrl = response.filePath;
        }
    
        if (newTypeName === '') {
            toast.error('Please fill the required fields!');
            return;
        }
        
        console.log("paymentTypeImageUrl ............... ",paymentTypeImageUrl)
        const paymentTypeData = {
            type_name: newTypeName,
            type_image: paymentTypeImageUrl,
        };
    
        try {
            dispatch(updatePaymentType({ paymentTypeID: editingPaymentId, updatedPaymentTypeData: paymentTypeData }));
            toast.success('Payment type updated successfully!');
        } catch (error) {
            console.log(error);
            toast.error('Failed to update payment type');
        }
    
        // Reset
        setNewTypeName('');
        setNewTypeImage('');
        setNewTypeImageFile('');
        setEditingPaymentId(null);
        setIsEditMode(false);
        setShowAddPaymentModal(false);
    };

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

    const handleDeletePaymentType = async (id) => {
        try {
            await dispatch(deletePaymentType(id)).unwrap(); // assuming createAsyncThunk
            toast.success('Payment type deleted successfully!');
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete payment type');
        }
    };

    const handleCancel = () => {
        setNewTypeName('');
        setNewTypeImage('');
        setNewTypeImageFile('');
        setEditingPaymentId(null);
        setIsEditMode(false);
        setShowAddPaymentModal(false);
    };

    useEffect(() => {
        if (!user) {
            navigate('/login')
        }

        if (paymentTypes.length === 0) {
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
                    <div className='settings-payment-card-header'>
                        <span>Name</span>
                        <span>Icon</span>
                        <span>Action</span>
                    </div>
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
                                <div className='settings-payment-card-item-actions'>
                                    <span onClick={() => setShowPaymentAccountModal(true)}><FormatListBulletedOutlinedIcon/></span>
                                    <span onClick={() => {
                                        setIsEditMode(true);
                                        setShowAddPaymentModal(true);
                                        setNewTypeName(payment.type_name);
                                        setNewTypeImage(payment.type_image); // show existing image
                                        setEditingPaymentId(payment._id); // or payment.id based on your data
                                    }}><EditOutlinedIcon /></span>
                                    <span onClick={() => handleDeletePaymentType(payment._id)}><DeleteOutlineOutlinedIcon /></span>
                                </div>
                            </div>
                        )
                        )
                    }
                </div> :
                    <div className='settings-payment-notfound'>No Payment Type Data Found.</div>
            }

            {showPaymentAccountModal && (
                <PaymentAccountModal         
                isOpen={showPaymentAccountModal}
                onClose={() => setShowPaymentAccountModal(false)}
                // paymentAccounts={accounts}
                // onDelete={handleDelete}
                // onUpdate={handleUpdate}
                />
                
            )}

            {showAddPaymentModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>{isEditMode ? 'Edit Payment Type' : 'Add Payment Type'}</h2>
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
                            <button onClick={isEditMode ? handleUpdatePayment : handleAddPayment}>
                                {isEditMode ? 'Update' : 'Add'}
                            </button>
                            <button onClick={handleCancel}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Payment