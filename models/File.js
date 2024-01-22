const mongoose = require("mongoose");
const nodemailer = require('nodemailer');
require("dotenv").config();

const fileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
      
    },
    videoUrl: {
        type: String,
      
    },
    tags: {
        type: String,
        
    },
    email: {
        type: String,
        
    }
});

// creating post middleware
fileSchema.post("save", async function (doc) {
    try {
        // defining transporter
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 465,  
            secure: true,  
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD,
            },
        });

        let info = await transporter.sendMail({
            from: 'Ram',
            to: doc.email,
            subject: 'Test Email',
            html: `<h2>File successfully uploaded on Cloudinary</h2> <p>View Here: </p> <a href="${doc.imageUrl}">${doc.imageUrl}</a>`
        });
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error(error);
    }
});


module.exports = mongoose.model("File", fileSchema);
