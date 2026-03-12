# Register Controller
## Steps involved in registering user : 
1. Get user details from frontend. uske liye actual frontend likhne ki jrurt nahi hai. Postman ka use karke bhi send kar sakte hain.      
___
2. Validation lagana pdega (all possible validations) {abhi ke liye ye check karna h ki fields empty to nahi hai}.  
___
3. Check if user already exits (via username or email) .    
___
4. Check for images , check for avatar (as it was compulsary field) . 
___
5. Agar succesfully avatar aa gaya fir clodinary pe daalna hai. waha se ek response milega usse url mil jayega (cloudinary wale fn mein response return kiya tha).Upload hone ke baad cloudinary par v check karna hai ki aaya ki nahi . Ho sakta hai multer se nahi aaya ya agar aaya toh cloudinary tak nahi phuch paya , woh check karna pdta hai isliye aise .  
___
6. Create user object as nosql Databases hain , (aise hi jaati hai entry) Create entry in DB.   
___
7. Jo v entry hoti hai mongo db uska response as it is bhej deta hai user ko , ham nahi chahte password and refresh token v jaaye usme , so usko response se hatana pdega as ye frontend me v jayega .  
___
8. Check for user creation , response aaya ya nahi .    
___
9. Agar aagaya response toh return kardo response ko .
___

# coding 
```SARA kaam ek method ke andr hua hai , registerUser```
## Taking Data
Form ya url se aaya hua data req.body se mil jata hai simply . jo v data aa raha usko destructure kar liye.
console.log v karke dekhe using postman. 

## File handlling
Multer ka middleware banaya tha hamne , usko routes mein import karke wahin use karenge ,   
router.route wale fn mein .post ke baad abhi direct controller method ka naam likhe the but uske just pehle multer ka middleware daalege .  
Upload.fields kiye as fields multiple data leta hai in form of objects , ek file ke liye upload.single v kar sakte hain. 

## Validation
Ye check karna hai ki all fields should not be empty , and if they are we have to display an error , error ke liye bhi utility banayi hai ek class apierror jo ki error ko structure deta hai.  
Ya toh if statements use kro kai baar .     
Ya sari fields ko ek sath check kar sakte hain using some method of array in javascript.       
Ye method kisi array ki sari values pe check karta hai and at the end boolean(true / false ) batata hai.    
so agar field khali hai ye bata dega and ham apna field cannot empty error dikha dege . 

## Check if user already exists 
    DB se baat karne ke liye User lagega hi (from User schema of user.model.js created using mongoose.model) .
so import karlo User from user model and then us User pe mongoose ka find one method use karo.  
$ karke ham operator laga sakte hain $or se or operator laga rahein hain taki username and email mein or kar sakein .       
($) lagao operator likho , : lagao , then ek [array] banao aur uske andr jitni chahe values likho jo check karni hai.     
ye method username ya email se match karta hua first document de dega (agar diya mtlb exist kar raha koi user pehle se) and ham error dikha sakte hain user already exists.     

## Image handling
req.body se data aa raha tha , hamne multer ka ek middle ware banaya , ye us reqest ke andr aur fields add kar dega , one of that is req.files .    
    mostly middlewares yahi krte hain , extra fields de dete hain . 
req.body(express se milta hai)  and req.files (multer se)       

## Uploading them to cloudinary
Iske liye hamne direct ek method banaya tha inside the file cloudinary.js , simply import and use , it just takes localfilepath as a parameter .    

## Enter to DB
db se baat karne ke liye User toh lagega hi , entry karne se liye user.create method use hoga.ye method ek object leta hai.     

## Check create hua ya nahi
findbyid method use karege and chain it to select method jo include ya exclude karne ke kaam aati hai.      
## Finally return the response

## Await kahan use karte hain
jab v DB se baat karna ho , yaha par User (for eg) , tab await lagega hi qki db dusre continent mein rehta hai.     


## haan maine console.log kiya ,
- ```cloudinary``` pe jab bhi kuch upload karte hain using 
```
const response = await cloudinary.uploader.upload(localFilePath , {resource_type: "auto"})
```
toh yeh response kch aisa dikhta hai
```
the response of uploading to cloudinary looks like this ⭐⭐⭐⭐🔽🔽 {
  asset_id: '5e2de2ad2a292ff3f465826d6db850bb',
  public_id: 'ktri9f2tbbczmfayzmus',
  version: 1770368353,
  version_id: '48df6ad10e951bdc5b0f1168fb5ceb62',
  signature: 'a49b1b6c61b635341422de86e2058090d44ca97f',
  width: 1920,
  height: 1080,
  format: 'png',
  resource_type: 'image',
  created_at: '2026-02-06T08:59:13Z',
  tags: [],
  bytes: 693159,
  type: 'upload',
  etag: 'fb26b4d20912662b56a0e0d228133591',
  placeholder: false,
  url: 'http://res.cloudinary.com/mainabhayhoon/image/upload/v1770368353/ktri9f2tbbczmfayzmus.png',
  secure_url: 'https://res.cloudinary.com/mainabhayhoon/image/upload/v1770368353/ktri9f2tbbczmfayzmus.png',
  asset_folder: '',
  display_name: 'ktri9f2tbbczmfayzmus',
  original_filename: 'Screenshot 2025-11-19 192539',
  api_key: '719417936975164'
}
``` 

- suna tha req.body se pura form and url data milta hai     
kuch aisa :
```
[Object: null prototype] {
  fullName: 'Somename',
  username: 'testingname',
  email: 'testing@someone.com',
  password: '12345678'
}
```
yeh sirf text format wala data aaya hai as image bhi upload hoti hai , woh cloudinary se kiye and uska response uper dekhe abhi     

- req.files mein jo file upload kiye uske baare mein jaankaari rehti hai , yeh raha respone ::      
```
[Object: null prototype] {
  avatar: [
    {
      fieldname: 'avatar',
      originalname: 'Screenshot 2025-11-19 192539.png',
      encoding: '7bit',
      mimetype: 'image/png',
      destination: './public/temp',
      filename: 'Screenshot 2025-11-19 192539.png',
      path: 'public\\temp\\Screenshot 2025-11-19 192539.png',
      size: 693159
    }
  ],
  coverImage: [
    {
      fieldname: 'coverImage',
      originalname: 'Screenshot 2025-12-04 011950.png',
      encoding: '7bit',
      mimetype: 'image/png',
      destination: './public/temp',
      filename: 'Screenshot 2025-12-04 011950.png',
      path: 'public\\temp\\Screenshot 2025-12-04 011950.png',
      size: 153851
    }
  ]
}
```

hamesha array return hota hai,uske andr objects hote hain, aur uska first object


## postman mein collection wagerah bnaya tha professional setup kiya tha environment setup etc .