const asyncHandler = require('express-async-handler')
const Suppliers = require('../model/supplier.model')


//@desc SET suppliers
//@route POST/api/suppliers
//@access Private
const setSupplier = asyncHandler( async(req,res) => {
    if(!req.body.supplierProducts &&
        !req.body.supplierName ){
            res.status(400)
            throw new Error('Supplier field error!')
        }
      const supplier = await Suppliers.create({
        supplierProducts: req.body.supplierProducts,
        supplierName: req.body.supplierName,
        supplierPhoneNumber: req.body.supplierPhoneNumber,
        supplierAddress: req.body.supplierAddress,
        supplierEmail: req.body.supplierEmail
      })
      
      res.status(200).json(supplier)
})

//@desc GET suppliers
//@route GET/api/suppliers
//@access Private
const getSuppliers = asyncHandler( async (req, res) => {
    const supplier = await Suppliers.find()
    res.status(200).json(supplier)
})

//@desc Update supplier
//@route PUT/api/suppliers/:id
//@access Private
const updateSupplier = asyncHandler( async (req, res) => {
    const supplier = Suppliers.findById(req.params.id)

    if(!supplier){
        res.status(400)
        throw new Error('Supplier not found!')
    }

    const updatedSupplier = await Suppliers.findByIdAndUpdate(req.params.id, req.body, {new: true})
    res.status(200).json(updatedSupplier)
})

//@desc Delete supplier
//@route DELETE/api/suppliers/:id
//@access Private
const deleteSupplier = asyncHandler (async (req, res) => {
    const supplier = Suppliers.findById(req.params.id)

    if(!supplier){
        res.status(400)
        throw new Error('Supplier not found!')
    }

    await supplier.deleteOne()
    res.status(200).jason({message:`Deleted supplier ${req.params.id}`})
}) 



module.exports = {
    setSupplier,
    getSuppliers,
    updateSupplier,
    deleteSupplier
}