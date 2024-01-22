const express = require("express");
const router = express.Router();

// importing handallers from the controller
const {imageUpload, videoUpload, imageSizeReducer, localFileUpload} = require("../controllers/fileUpload");

//api route 

router.post("/localFileUpload", localFileUpload);
router.post("/imageUpload", imageUpload);
router.post("/videoUpload", videoUpload);
router.post("/imageSizeReducer", imageSizeReducer);

module.exports = router;