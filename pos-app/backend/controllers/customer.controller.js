const asyncHandler = require('express-async-handler')
const Customers = require('../model/customer.model')


//@dec Get customers
//@route GET/api/customers
//@access Private
const getCustomers = asyncHandler( async (req, res) => {
    const customers = await Customers.find()
    res.status(200).json(customers)
})


//@dec Set customers
//@route POST/api/customers
//@access Private
const setCustomers = asyncHandler( async (req, res) => { 
    if(!req.body.customerName && 
        !req.body.customerPhoneNumber && 
        !req.body.customerTotalExpenditure && 
        !req.body.customerTotalTrades){

            res.status(400)
            throw new Error('Customer field error!')
        }
    const customer = await Customers.create({
        customerName: req.body.customerName,
        customerPhoneNumber: req.body.customerPhoneNumber,
        customerTotalExpenditure: req.body.customerTotalExpenditure,
        customerTotalTrades: req.body.customerTotalTrades
    })
    res.status(200).json(customer)    
})

//@dec Update customers
//@route PUT/api/customers/:id
//@access Private
const updateCustomer = asyncHandler( async (req, res) => {
    const customer = Customers.findById(req.params.id)

    if(!product){
        res.status(200).json(customer)
        throw new Error('Product not found!')
    }

    const updatedCustomer = await Customers.findByIdAndUpdate(req.params.id, req.body, { new: true, })
    res.status(200).json(updatedCustomer)
})

//@dec Delete customers
//@route DELETE/api/:id
//@access Private
const deleteCustomer = asyncHandler( async (req, res) => { 
    const customer = Customers.findById(req.params.id)

    if(!customer){
        res.status(400)
        throw new Error('Customer not found!')
    }

    await customer.deleteOne()

    res.status(200).json({message: `Deleteed Customer ${req.params.id}`})
})


module.exports = {
    getCustomers,
    setCustomers,
    updateCustomer,
    deleteCustomer
}