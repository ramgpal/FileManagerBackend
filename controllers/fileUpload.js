const File = require("../models/File");
const cloudinary = require("cloudinary").v2;

// localFileUpload handler function
exports.localFileUpload = async (req, res) => {
    try {
        // Fetching file from request
        const file = req.files.file;
        console.log("local server me file aa gyi be ->: ", file);

        // Define the path where you want to save the file on your local server
        let path = __dirname + "/files/" + Date.now() + `.${file.name.split('.')[1]}`; // Fixed syntax to access the file extension

        // Adding path to the moce function
        console.log("Path: ", path); 

        file.mv(path, (err) => {
            if (err) {
                console.log(err);
            }
        });

        res.json({
            success: true,
            message: "Local file uploaded successfully"
        });
    } catch (error) {
        console.log("error occurs");
        console.log(error);
    }
};

// function to check requested file type exists in supported file types
function isFileTypeSupported(type, supportedTypes) {
    return supportedTypes.includes(type);
}

// function to upload media to Cloudinary
async function uploadFileToCloudinary(file, folder, quality) {
    const options = { folder };
    if(quality) {
        options.quality = quality;
    }
    options.resource_type = "auto";
    return await cloudinary.uploader.upload(file.tempFilePath, options);
}

// imageUpload handler
exports.imageUpload = async (req, res) => {
    try {
        // data fetch
        const { email, tags, name } = req.body;
        console.log(email, tags, name);

        const file = req.files.imageFile;
        console.log(file);
        // data validation
        const support = ["jpg", "jpeg", "png"];
        const fileType = file.name.split('.')[1].toLowerCase();  //to get the file extension
        
        // file format not supported
        if (!isFileTypeSupported(fileType, support)) {
            return res.status(400).json({
                success: false,
                message: "File format not supported"
            });
        }

        // requested file format supported -> uploading to cloudinary
        const response = await uploadFileToCloudinary(file, "Ram", 30); 
        console.log("Response is: ", response);

        // saving entry to the database
        const fileData = await File.create({
            name, tags, email, 
            imageUrl: response.secure_url,
        });

        return res.status(200).json({
            success: true,
            message: "File uploaded successfully",
            fileData
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// videoUpload handler
exports.videoUpload = async (req, res) => {
    try {
        // fetching data
        const { email, tags, name } = req.body;
        const file = req.files.videoFile;

        // verifying data
        const support = ["mp4", "mov"];
        const fileNameParts = file.name.split('.');
        const fileType = fileNameParts[fileNameParts.length - 1].toLowerCase(); // Get the file extension
        
        // file format not supported
        if (!isFileTypeSupported(fileType, support)) {
            return res.status(400).json({
                success: false,
                message: "File format not supported"
            });
        }

        // requested file format supported -> uploading video to Cloudinary
        const response = await uploadFileToCloudinary(file, "Ram");

        // saving entry to the DB
        const fileData = await File.create({
            name,
            tags,
            email,
            videoUrl: response.secure_url
        });

        return res.status(200).json({
            success: true,
            message: "Video uploaded successfully",
            fileData
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// uploading images with after reducing their size
exports.imageSizeReducer = async (req, res) => {
    try {
        // data fetch
        const { email, tags, name } = req.body;

        const file = req.files.imageFile;
        console.log(file);
        // data validation
        const support = ["jpg", "jpeg", "png"];
        const fileType = file.name.split('.')[1].toLowerCase();  //to get the file extension
        
        // file format not supported
        if (!isFileTypeSupported(fileType, support)) {
            return res.status(400).json({
                success: false,
                message: "File format not supported"
            });
        }

        // requested file format supported -> uploading to cloudinary
        const response = await uploadFileToCloudinary(file, "Ram", 30); 

        // saving entry to the database
        const fileData = await File.create({
            name, tags, email, 
            imageUrl: response.secure_url,
        });

        return res.status(200).json({
            success: true,
            message: "File uploaded successfully",
            fileData
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}