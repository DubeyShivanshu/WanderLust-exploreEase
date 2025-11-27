//58(I). Require 'cloudinary' & 'multer-storage-cloudinary' package(firstly, 'npm i cloudinary multer-storage-cloudinary')
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

//configuring(joining) cloudinary with backend (Connect App → Cloudinary)
cloudinary.config({
    //join .env stored cloud codes with process.env & store in their respective vars.
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

//Create Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV',    //: 'some-folder-name'
    allowedFormats: ["png", "jpg", "jpeg"], // supports promises as well
  },
});

//export the two modules- cloudinary & storage to use in 'routes/listing.js'
module.exports = { cloudinary, storage };