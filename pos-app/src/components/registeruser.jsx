import '../css/registeruser.css'
import { useEffect, useState } from 'react'
import { register, reset } from '../auth/authSlice.js'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { Blocks } from 'react-loader-spinner'




function Registeruser({closeAddUser}) {
  const [userName, setUserName] = useState('')
  const [userPassword, setPassWord] = useState('')
  const [passWord2, setPassWord2] = useState('')
  const [userType, setUserType] = useState('choose')

  const dispatch = useDispatch()

  const { user, isError, isSuccess, isLoading, message } = useSelector(
    (state) => state.auth)

  useEffect(() => {



    if (isError) {
      toast.error(message)
    }

    if (isSuccess) {
      toast.success('User created!')
    }

    dispatch(reset())

  }, [user, isError, isSuccess, message, dispatch])

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(userName + "\n" + userPassword + "\n" + passWord2)
    if (userName === '' || userPassword === '' || passWord2 === '') {
      toast.error('Please fill the required fields!')
    } else if (userType !== "admin" && userType !== "regular") {
      toast.error('Please choose a role!')
    } else if (userPassword !== passWord2) {
      toast.error('Passwords do not match!')
    } else {
      const userData = {
        userName,
        userPassword,
        userType,
      }

      dispatch(register(userData))
      setUserName('')
      setPassWord('')
      setPassWord2('')
      setUserType('')
    }


  }

  if (isLoading) {
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
    <div className='adduser-container' onClick={(e) => { if(e.target.className === 'adduser-container') closeAddUser()}}>
      <div className={'registerwindow'}>
        <form onSubmit={handleSubmit}>
          <label htmlFor="Username">Username </label>
          <input value={userName} onChange={(e) => setUserName(e.target.value)} type="text" placeholder="Username" id="Username" name="Username"></input>
          <label htmlFor="Password">Password </label>
          <input value={userPassword} onChange={(e) => setPassWord(e.target.value)} type="password" placeholder="Password" id="Password" name="Password"></input>
          <label htmlFor='Password2'>Retype Password</label>
          <input value={passWord2} onChange={(e) => setPassWord2(e.target.value)} type="password" placeholder="Retype password" id="Password2" name="Password2"></input>
          <label htmlFor="User Type" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select an option</label>
          <select value={userType} onChange={(e) => setUserType(e.target.value)} id="userRole" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option value="choose">Choose a role...</option>
            <option value="admin">Admin</option>
            <option value="regular">Reguler</option>
          </select>
          <button className='register-button' type="submit">Register</button>
        </form>
      </div>
    </div>
  )
}

export default Registeruser