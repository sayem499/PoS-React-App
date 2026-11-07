require("dotenv").config({
  path: require("path").resolve(__dirname, ".env"),
});
const path = require("path");
const express = require("express");
const cors = require("cors");
const { errorHandler } = require("./middleware/errorMiddleware.js");
const connectDB = require("./config/db.js");
const fs = require("fs");
const { uploadDirectory } = require("./config/uploadStorage");

const imageCategories = ["logos", "profiles", "products", "paymentTypes"];

const app = express();
const port = process.env.SERVER_PORT || 5000;

// Create upload directories
imageCategories.forEach((category) => {
  fs.mkdirSync(path.join(uploadDirectory, category), {
    recursive: true,
  });
});

connectDB();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API routes
app.use("/api/sales", require("./routes/sale.routes"));
app.use("/api/purchases", require("./routes/purchase.routes"));
app.use("/api/products", require("./routes/product.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/customers", require("./routes/customer.routes"));
app.use("/api/suppliers", require("./routes/supplier.routes"));
app.use("/api/accounts", require("./routes/account.routes"));
app.use("/api/paymenttypes", require("./routes/paymenttype.routes"));
app.use("/api/paymentaccounts", require("./routes/paymentaccount.routes"));
app.use("/api/uploads", require("./routes/image.routes"));
app.use("/api/search", require("./routes/search.routes"));

// Serve uploaded images
app.use(
  "/uploads",
  express.static(uploadDirectory, {
    fallthrough: false,
    index: false,
  }),
);

if (process.env.NODE_ENV === "production") {
  const rootDirectory = path.resolve();

  app.use(express.static(path.join(process.cwd(), "public")));
  app.use(express.static(path.join(rootDirectory, "build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(rootDirectory, "build", "index.html")),
  );
} else {
  app.get("/", (req, res) => res.send("Server is ready."));
}

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
