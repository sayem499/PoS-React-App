import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import '../css/updateuser.css'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { updateUser } from '../redux/users/userSlice'






function Updateuser({ row, closeUpdateUser }) {
    const [userName, setUserName] = useState(row.userName)
    const [userPassword, setPassWord] = useState('')
    const [passWord2, setPassWord2] = useState('')
    const [userType, setUserType] = useState(row.userType)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { users, isError, message } = useSelector((state) => state.users)
    const { user } = useSelector((state) => state.auth)

    useEffect(() => {
        if (!user) {
            navigate('/login')
        }

        if (isError) {
            toast.error(message)
        }
    }, [])


    const handleUpdate = (e) => {
        e.preventDefault()

        if (userName === '' || userPassword === '' || passWord2 === '') {
            toast.error('Please fill the required fields!')
        } else if (userType !== "admin" && userType !== "regular") {
            toast.error('Please choose a role!')
        } else if (userPassword !== passWord2) {
            toast.error('Passwords do not match!')
        } else {
            const updatedUserData = {
                userName,
                userPassword,
                userType,
            }

            let userID = row._id
           const payload = {
                userID,
                updatedUserData,
            }

            dispatch(updateUser(payload))
        }
    }

    return (
        <div className='updateuser-container' onClick={(e) => { if (e.target.className === 'updateuser-container') closeUpdateUser() }}>
            <div className='updateuserform'>
                <span>UPDATE USER</span>
                <form onSubmit={handleUpdate}>
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
                    <button className='btn-user-submit' type="submit">Update</button>
                </form>
            </div>
        </div>
    )
}

export default Updateuser