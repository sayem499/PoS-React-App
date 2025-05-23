import { useEffect } from 'react'
import '../css/dashboard.css'
import { getSales, resetSale } from '../redux/sale/saleSlice'
import { useSelector, useDispatch } from 'react-redux'
import { calculateTotalSale, calculateAverageSale, calculateGrossProfit, calculateGrossMargin } from '../redux/sale/saleSlice'
import { useNavigate } from 'react-router-dom'
import { logout, reset } from '../auth/authSlice.js'


function Dashboard(){
const {user} = useSelector(state => state.auth)   
const {sales, totalSale, averageSale, grossProfit, grossMargin, isFetchSaleSuccess, message} = useSelector((state) => state.sale)
const dispatch = useDispatch()
const navigate = useNavigate()
  useEffect(()=>{

    if(!user){
      navigate('/login')
    }

    if(sales.length === 0){
      dispatch(getSales())
      .unwrap()
      .then((res) => {
      })
      .catch((error) => {
        console.error("Error fetching sales:", error);
          localStorage.removeItem('users');
          dispatch(logout())
          navigate('/login');
      });
    }

    if(isFetchSaleSuccess){
      dispatch(calculateTotalSale())
      dispatch(calculateAverageSale())
      dispatch(calculateGrossProfit())
      dispatch(calculateGrossMargin())

    }
    

   
  },[isFetchSaleSuccess])

  

    return(
        <div className='dashboard-container'>
          <div className='top-display-container'>
            <section className='display-total-sale'>
              <span className='display-value'>৳&nbsp; {totalSale}</span>
              <span className='display-text'>Total Sale</span>
            </section>

            <section className='display-avarage-sale'>
              <span className='display-value'>৳&nbsp;{averageSale.toFixed(2)}</span>
              <span className='display-text'>Average Sale</span>
            </section>

            <section className='display-gross-profit'>
             <span className='display-value'>৳&nbsp;{grossProfit}</span>
             <span className='display-text'>Gross Profit</span>
            </section>

            <section className='display-gross-margin'>
             <span className='display-value'>{grossMargin.toFixed(2)}&nbsp;%</span>  
             <span className='display-text'>Gross Margin</span>
            </section>
          </div>
        </div>
    )
}

export default Dashboard