
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
      const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
      console.log(`\n MONGODB connected !! DB HOST : ${connectionInstance.connection.host}`) // connectionInstance.connection.host retrieves the host (server address) of the database connection and displays it.
    } 
    catch (error) {
        console.log("DATABASE_CONNECTION_ERROR" , error);
        process.exit(1) // Node.js method that immediately terminates the current process (i.e., stops the running application).
    }
}

export default connectDB

