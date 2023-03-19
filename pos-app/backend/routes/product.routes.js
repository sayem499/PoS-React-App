const express = require('express')
const router = express.Router()


router.get('/',(req,res) => {
    res.status(200).json({message: 'Get Products'})
})

router.post('/',(req,res) => {
    res.status(200).json({message: 'Set Products'})
})

router.put('/:id',(req,res) => {
    res.status(200).json({message: `Update Product ${req.params.id}`})
})

router.delete('/:id',(req,res) => {
    res.status(200).json({message: `Delete Product ${req.params.id}`})
})



module.exports = router

