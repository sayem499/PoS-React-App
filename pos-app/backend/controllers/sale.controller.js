const asyncHandler = require('express-async-handler') 
const Sales = require('../model/sale.model')

//@dec GET sales
//@route GET/api/sales
//@access Private
const getSales = asyncHandler( async (req, res) => {
    const sales = await Sales.find()
    res.status(200).json({sales})
})


//@dec POST sales
//@route POST/api/sales
//@access Private
const setSales = asyncHandler( async (req, res) => {
     if(!req.body.productID &&
    !req.body.productTitle && 
    !req.body.productQuantity &&
    !req.body.productUnitPrice &&
    !req.body.productTotal  &&
    !req.body.saleSubTotal &&
    !req.body.saleVAT &&
    !req.body.saleDiscount &&
    !req.body.saleTotal &&
    !req.body.salePayType &&
    !req.body.salePayByCard &&
    !req.body.salePayByCash && 
    !req.body.saleTime &&
    !req.body.saleServedBy){
        res.status(400)
        throw new Error('Product field error!')
    }

    const sale = await Sales.create({
    products: 
    [{
     _id: req.body._id, 
     productID: req.body.productID,
     productTitle: req.body.productTitle,
     productQuantity: req.body.productQuantity,
     productUnitPrice: req.body.productUnitPrice,
     productTotal: req.body.productTotal,
    }],
    saleSubTotal: req.body.saleSubTotal, 
    saleVAT: req.body.saleVAT,
    saleDiscount: req.body.saleDiscount, 
    saleTotal: req.body.saleTotal,
    salePayType: req.body.salePayType,
    salePayByCard: req.body.salePayByCard,
    salePayByCash: req.body.salePayByCash,
    saleTime: req.body.saleTime,
    saleServedBy: req.body.saleServedBy,
    }) 
    res.status(200).json(sale)
})


//@desc Upadate sales
//@route PUT/api/sales/:id
//@access Private
const updateSales = asyncHandler( async (req, res) => {
    const sale = Sales.findById(req.params.id)

    if(!sale){
      res.status(400)
      throw new Error('Product not found!')
    }

    const updatedSale = await Sales.findByIdAndUpdate(req.params.id, req.body, {new: true,})
    res.status(200).json(updatedSale)
 })

//@desc Delete sales
//@route DELETE/api/sales/:id
//@access Private
const deleteSale = asyncHandler( async (req, res) => {
    const sale = Sales.findById(req.params.id)

    if(!sale){
      res.status(400)
      throw new Error('Product not found!')
    }

    await sale.deleteOne()

    res.status(200).json({message: `Deleted Sale ${req.params.id}`})
 })

 module.exports = {
    getSales,
    setSales,
    updateSales,
    deleteSale
 }