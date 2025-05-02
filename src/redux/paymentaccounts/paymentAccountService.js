import axios from 'axios';

const API_URL = process.env.REACT_APP_ORIGIN_URL + '/api/paymentaccounts/'

const getPaymentAccounts = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get(API_URL, config)
    return response.data
}

const setPaymentAccount = async (data, token) => {
    const config = { 
        headers: {
            Authorization: `Bearer ${token}`
        }
    } 

    const response = await axios.post(API_URL, data, config)
    return response.data
}

const updatePaymentAccount = async (paymentAccountID, data, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.put(API_URL + paymentAccountID, data, config)
    return response.data
}

const deletePaymentAccount = async (paymentAccountID, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.delete(API_URL + paymentAccountID, config)
    return response.data
}

const paymentAccountService = {
    getPaymentAccounts,
    setPaymentAccount,
    updatePaymentAccount,
    deletePaymentAccount,
}

export default paymentAccountService