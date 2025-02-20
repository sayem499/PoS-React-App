const mongoose = require("mongoose");
const Product = require("../models/product.model");
const User = require("../models/user.model");
const Sale = require("../models/sale.model");
const Customer = require("../models/customer.model");
const Supplier = require("../models/supplier.model");

const mongoURI = "mongodb://localhost:27017/yourDatabase"; // Change this to your actual DB URI

async function migrate() {
  try {
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

    console.log("Connected to MongoDB");

    // Force collection creation by inserting then deleting a dummy document
    await Product.create({}).then((doc) => Product.deleteOne({ _id: doc._id }));
    await User.create({}).then((doc) => User.deleteOne({ _id: doc._id }));
    await Sale.create({}).then((doc) => Sale.deleteOne({ _id: doc._id }));
    await Customer.create({}).then((doc) => Customer.deleteOne({ _id: doc._id }));
    await Supplier.create({}).then((doc) => Supplier.deleteOne({ _id: doc._id }));


    console.log("Collections created successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("Migration failed:", error);
    mongoose.connection.close();
  }
}

// Run Migration
migrate();