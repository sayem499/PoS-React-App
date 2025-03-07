 const asyncHandler = require('express-async-handler')
 const Products = require('../model/product.model.js')
 
 //@desc Get products
 //@route GET/api/products
 //@access Private
 const getProducts = asyncHandler( async (req, res) => {
    const products = await Products.find()
    res.status(200).json(products)
 })

//@desc Set products
//@route POST/api/products
//@access Private
const setProducts = asyncHandler( async (req, res) => {
    if(!req.body.productTitle && 
      !req.body.productQuantity && 
      !req.body.productType ){
      
        res.status(400)
        throw new Error('Product field error!') 
    }

    const product = await Products.create({
      productTitle: req.body.productTitle,
      productBrand: req.body.productBrand,
      productQuantity: req.body.productQuantity,
      productType: req.body.productType,
      productUnitPrice: req.body.productUnitPrice,
      productUnitCost: req.body.productUnitCost,
      productBarcode: req.body.productBarcode,
      productSupplierId: req.body.productSupplierId,
      productCurrentPurcahseId: null
    })
    res.status(200).json(product)
 })


//@desc Upadate products
//@route PUT/api/products/:id
//@access Private
const updateProduct = asyncHandler( async (req, res) => {
    const product = Products.findById(req.params.id)

    if(!product){
      res.status(400)
      throw new Error('Product not found!')
    }

    const updatedProduct = await Products.findByIdAndUpdate(req.params.id, req.body, {new: true,})
    res.status(200).json(updatedProduct)
 })

//@desc Delete products
//@route DELETE/api/products/:id
//@access Private
const deleteProduct = asyncHandler( async (req, res) => {
    const product = Products.findById(req.params.id)

    if(!product){
      res.status(400)
      throw new Error('Product not found!')
    }

    await product.deleteOne()

    res.status(200).json({message: `Deleted Product ${req.params.id}`})
 })

 module.exports = {
    getProducts,
    setProducts,
    updateProduct,
    deleteProduct
 }