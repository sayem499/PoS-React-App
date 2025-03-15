import axios from 'axios'

const API_URL = process.env.REACT_APP_ORIGIN_URL + '/api/uploads/'

const imageUpload = async (type, file, data, token) => {
    if (!["logos", "profiles", "products"].includes(type)) {
        throw new Error("Invalid upload type");
    }
    const formData = new FormData();
    formData.append('image', file); // 'image' should match the field name in multer

    if (data?.previousImageUrl) {
        formData.append('previousImageUrl', data.previousImageUrl);
    }

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    };

    const response = await axios.post(`${API_URL}${type}`, formData, config);
    return response.data;
};

const uploadService = {
    imageUpload
}

export default uploadService