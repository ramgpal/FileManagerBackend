// Importing necessary modules
const express = require("express");
const app = express();


// Loading environment variables
require("dotenv").config();
const PORT = process.env.PORT || 4000;

// Middleware setup
app.use(express.json());
const fileupload = require("express-fileupload");
app.use(fileupload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

// Connecting with the database
const db = require("./config/database");
db.connect();

// Connecting with Cloudinary
const cloudinary = require("./config/cloudinary");
cloudinary.cloudinaryConnect();

// Creating API routes
const Upload = require("./routes/FileUpload");

// Mounting the routes
app.use("/api/v1/upload", Upload);

// Establishing the server connection
app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`);
});
