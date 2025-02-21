import axios from 'axios'

const API_URL_REGISTER = process.env.REACT_APP_ORIGIN_URL + '/api/users/register'
const API_URL_LOGIN = process.env.REACT_APP_ORIGIN_URL + '/api/users/login'


//Login User
const login = async (userData) => {
    const response = await axios.post(API_URL_LOGIN, userData)

    if(response.data){
        localStorage.setItem('users', JSON.stringify(response.data))
    }

    return response.data
}


//Register User
const register = async (userData) => {
    const response = await axios.post(API_URL_REGISTER, userData)

    return response.data
}

//Logout User
const logout = () => {
     localStorage.removeItem('users')
}

 

const authService = {
    register,
    login,
    logout,
    
}

export default authService