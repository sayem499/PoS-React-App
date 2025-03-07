const asyncHandler = require('express-async-handler')
const Purchases = require('../model/purchase.model.js')
const Products = require('../model/product.model.js')


//@desc Get purchase
//@route GET/api/purchase
//@access Private
const getPurchase = asyncHandler(async (req, res) => {
    const userIdV = req.users._id; // Extract user ID from request
  
    const purchase = await Purchases.find({ userId: userIdV }); // Filter by userId
  
    res.status(200).json(purchase);
});

//@desc Set Purchase
//@route POST/api/purchase
//@access Private
const setPurchase = asyncHandler( async (req, res) => {
    if(!req.body.productId && 
      !req.body.productQuantity && 
      !req.body.productSupplierId && 
      !req.body.productTotalCost &&
      !req.body.productUnitCost ){
      
        res.status(400)
        throw new Error('Product field error!') 
    }

    const invoiceId = generateInvoiceId();

    const purchase = await Purchases.create({
        productId: req.body.productId,
        invoiceId: invoiceId,
        userId: req.users._id, // Assuming the user is authenticated and `req.users` contains user info
        productSupplierId: req.body.productSupplierId,
        productQuantity: req.body.productQuantity,
        productQuantitySold: 0,
        productUnitCost: req.body.productUnitCost,
        productTotalCost: req.body.productTotalCost,
        purchaseVat: req.body.purchaseVat || 0,
        purchaseVatAmount: req.body.purchaseVatAmount || 0,
        purchaseDiscount: req.body.purchaseDiscount || 0,
    });

    // Find the product and update its quantity & latest cost
    const product = await Products.findById(req.body.productId);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    
    // Update the product's quantity and latest purchase price
    product.productQuantity += req.body.productQuantity;
    if(product.productQuantity === 0){
      product.productCurrentPurcahseId =  purchase?._id;
    }
    await product.save(); // Save the updated product
    
    res.status(200).json(purchase);
})

//@desc Upadate purchase
//@route PUT/api/purchase/:id
//@access Private
const updatePurchase = asyncHandler(async (req, res) => {
    const purchase = await Purchases.findById(req.params.id);
  
    if (!purchase) {
      res.status(400);
      throw new Error("Purchase not found!");
    }
  
    const updatedPurchase = await Purchases.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Returns the updated document
    });
  
    res.status(200).json(updatedPurchase);
});

//@desc Delete purchase
//@route DELETE/api/purchase/:id
//@access Private
const deletePurchase = asyncHandler(async (req, res) => {
    const purchase = await Purchases.findById(req.params.id);
  
    if (!purchase) {
      res.status(400);
      throw new Error("Purchase not found!");
    }
  
    await purchase.deleteOne();
  
    res.status(200).json({ message: `Deleted Purchase ${req.params.id}` });
});

const generateInvoiceId = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const randomNumber = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
    return `PURCHASE${year}${month}${day}${randomNumber}`;
};

module.exports = {getPurchase, setPurchase, updatePurchase, deletePurchase}