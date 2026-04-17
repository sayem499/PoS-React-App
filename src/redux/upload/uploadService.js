import axios from 'axios'

const FILE_PATH = '/api/uploads/';

const imageUpload = async (type, file, data, token) => {
    if (!["logos", "profiles", "products", "paymentTypes"].includes(type)) {
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

    const response = await axios.post(`${FILE_PATH}${type}`, formData, config);
    return response.data;
};

const uploadService = {
    imageUpload
}

export default uploadService