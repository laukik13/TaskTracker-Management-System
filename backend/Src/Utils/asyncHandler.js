const AsyncHandler = (requestHandler)=> (req,reply,next)=>{
    Promise.resolve(requestHandler(req,reply,next)).catch((error)=> next(error))
} 

export {AsyncHandler}