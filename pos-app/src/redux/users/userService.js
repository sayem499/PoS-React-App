import axios from 'axios'


const API_URL_GETUSERS = '/api/users'


//Get All Users
const allUsers = async () => {
    const response = await axios.get(API_URL_GETUSERS)
    
    return response.data
} 


const userService = {
    allUsers,
}

export default userService