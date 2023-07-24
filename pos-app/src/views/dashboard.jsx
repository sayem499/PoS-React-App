import { useEffect } from 'react'
import '../css/dashboard.css'
import { getSales, resetSale } from '../redux/sale/saleSlice'
import { useSelector, useDispatch } from 'react-redux'


function Dashboard(){
const {sales} = useSelector((state) => state.sale)
const dispatch = useDispatch()
  useEffect(()=>{

    if(sales){
      dispatch(getSales())
    }

    return () =>{
      dispatch(resetSale())
    } 
  },[dispatch])
    return(
        <div className='dashboard-container'>
          <div className='top-display-container'>
            <section className='display-total-sale'>
              <span className='display-text'>Total Sale</span>
            </section>

            <section className='display-avarage-sale'>
              <span className='display-text'>Average Sale</span>
            </section>

            <section className='display-gross-profit'>
            <span className='display-text'>Gross Profit</span>
            </section>

            <section className='display-gross-margin'>
            <span className='display-text'>Gross Margin</span>
            </section>
          </div>
        </div>
    )
}

export default Dashboard