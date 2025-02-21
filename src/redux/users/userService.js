import axios from 'axios'


const API_URL_USERS = process.env.REACT_APP_ORIGIN_URL + '/api/users/'


//Get All Users
const allUsers = async () => {
    const response = await axios.get(API_URL_USERS)
    
    return response.data
} 

//Update user
const updateUser = async (userID, data, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.put(API_URL_USERS + userID, data, config)
    return response.data
}

//Delete user
const deleteUser = async (userID, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.delete(API_URL_USERS + userID, config)
    return response.data
}

const userService = {
    allUsers,
    updateUser,
    deleteUser,
}

export default userService