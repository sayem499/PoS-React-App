import { useEffect, useState } from "react"
import '../css/addsupplierproduct.css'
import { updateSupplier, resetSuppliers, getSupplier } from '../redux/supplier/supplierSlice'
import { useDispatch, useSelector } from "react-redux"
import { toast } from 'react-toastify'
import { useNavigate } from "react-router-dom"

function AddSupplierProduct({id,closeAddSupplierProduct}) {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { suppliers,isSupplierSuccess, isSupplierError, message } = useSelector((state) => state.supplierState)
    const { user } = useSelector((state) => state.auth)
    const [productTitle, setProductTitle] = useState('')
    const [productBrand, setProductBrand] = useState('')
    const [productQuantity, setProductQuantity] = useState('')
    const [productType, setProductType] = useState('')
    const [productUnitPrice, setProductUnitPrice] = useState('')
    const [productBarcode, setProductBarcode ] = useState('')

    useEffect(() => {

        if (!user) {
            navigate('/login')
        }
        if (isSupplierError) {
            toast.error(message)
        }

        return () => {
            dispatch(resetSuppliers())
            dispatch(getSupplier())
        }


    }, [user, isSupplierError, message, navigate, dispatch])

    const handleSubmit = (e) => {
        e.preventDefault()
        const updatedProduct = {
            productTitle,
            productBrand,
            productQuantity,
            productType,
            productUnitPrice,
            productBarcode
        }

        suppliers.filter((supplier) => supplier._id === id).forEach(element => {
            let supplierName = element.supplierName, 
            supplierPhoneNumber = element.supplierPhoneNumber, 
            supplierAddress = element.supplierAddress, 
            supplierEmail = element.supplierEmail

            let supplierProducts = [...element.supplierProducts] 
            supplierProducts.splice(element.supplierProducts.length, 0, updatedProduct)

        const updatedSupplierData = {
            supplierProducts,
            supplierName,
            supplierPhoneNumber,
            supplierAddress,
            supplierEmail,
        }

        let supplierID = id
        const payload = {
            supplierID,
            updatedSupplierData,
        }

        dispatch(updateSupplier(payload))

        if (isSupplierSuccess) {
            toast.success('Supplier created successfully!')
        }

        });

        
        
    }

  return (
    <div className="add-supplier-product-container" onClick={(e) => { if (e.target.className === "add-supplier-product-container") closeAddSupplierProduct() }}>
            <div className='add-supplier-product-form'>
                <span>ADD PRODUCT</span>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <label htmlFor='Product Name'>Product Name</label>
                    <input value={productTitle} onChange={e => setProductTitle(e.target.value)} placeholder='Product Name' type='text' name='productTitle' />
                    <label htmlFor='Product Brand'>Product Brand</label>
                    <input value={productBrand} onChange={e => setProductBrand(e.target.value)} placeholder='Product Brand' type='text' name='productBrand' />
                    <label htmlFor='Quantity'>Quantity</label>
                    <input value={productQuantity} onChange={e => setProductQuantity(parseInt(e.target.value))} placeholder='Quantity' type='number' name='productQuantity' />
                    <label htmlFor='Category'>Category</label>
                    <input value={productType} onChange={e => setProductType(e.target.value)} placeholder='Category' type='text' name='productType' />
                    <label htmlFor='Unit Price'>Unit Price (Tk.)</label>
                    <input value={productUnitPrice} onChange={e => setProductUnitPrice(parseInt(e.target.value))} placeholder='Product Unit Price' type='number' name='productUnitPrice' />
                    <label htmlFor='productBarcode'>Product Barcode</label>
                    <input value={productBarcode} readonly placeholder='Product Barcode' type='text' name='productBarcode'/>
                    <button type='submit' className='btn-add-supplier-product-submit'>Submit</button>
                </form>
            </div>

        </div>
  )
}

export default AddSupplierProduct