import React, { useEffect, useState } from 'react';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import '../../css/settings/paymentaccountmodal.css';
import { useSelector, useDispatch } from 'react-redux'
import { setPaymentAccount, updatePaymentAccount, deletePaymentAccount } from '../../redux/paymentaccounts/paymentAccountSlice';

const dummyAccounts = [
    {
        id: 1,
        account_name: "Bank Asia",
        account_number: "123456789",
        branch_name: "Motijheel"
    },
    {
        id: 2,
        account_name: "City Bank",
        account_number: "987654321",
        branch_name: "Dhanmondi"
    }
];

const PaymentAccountModal = ({ isOpen, onClose, PaymentAccounts, paymentTypeId }) => {
    const dispatch = useDispatch();
    const [editingId, setEditingId] = useState(null);
    const [accounts, setAccounts] = useState(PaymentAccounts ?? []);
    const [isAdding, setIsAdding] = useState(false);
    const [newAccount, setNewAccount] = useState({
        payment_type_id: paymentTypeId,
        account_name: '',
        account_number: '',
        branch_name: ''
    });

    useEffect(() => {
        console.log(accounts)
    },[PaymentAccounts])

    const handleEdit = (id) => {
        setEditingId(id);
    };

    const handleChange = (id, field, value) => {
        const updated = accounts.map(acc =>
            acc._id === id ? { ...acc, [field]: value } : acc
        );
        setAccounts(updated);
    };

    const handleDelete = (id) => {
        setAccounts(accounts.filter(acc => acc._id !== id));
        dispatch(deletePaymentAccount(id));
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Payment Accounts</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                <div className="modal-header-actions">
                    <button className="add-btn" onClick={() => setIsAdding(true)}>Add Payment Account</button>
                </div>
                <table className="account-table">
                    <thead>
                        <tr>
                            <th>Account Name</th>
                            <th>Account Number</th>
                            <th>Branch Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isAdding && (
                            <tr>
                                <td>
                                    <input
                                        type="text"
                                        value={newAccount.account_name}
                                        onChange={(e) => setNewAccount({ ...newAccount, account_name: e.target.value })}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={newAccount.account_number}
                                        onChange={(e) => setNewAccount({ ...newAccount, account_number: e.target.value })}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={newAccount.branch_name}
                                        onChange={(e) => setNewAccount({ ...newAccount, branch_name: e.target.value })}
                                    />
                                </td>
                                <td>
                                    <button
                                        className="save-btn"
                                        onClick={async () => {
                                            if (!newAccount.account_name || !newAccount.account_number || !newAccount.branch_name) {
                                                alert("Please fill all fields.");
                                                return;
                                            }
                                            setAccounts([...accounts, { id: Date.now(), ...newAccount }]);
                                            await dispatch(setPaymentAccount(newAccount))
                                            setNewAccount({ account_name: '', account_number: '', branch_name: '' });
                                            setIsAdding(false);
                                        }}
                                    >
                                        Save
                                    </button>
                                </td>
                            </tr>
                        )}
                        {accounts.map(account => (
                            <tr key={account._id}>
                                {console.log(account)}
                                <td>
                                    {editingId === account._id ? (
                                        <input
                                            type="text"
                                            value={account.account_name}
                                            onChange={(e) =>
                                                handleChange(account._id, 'account_name', e.target.value)
                                            }
                                        />
                                    ) : (
                                        account.account_name
                                    )}
                                </td>
                                <td>
                                    {editingId === account._id ? (
                                        <input
                                            type="text"
                                            value={account.account_number}
                                            onChange={(e) =>
                                                handleChange(account._id, 'account_number', e.target.value)
                                            }
                                        />
                                    ) : (
                                        account.account_number
                                    )}
                                </td>
                                <td>
                                    {editingId === account._id ? (
                                        <input
                                            type="text"
                                            value={account.branch_name}
                                            onChange={(e) =>
                                                handleChange(account._id, 'branch_name', e.target.value)
                                            }
                                        />
                                    ) : (
                                        account.branch_name
                                    )}
                                </td>
                                <td className="actions">
                                    {editingId === account._id ? (
                                        <>
                                            <button className="update-btn" onClick={ async () => { 
                                                const updatedPaymentAccountData = account;
                                                const paymentAccountID = account._id;
                                                await dispatch(updatePaymentAccount({paymentAccountID, updatedPaymentAccountData}))
                                                setEditingId(null); 
                                            }}>
                                                Update
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <EditOutlinedIcon onClick={() => handleEdit(account._id)} />
                                            <DeleteOutlineOutlinedIcon onClick={() => handleDelete(account._id)} />
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PaymentAccountModal;