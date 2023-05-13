import '../css/dashboard.css'
import BasicTable from '../components/tableproduct'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Addproduct from '../components/addproduct';

function Products(){
  const navigate = useNavigate()
  const {user} = useSelector((state) => state.auth)
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)




  useEffect(() => {
    if (!user) {
      navigate('/login')
    }

  }, [user, navigate])

  
    return(
        <div className='productpage'>
          <button onClick={() => setIsAddProductOpen(true)}>Add Product</button>
          {isAddProductOpen && <Addproduct closeAddProduct = { () => {
            setIsAddProductOpen(false)
          } }/>}
          {user ?  
           <BasicTable/>
           :
           navigate('/login')
          }
        </div>
    )
}

export default Products