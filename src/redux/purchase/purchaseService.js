import axios from 'axios'

const API_URL = process.env.REACT_APP_ORIGIN_URL + '/api/purchases/'


const allPurchases = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.get(API_URL, config)
    return response.data
}

const setPurchases = async (data, token) => {
 const config = {
    headers: {
        Authorization: `Bearer ${token}`
    }
 }

 const response = await axios.post(API_URL, data, config)

 return response.data

}

const deleteProduct = async ( purchaseID, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.delete(API_URL +  purchaseID, config)
    return response.data
}

const updatePurchases = async ( purchaseID, data, token) => {
    const config = {
       headers: {
           Authorization: `Bearer ${token}`
       }
    }
    const response = await axios.put(API_URL +  purchaseID, data, config)
   
    return response.data
   
}

const getPurchaseById = async (purchaseID, token) => {
    const config = {
       headers: {
           Authorization: `Bearer ${token}`
       }
    }
   
    const response = await axios.get(API_URL + purchaseID, config);
   
    return response.data
   
}


const purchasesService = {
    allPurchases,
    setPurchases,
    deleteProduct,
    updatePurchases,
    getPurchaseById,
}

export default purchasesService