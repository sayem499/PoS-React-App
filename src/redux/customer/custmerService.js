import axios from "axios";

const API_URL = '/api/customers/'

const getCustomers = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get(API_URL, config)
    return response.data
}
const setCustomers = async (data, token) => {
    const config = { 
        headers: {
            Authorization: `Bearer ${token}`
        }
    } 

    const response = await axios.post(API_URL, data, config)
    return response.data
}

const updateCustomer = async (customerID, data, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.put(API_URL + customerID, data, config)
    return response.data
}

const deleteCustomer = async (customerID, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.delete(API_URL + customerID, config)
    return response.data
}

const customerService = {
    getCustomers,
    setCustomers,
    updateCustomer,
    deleteCustomer,
}

export default customerService