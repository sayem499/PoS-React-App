import axios from 'axios'

const API_URL = process.env.REACT_APP_ORIGIN_URL + '/api/uploads/'

const imageUpload = async (type, file, data, token) => {
    if (!["logos", "profiles", "products"].includes(type)) {
        throw new Error("Invalid upload type");
    }
    console.log(token)
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    const response = await axios.post(`${API_URL}${type}`, file, data, config);
    return response.data;
};

const uploadService = {
    imageUpload
}

export default uploadService