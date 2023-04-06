import { useState } from 'react'
import '../css/login.css'
import PosLogo from '../assets/pos-logo.jpg'

function Login() {
  const [userName, setUserName] = useState("")
  const [passWord, setPassWord] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(userName)

  }

  return (

    <div className='Login'>
      <form onSubmit={handleSubmit}>
        <img src={PosLogo} alt='PoS logo' className='Poslogo'></img>
        <h3>Login</h3>
        <label htmlform="Username">Username </label>
        <input value={userName} onChange={(e) => setUserName(e.target.value)} type="username" placeholder="Username" id="Username" name="Username"></input>
        <label htmlform="Password">Password </label>
        <input value={passWord} onChange={(e) => setPassWord(e.target.value)} type="password" placeholder="Password" id="Password" name="Password"></input>
        <button  type="submit">Login</button>
      </form>
    </div>

  
  )
}

export default Login