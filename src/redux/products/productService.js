import axios from 'axios'

const API_URL = process.env.REACT_APP_ORIGIN_URL + '/api/products/'


const allProducts = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.get(API_URL, config)
    return response.data
}

const getProductById = async (productID, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.get(API_URL + productID, config)
    return response.data
}

const setProducts = async (data, token) => {
 const config = {
    headers: {
        Authorization: `Bearer ${token}`
    }
 }

 const response = await axios.post(API_URL, data, config)

 return response.data

}

const deleteProduct = async (productID, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.delete(API_URL + productID, config)
    return response.data
}

const updateProducts = async (productID, data, token) => {
    const config = {
       headers: {
           Authorization: `Bearer ${token}`
       }
    }
    const response = await axios.put(API_URL + productID, data, config)
   
    return response.data
   
   }


const productService = {
    allProducts,
    setProducts,
    deleteProduct,
    updateProducts,
    getProductById
}

export default productService