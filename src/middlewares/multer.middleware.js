import multer from "multer"; // Import multer, a middleware for handling multipart/form-data (file uploads)

// Configure storage settings for multer
const storage = multer.diskStorage({
    // Define where the uploaded files should be stored
    destination: function (req, file, cb) { // cb = callback function
        cb(null, './public/temp'); // Store uploaded files in the "./public/temp" folder
    },
    
    // Define how the uploaded files should be named
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Keep the original file name (not recommended for production)
    }
});

// Create an upload middleware using the defined storage settings
export const upload = multer({ 
    storage: storage // Use the configured storage engine
});
