
const asyncHandler = (requestHandler) => { 
    return (req, res, next) => { 
        Promise.resolve(requestHandler(req, res, next)) 
            .catch((err) => next(err));
    };
};
export {asyncHandler}

// or 

// const asyncHandler = (requestHandler) => {
//     return async (req, res, next) => {  // req and res are passed to the function
//         try {
//             await requestHandler(req, res, next); // Uses req and res in try block
//         } catch (err) { // if code run successfully catch not get executed
//             next(err); // Uses next in catch block to handle errors
//         }
//     };
// };
// export { asyncHandler };



// comments
/* 
🧐 What is happening here?
asyncHandler is a higher-order function that takes another function (requestHandler) as an argument.
It returns a new function that takes req, res, and next as parameters.
The function executes requestHandler(req, res, next) inside Promise.resolve().
If requestHandler is successful ✅, everything works fine.
If an error occurs, catch((err) => next(err)) forwards the error to Express's built-in error-handling middleware.
Purpose: Prevents crashes due to unhandled errors in async route handlers.
*/













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