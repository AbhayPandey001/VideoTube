# More Controllers
## subscription model creation (from eraser file)
models/subscription.model.js        

subscriber and channel likhe , ab kuch controllers likhege      
changeCurrentPassword likhe , now ek aisa end pt banana pdega jaha pe currenUuser lena pdega , baad mein kaam aayega , and hamne req.user ka middle ware banaya tha , getCurrentUser naam ka controller banayege user controller ke andr hi .           

ek aur controller updateAccountDetails 
```Note:``` kabhi bhi file update krvani ho (avatar / coverImage etc) , toh uske liye hmesha alag controller rakhna chahiye (production approach)
is liye is controller mein text wala dekhege and file ke liye alag se banayege .        

now to 
## update files
we have to use two middlewares (multer) and (jwt wala bhi)

same code for coverImage just copy and paste        

updateUserAvatarCoverImage
