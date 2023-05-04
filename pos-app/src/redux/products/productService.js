import axios from 'axios'

const API_URL_GETPRODUCTS = '/api/products'

const allProducts = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.get(API_URL_GETPRODUCTS, config)
    return response.data
}


const productService = {
    allProducts,
}

export default productService