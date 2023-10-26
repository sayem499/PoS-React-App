import '../css/supplier.css'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import AddSupplier from '../components/addsupplier'
import BasicTable from '../components/tablesupplier'
import { allProducts, setProducts } from '../redux/products/productSlice'
import { getSupplier } from '../redux/supplier/supplierSlice'


function Suppliers() {
  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false)

  const { suppliers, isSupplierSuccess, isSupplierError, message } = useSelector((state) => state.supplierState)
  const { products } = useSelector((state) => state.products)
  const dispatch = useDispatch()
  let supplierTemp = []

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
    if(suppliers){
      dispatch(getSupplier())
    }
    if (products)
      dispatch(allProducts())
  }, [user, navigate])

  if(suppliers){
      supplierTemp = [...suppliers]
  }

  const handleButtonClick = (e) => {
    e.preventDefault()
    setIsAddSupplierOpen(true)
  }

  const pushSupplierProduct = () => {
    supplierTemp.map((supplier) => {
      supplier.supplierProducts.map((product) => {
          if (products.some((item)=> 
            item.productTitle === product.productTitle 
            && item.productBrand === product.productBrand
          )) {
              return
          } else {
            let productTitle = product.productTitle
            let productBrand = product.productBrand
            let productQuantity = product.productQuantity
            let productType = product.productType
            let productUnitPrice = product.productUnitPrice
            let productBarcode = product.productBarcode
            let productSupplierID = supplier._id

            const productData = {
              productTitle,
              productBrand,
              productQuantity,
              productType,
              productUnitPrice,
              productBarcode,
              productSupplierID,
            }

            dispatch(setProducts(productData))
          }



        
      })
    })

  }

  return (
    <div className='supplier-container'>
      <div className='button-container-supplier'>
        { user.userType === 'admin' && <button className='add-supplier-btn' onClick={handleButtonClick}>Add Supplier</button>}
        { user.userType === 'admin' && <button className='push-supplier-btn' onClick={pushSupplierProduct}>Push Products</button>}
      </div>

      {
        isAddSupplierOpen && <AddSupplier closeAddSupplier={() => setIsAddSupplierOpen(false)} />
      }
      <BasicTable />
    </div>
  )
}

export default Suppliers