//  File uploading and Handling  
File uploading is mostly done in backend and is not for frontend.Around 90% of task is for BE .  
Express etc ke pass bhi file uploading capabilities nahi hoti .  
Also mostly file handling ham khud ke server par nahi karte .Ya toh third partly specialized services use karte hain Ya toh AWS ki help se karte hain.
___
Ek tarika yeh ho sakta hai ki ham sara code main file mein likhein par for the sake of code reusability ham usko as a utility banayege / ya middleware and then jaha v jarurat hogi usko use kar lenge .  
    **MIDDLEWARE :** Jane se pehle mujhe milke jana 🤣

Now , we will use service called Cloudinary : (account lagta hai. mera main email hai and pass Cloudinary@1).  
Also we will use a package called Multer(https://www.npmjs.com/package/multer).  
multer ki jagah par express-fileupload karke bhi ek package aata hai usko v use kar sakte hain but abhi yaha multer hi use karege.  

```
npm i cloudinary multer
```

Multer ke through file upload hogi.
Cloudinary ek service hai jo hamse file leke apne server par rakh leti hai.   
___
Production mein two step mein file upload ki jaati hai . waise hi ham v karege . (although direct v kar sakte hain.)  
Sabse pehle multer ka use karke ham file ko temporarily local storage par rakhenge and then fir waha se clodinary ke server par daal denge.   
```isse hoga kya ? :```   agar by chance file upload nahi ho paati toh reupload ke liye chance rehta hai.  

___
## Start 
utils/clodinary.js bana lo

clodinary ke docs mein dekho image section mein dev getting started tab mein node select karo ab kch code mila hoga . sensitive info ka use karke configure karna hai so usko .env mein daalna hai.  

okay so servr par file aa chuki hogi and usko hamein cloudinary par bhejna hai. once it is sent then delete it from local.  

import fs from 'fs'  ---> node js ke andr file system milta hai ye file ko read write and remove karne ke kaam aata hai . jab v file system ko manage karna hota hai uske liye ye lete hain . abhi file ka path chahiye tha isliye .   

we will use unlink method of fs to remove it once it is uploaded    
___
now to configure , .env file mein cloudinary ka cloud name api secreat and api key rakh do(3 chizein).  
yeh configuration hi actually file upload karne ki permission deti hai ki kaun sa account mein leke jana hai.      
    env file mein jab v kch edit karte hain server ko fir se restart karna padta hai. 
___
ab ek kaam karege , ek  fn bnaa lete hain , simple si local file ka path lenge aur usko upload kr dege , agar ho gaya toh unlink kar denge , try catch use karna hai as error ho sakta hai.  async await as well qki isme time lagta hai.  

cloudinary ka kaam yaha par hogya.  
___
## multer 
multer ka use karke middleware banayege. jaha v file uploading capabilities lagegi , isko lelege.   
middleware/multer.middleware.js

multer import kara lo , kaun si destination hai woh bata do.  aur fir upload wala method use karna hai .  // isse file upload hogi
file save karne ke liye aur karna pdta hai. // ham disk pe save krege uske liye multer.diskstorage wala lagega.  
___
ab set hogya hai now jab v route banayege
app.post('path' , _________    , funtion(req,res,next wala)).  
us _____ mein ham upload wala part likhte hain upload.single etc