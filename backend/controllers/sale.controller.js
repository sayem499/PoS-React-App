const asyncHandler = require('express-async-handler')
const Sales = require('../model/sale.model')
const Accounts = require('../model/account.model')

//@desc GET sales
//@route GET/api/sales
//@access Private
const getSales = asyncHandler( async (req, res) => {
  const sales = await Sales.find()
  res.status(200).json(sales)
})


//@desc POST sales
//@route POST/api/sales
//@access Private
const setSales = asyncHandler( async (req, res) => {
  if (!req.body.products &&
    !req.body.saleSubTotal &&
    !req.body.saleVAT &&
    !req.body.saleDiscount &&
    !req.body.saleTotal &&
    !req.body.saleTotalCost &&
    !req.body.salePayType &&
    !req.body.salePayByCard &&
    !req.body.salePayByCash &&
    !req.body.saleTime &&
    !req.body.saleServedBy &&
    !req.body.saleLessAdjustment &&
    !req.body.saleVATAmount &&
    !req.body.saleDiscountAmount) {
    res.status(400)
    throw new Error('Sale field error!')
  }

  const userIdV = req.users._id;
  const invoiceId = generateInvoiceId();

  try {
    const sale = await Sales.create({
      products: req.body.products,
      userId: userIdV,
      invoiceId: invoiceId,
      saleSubTotal: req.body.saleSubTotal,
      saleVAT: req.body.saleVAT,
      saleDiscount: req.body.saleDiscount,
      saleTotal: req.body.saleTotal,
      saleTotalCost: req.body.saleTotalCost,
      salePayType: req.body.salePayType,
      salePayByCard: req.body.salePayByCard,
      salePayByCash: req.body.salePayByCash,
      saleTime: req.body.saleTime,
      saleDate: req.body.saleDate,
      saleServedBy: req.body.saleServedBy,
      saleLessAdjustment: req.body.saleLessAdjustment,
      saleVATAmount: req.body.saleVATAmount,
      saleDiscountAmount: req.body.saleDiscountAmount,
      saleCustomerName: req.body.saleCustomerName,
      saleCustomerPhoneNumber: req.body.saleCustomerPhoneNumber,
      saleCashPaid: req.body.saleCashPaid,
      saleChange: req.body.saleChange,
    });

    // Then create Account records
    const multiPayment = req.body.multiPayment || [];

    const accountEntries = multiPayment.map(payment => ({
      userId: userIdV,
      invoice: invoiceId,
      sales_id: sale._id,
      account_type: 'credit',
      transaction_id: null, // Or generate if needed
      payment_type_id: payment.payment_type_id,
      payment_account_id: payment.accountId,
      payment_amount: payment.amount,
    }));

    await Accounts.insertMany(accountEntries);

    res.status(200).json(sale)
  } catch (error) {
    res.status(200).json(error)
  }
})


//@desc Upadate sales
//@route PUT/api/sales/:id
//@access Private
const updateSales = asyncHandler(async (req, res) => {
  const sale = Sales.findById(req.params.id)

  if (!sale) {
    res.status(400)
    throw new Error('Sale not found!')
  }

  const updatedSale = await Sales.findByIdAndUpdate(req.params.id, req.body, { new: true, })
  res.status(200).json(updatedSale)
})

//@desc Delete sales
//@route DELETE/api/sales/:id
//@access Private
const deleteSale = asyncHandler(async (req, res) => {
  const sale = Sales.findById(req.params.id)

  if (!sale) {
    res.status(400)
    throw new Error('Sale not found!')
  }

  await sale.deleteOne()

  res.status(200).json({ message: `Deleted Sale ${req.params.id}` })
})

//@desc Generates invoices
//@route no route
//@access no access
const generateInvoiceId = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const randomNumber = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
  return `SALE${year}${month}${day}${randomNumber}`;
};

module.exports = {
  getSales,
  setSales,
  updateSales,
  deleteSale
}