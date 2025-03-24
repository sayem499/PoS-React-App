 const asyncHandler = require('express-async-handler')
 const Products = require('../model/product.model.js')
 
//@desc Get paginated products
//@route GET /api/products
//@access Private
const getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const total = await Products.countDocuments();
  const products = await Products.find().skip(skip).limit(limit);

  res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      products,
  });
});

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
      productImageUrl: req.body.productImageUrl,
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

//@desc get product by id
//@route GET/api/products/:id
//@access Private 
const getProductById = asyncHandler( async (req, res) => {
  const product = Products.findById(req.params.id)
  if(!product){
    res.status(400)
    throw new Error('Product not found!')
  }
  res.status(200).json(product)
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
    getProductById,
    deleteProduct
 }