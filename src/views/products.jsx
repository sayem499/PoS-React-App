import '../css/products.css'
import BasicTable from '../components/tableproduct'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { reset } from '../redux/products/productSlice'
import { useEffect, useState } from 'react';
import Addproduct from '../components/addproduct';

function Products(){
  const navigate = useNavigate()
  const {user} = useSelector((state) => state.auth)
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)



  useEffect(() => {
    if (!user) {
      localStorage.removeItem('user');
      navigate('/login')
    }

  }, [user, navigate])


   const handleButtonClick = (e) => {
    e.preventDefault() 
    setIsAddProductOpen(true)
   }

   if (!user) return null; // or return a loading spinner

   return (
     <div className='productpage'>
       <button className='add-product-btn' onClick={() => setIsAddProductOpen(true)}>
         Add Product
       </button>
 
       {isAddProductOpen && (
         <Addproduct closeAddProduct={() => setIsAddProductOpen(false)} />
       )}
 
       <BasicTable />
     </div>
   );
}

export default Products