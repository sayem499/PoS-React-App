import axios from "axios";

const API_URL = '/api/customers/'

const getCustomers = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get(API_URL, config)
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

const customerService = {
    getCustomers,
    setCustomers,
}

export default customerService