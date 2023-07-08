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
     if(!req.body.products &&  
    !req.body.saleSubTotal &&
    !req.body.saleVAT &&
    !req.body.saleDiscount &&
    !req.body.saleTotal &&
    !req.body.salePayType &&
    !req.body.salePayByCard &&
    !req.body.salePayByCash && 
    !req.body.saleTime &&
    !req.body.saleServedBy &&
    !req.body.saleLessAdjustment){
        res.status(400)
        throw new Error('Product field error!')
    }
    console.log(req.body)
    const sale = await Sales.create({
    products: req.body.products,
    saleSubTotal: req.body.saleSubTotal, 
    saleVAT: req.body.saleVAT,
    saleDiscount: req.body.saleDiscount, 
    saleTotal: req.body.saleTotal,
    salePayType: req.body.salePayType,
    salePayByCard: req.body.salePayByCard,
    salePayByCash: req.body.salePayByCash,
    saleTime: req.body.saleTime,
    saleDate: req.body.saleDate,
    saleServedBy: req.body.saleServedBy,
    saleLessAdjustment: req.body.saleLessAdjustment,
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