
import { asyncHandler } from "../utils/asyncHandler.js";
const registerUser = asyncHandler(async (req,res) => {
    res.status(200).json({
        message : "successfull"
    })
})

export {registerUser}

// comments
/*
🧐 What is happening here?
registerUser is an async function wrapped with asyncHandler.
When a request comes in:
asyncHandler wraps registerUser.
If everything works fine, res.status(200).json({ message: "ok" }) is sent.
If registerUser throws an error, asyncHandler catches it and calls next(err) to forward it to the error handler.
*/