import axios from 'axios'

const API_URL = 'https://pos-app-backend.onrender.com/api/suppliers/'

const setSupplier = async (data, token) => {
    const config = {
        headers:{
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.post(API_URL, data, config)
    return response.data
}

const getSupplier = async (token) => {
    const config = {
        headers:{
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get(API_URL, config)
    return response.data
}

const updateSupplier = async (supplierID, data, token) => {
    const config = {
        headers:{
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.put(API_URL + supplierID, data, config)
    return response.data
}

const deleteSupplier = async (supplierID, token) => {
    const config = {
        headers:{
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.delete(API_URL + supplierID, config)
    return response.data
}

const supplierService = {
    setSupplier,
    getSupplier,
    updateSupplier,
    deleteSupplier,
}

export default supplierService