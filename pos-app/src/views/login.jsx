
import '../css/login.css'
import PosLogo from '../assets/pos-logo.jpg'
import { useEffect, useState } from 'react'
import { login, reset } from '../auth/authSlice.js'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { Blocks } from 'react-loader-spinner'
import { useNavigate } from 'react-router-dom'

function Login() {
  const { user, isError, isSuccess, isLoading, message } = useSelector(
    (state) => state.auth)
  const [userName, setUserName] = useState("")
  const [userPassword, setPassWord] = useState("")
  const [userType, setUserType] = useState("")

  const dispatch = useDispatch()
  const navigate = useNavigate()

  
  
  
  useEffect(() => {
    if(isSuccess || user){
      navigate("/dashboard")
    }


    if(isError) {
      toast.error(message)
    }

    
    
    dispatch(reset())

  }, [user, isError, isSuccess, message, dispatch, navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    const userData = {
      userName,
      userPassword,
    }

    dispatch(login(userData))
  }

  if(isLoading) {
    return <Blocks
      visible={true}
      height="80"
      width="80"
      ariaLabel="blocks-loading"
      wrapperStyle={{}}
      wrapperClass="blocks-wrapper"
    />
  }

  return (

    <div className='Login'>
      <form onSubmit={handleSubmit}>
        <img src={PosLogo} alt='PoS logo' className='Poslogo'></img>
        <h3>Login</h3>
        <label htmlform="Username">Username </label>
        <input value={userName} onChange={(e) => setUserName(e.target.value)} type="username" placeholder="Username" id="Username" name="Username"></input>
        <label htmlform="Password">Password </label>
        <input value={userPassword} onChange={(e) => setPassWord(e.target.value)} type="password" placeholder="Password" id="Password" name="Password"></input>
        <button  type="submit">Login</button>
      </form>
    </div>

  
  )
}

export default Login