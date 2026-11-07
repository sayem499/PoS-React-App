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
    const [paymentAccounts, setPaymentAccounts] = useState([]);
    const [paymentTypeId, setPaymentTypeId] = useState("");

    const handleUpdatePayment = async () => {
        if (!newTypeName.trim()) {
            toast.error("Please fill the required fields!");
            return;
        }

        try {
            let paymentTypeImageUrl = newTypeImage;
            const currentPaymentType = paymentTypes.find(
                (payment) => payment._id === editingPaymentId
            );

            let typeImageFileId = currentPaymentType?.typeImageFileId || "";

            if (newTypeImageFile) {
                const response = await dispatch(
                    imageUpload({
                        type: "paymentTypes",
                        file: newTypeImageFile,
                    })
                ).unwrap();

                paymentTypeImageUrl = response.image.url;
                typeImageFileId = response.image.fileId;
            }

            const paymentTypeData = {
                type_name: newTypeName,
                type_image: paymentTypeImageUrl,
                typeImageFileId,
            };

            await dispatch(
                updatePaymentType({
                    paymentTypeID: editingPaymentId,
                    updatedPaymentTypeData: paymentTypeData,
                })
            ).unwrap();

            toast.success("Payment type updated successfully!");

            setNewTypeName("");
            setNewTypeImage("");
            setNewTypeImageFile(null);
            setEditingPaymentId(null);
            setIsEditMode(false);
            setShowAddPaymentModal(false);

        } catch (error) {
            console.error(error);
            toast.error(error?.message || "Failed to update payment type");
        }
    };

    const handleAddPayment = async (e) => {
        e?.preventDefault();

        if (!newTypeName.trim()) {
            toast.error("Please fill the required fields!");
            return;
        }

        try {
            let paymentTypeImageUrl = null;
            let typeImageFileId = "";

            if (newTypeImageFile) {
                const response = await dispatch(
                    imageUpload({
                        type: "paymentTypes",
                        file: newTypeImageFile,
                    })
                ).unwrap();

                paymentTypeImageUrl = response.image.url;
                typeImageFileId = response.image.fileId;
            }

            const paymentTypeData = {
                type_name: newTypeName,
                type_image: paymentTypeImageUrl,
                typeImageFileId,
            };

            await dispatch(setPaymentType(paymentTypeData)).unwrap();

            toast.success("Payment type created successfully!");

            setNewTypeName("");
            setNewTypeImage("");
            setNewTypeImageFile(null);
            setShowAddPaymentModal(false);

        } catch (error) {
            console.error(error);
            toast.error(error?.message || "Failed to create payment type");
        }
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

    useEffect(() => {
        dispatch(allPaymentTypes())
    }, [showPaymentAccountModal])


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
                                    <span onClick={() => { setShowPaymentAccountModal(true); setPaymentAccounts(payment.paymentAccounts); setPaymentTypeId(payment._id) }}><FormatListBulletedOutlinedIcon /></span>
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
                    PaymentAccounts={paymentAccounts}
                    paymentTypeId={paymentTypeId}
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