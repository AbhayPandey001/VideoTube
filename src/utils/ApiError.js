class ApiError extends Error {
    constructor(
        statusCode , 
        message = "Something went wrong", //iska mtlb message diya jayega agar nahi diya jata toh uski default value = " " karke likh diye hain.
        errors = [] ,
        stack = ""
    ){
        super(message) 
        this.statusCode = statusCode 
        this.data = null
        this.message = message
        this.success = false 
        this.errors = errors
        
        if(stack) {
            this.stack = stack
        } else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {ApiError}