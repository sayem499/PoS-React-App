import '../css/salesettings.css'
import { useState } from 'react'
import { setSaleSettings } from '../redux/sale/saleSlice' 
import { useDispatch } from 'react-redux'
import { Switch } from 'antd'


function Salesettings({ closeSaleSettings }) {
const fetch = JSON.parse(localStorage.getItem('sale-settings'))
const dispatch = useDispatch()
const [saleVAT, setSaleVAT] = useState(fetch ? fetch.saleVAT : 0)
const [saleDiscount, setSaleDiscount] = useState(fetch ? fetch.saleDiscount : 0)
const [saleLessAdjustmentToggle, setSaleLessAdjustmentToggle] = useState(fetch ? fetch.saleLessAdjustmentToggle : false)

const toggler = () => {
  saleLessAdjustmentToggle ? setSaleLessAdjustmentToggle(false) : setSaleLessAdjustmentToggle(true)
}


const handleSubmit = (e) => {
    e.preventDefault()
    const payload ={
        saleVAT,
        saleDiscount,
        saleLessAdjustmentToggle,
    }
    dispatch(setSaleSettings(payload))
}

  return (
    <div className="container" onClick={(e) => { if(e.target.className === 'container')  closeSaleSettings()}}>
     <div className="settings-form">
        <span>SALE SETTINGS</span>
        <form onSubmit={(e) => {handleSubmit(e)}}>
          <label htmlFor='saleVAT'>VAT(%)</label>
          <input value={saleVAT} onChange={e => setSaleVAT(e.target.value)} placeholder='VAT(%)' type='number' name='saleVAT'/>
          <label htmlFor='saleDiscount'>Discount (%)</label>
          <input value={saleDiscount} onChange={e => setSaleDiscount(e.target.value)} placeholder='Discount(%)' type='number' name='saleDiscount'/>
          <label htmlFor='saleLessAdjustmentToggle'>Less Adjustment</label>
          <Switch checked={saleLessAdjustmentToggle} className='LA-toggle-switch' name='saleLessAdjustmentToggle' onClick={toggler}/>
          <button type='submit' className='btn'>Submit</button>
        </form>

        </div>
    </div>
  )
}

export default Salesettings