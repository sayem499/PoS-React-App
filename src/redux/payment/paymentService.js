import axios from 'axios';

const API_URL = process.env.REACT_APP_ORIGIN_URL + '/api/paymenttypes/'

const getPaymentTypes = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get(API_URL, config)
    return response.data
}

const setPaymentType = async (data, token) => {
    const config = { 
        headers: {
            Authorization: `Bearer ${token}`
        }
    } 

    const response = await axios.post(API_URL, data, config)
    return response.data
}

const updatePaymentType = async (paymentTypeID, data, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.put(API_URL + paymentTypeID, data, config)
    return response.data
}

const deletePaymentType = async (paymentTypeID, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.delete(API_URL + paymentTypeID, config)
    return response.data
}

const paymentTypeService = {
    getPaymentTypes,
    setPaymentType,
    updatePaymentType,
    deletePaymentType,
}

export default paymentTypeService