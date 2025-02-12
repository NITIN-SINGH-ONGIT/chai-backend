// asyncHandler is a higher-order function that wraps async route handlers
const asyncHandler = (requestHandler) => { 
    return (req, res, next) => { 
        // Execute the async function and ensure it returns a resolved Promise
        Promise.resolve(requestHandler(req, res, next)) 
            // If an error occurs, catch it and pass it to Express's error handler
            .catch((err) => next(err));
    };
};

export {asyncHandler}

// const asyncHandler = () => {}
// const asyncHandler = (func) => {() => {}}
// const asyncHandler = () => async() => {}



// by try catch
// const asyncHandler = (fn) => async(req,res,next) => {
//   try {
//     await fn(req,res,next)
//   } 
//   catch (error) {
//     res.status(error.code || 500).json({
//         success : false,
//         message : error.message
//     })
//   }
// }