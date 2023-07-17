import { useEffect, useState } from "react"
import '../css/updatesupplierproduct.css'
import { updateSupplier, resetSuppliers, getSupplier } from '../redux/supplier/supplierSlice'
import { useDispatch, useSelector } from "react-redux"
import { toast } from 'react-toastify'
import { useNavigate } from "react-router-dom"



function UpdateSupplierProduct({ i, product, row, closeUpdateSupplierProduct }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { isSupplierSuccess, isSupplierError, message } = useSelector((state) => state.supplierState)
    const { user } = useSelector((state) => state.auth)
    const [supplierName, setSupplierName] = useState(row.supplierName)
    const [supplierPhoneNumber, setSupplierPhoneNumber] = useState(row.supplierPhoneNumber)
    const [supplierAddress, setSupplierAddress] = useState(row.supplierAddress)
    const [supplierEmail, setSupplierEmail] = useState(row.supplierEmail)
    const [supplierProduct, setSupplierProduct] = useState(row.supplierProducts)
    const [productTitle, setProductTitle] = useState(product.productTitle)
    const [productBrand, setProductBrand] = useState(product.productBrand)
    const [productQuantity, setProductQuantity] = useState(product.productQuantity)
    const [productType, setProductType] = useState(product.productType)
    const [productUnitPrice, setProductUnitPrice] = useState(product.productUnitPrice)

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
        }

        const supplierProducts = [...supplierProduct]
        supplierProducts.splice(i, 1, updatedProduct)

        const updatedSupplierData = {
            supplierProducts,
            supplierName,
            supplierPhoneNumber,
            supplierAddress,
            supplierEmail,
        }

        let supplierID = row._id
        const payload = {
            supplierID,
            updatedSupplierData,
        }

        dispatch(updateSupplier(payload))

        if (isSupplierSuccess) {
            toast.success('Product updated successfully!')
        }

    }

    return (
        <div className="update-supplier-product-container" onClick={(e) => { if (e.target.className === "update-supplier-product-container") closeUpdateSupplierProduct() }}>
            <div className='update-supplier-product-form'>
                <span>UPDATE PRODUCT</span>
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
                    <button type='submit' className='btn-supplier-product-submit'>Submit</button>
                </form>
            </div>

        </div>
    )
}

export default UpdateSupplierProduct