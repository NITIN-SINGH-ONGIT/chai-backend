import dotenv from "dotenv";
import express from "express"; // Import Express
import connectDB from "./db/index.js";

dotenv.config({
    path: "/env",
});

const app = express(); // Initialize the app

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`SERVER IS RUNNING ON PORT ${process.env.PORT || 8000}`);
        });
    })
    .catch((err) => {
        console.log("DB_CONNECTION : FAILED!", err);
    });

    
// Handle app errors  if any errors occur at the application level, they'll be logged, and the   error will be thrown.
app.on("error", (error) => {
    console.log("ERROR", error);
    throw error;
});

export default app; // Export app if needed elsewhere






// import express from "express"
// const app = express()

// ;(async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//     app.on("error",(error) => {
//        console.log("ERROR" ,error);
//        throw error
//     })
//     app.listen(process.env.PORT,() => {
//         console.log(`Ap is listening on port ${process.env.PORT}`)
//     })
//   } 
//   catch (error) {
//     console.error(`ERROR : ${error}`)
//     throw err
//   }
// })()