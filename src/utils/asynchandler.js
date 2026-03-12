const asyncHandler = (requestHandler) => {
   return (req , res , next) => {
        Promise.resolve(requestHandler(req , res , next))
        .catch((err) => next(err))
    }
}



export {asyncHandler}





/* another approach using try catch
const asynchandler = (fn) => async (req , res , next) => {  // iska mtlb ek fn leke usko ek aur fn mein pass kar rahein hain , higher order function bolte hain isko.
    try{
        await fn(req , res , next)

    } catch(error){
        res.status(error.code || 5000).json({
            success : false , 
            message : error.message
        })
    }
}

export {asynchandler}
    */