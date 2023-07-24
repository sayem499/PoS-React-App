import axios from "axios";

const API_URL = '/api/sales/'

const registerSale = async (data, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.post(API_URL, data, config)
    return response.data
}

const getSales = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.get(API_URL, config)
    return response.data
}


const saleServices = {
    registerSale,
    getSales,
}

export default saleServices