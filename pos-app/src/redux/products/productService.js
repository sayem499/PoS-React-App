import axios from 'axios'

const API_URL_GETPRODUCTS = '/api/products'
const API_URL_SETPRODUCTS = '/api/products'

const allProducts = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.get(API_URL_GETPRODUCTS, config)
    return response.data
}

const setProducts = async (data, token) => {
 const config = {
    headers: {
        Authorization: `Bearer ${token}`
    }
 }

 const response = await axios.post(API_URL_SETPRODUCTS, data, config)

 return response.data

}


const productService = {
    allProducts,
    setProducts,
}

export default productService