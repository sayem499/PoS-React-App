const ImageKit = require("imagekit");

console.log("ImageKit Public Key Loaded:", !!process.env.IMAGEKIT_PUBLIC_KEY);
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

module.exports = imagekit;
