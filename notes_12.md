# Access and Refresh Tokens
Tokens toh dono same hi hain , bas difference isme hai ki expire kab ho raha hai.       
Access token  --> Short lived
Refresh token --> Long lived

## Access token 
Jab tak access token hai tab tak koi bhi feature jaha authentication ki requirement hai , usko access kar sakte hain .  
```example :``` file upload kar sakte hain jab tak login hain , jaise hi yeh login session expire hoga , wapas se password daalna padta hai  

## Refresh token
Yeh Database mein save rehta hai and user ko bhi milta hai.     
user toh access token se hi validate hota hai par har baar password nahi daalna pdta . Ek endpoint pe api hit karte hain and jo database mein refresh token hai aur jo user ko mila usko match kar lete hain.    
agar match hogya toh new access token bna dete hain .       


# Login feature
controllers mein user controllers wali file mein karna hai.     
sabse pehle ek method bana lo loginUser naam ka useko asyncHandler me daal do , login ka sara code isi method mein likhege.     
Algorithm for login :: 
- req.body se data lelo
- username ya email mil jayega , hai ki nahi check karlo
- find the user , hai ki nahi
- check password 
- access and ref token generate 
- cookie ke form mein bhejdo user ko

in step 3 find karo user ko using findOne method (sabse pehla matching document deta hai)
    User.findOne({
        $or : [{username} , {email}]
    })
db se baat karte time await lagana hota hai.    

___
password check karne ke liye userschema.method karke hamne user par ek is password correct naam ka method bana liya tha.
and User toh hamne import kar hi liya as uske zariye hi toh database se baat karte hain.        
ye sare method jo instance bana hai (user) uspe kaam karte hain na ki database (User pe).       
___

after pass checking , access and ref token banana hota hai , yeh kaam kai baar krege is liye uska ek function bana lege locally usi file mein top pe , and as woh locally hi use hoga usko wrapper fn mein bhi wrap nahi karna pdega.       
woh method user id leta hai and as user instance toh mil hi gya user._id se id v aa jayegi.     


## Logout user
- clear cookies 
- clear ref token


But ab user kaise dhundhe , pehle toh email paas lelete the , yahan kaise kre.      
```solution ```  Khud ka middleware banayege       
```krega kya``` Sirf verify krega ki user hai ki nahi hai.  

so middleware mein jao and auth.middleware.js bna lo.       
us file mein code krne ke baad ab ham route banayege (imp to export both login and logout user methods from user controller)

now flow kya hua :      
verify jwt ne token diya usse decode krke user lelo aur req.user dedo   
ab jaise hi logoutUser(empty till now) pe aaye waha pr req.user ka access mila hoga bs ab waha se uski id lelo and perform logout .     


```in short``` hamko karna tha logout , ab kis user ko logout krna hai kaise pta krein > uske liye ek middle ware likhe woh cookies ke andr se user details nikaal le raha , woh middleware routes mein jaake logoutUser ke phle laga diiye , "/logout" route mein , now req.user ka access mil gya ab logoutUser mein req.user krke usi user ka id lelo , mil gya id , ab krdo logout , uske liye token ko undefined set krna tha toh $set operator ka use kiye and set krdiye aur sath mein cookie clear karna tha clearCookie naam ka method mil jata hai(from cookie-parser) . 

# now
Refresh token ka kaam hai ki accessToken ko firse bana dena ek tym ke baad . Ab ham woh wala controller likhege jo access token ko "Refresh" krega      
so usercontroller mein ek fn , 
```
const refreshAccessToken = asyncHandler(async (req, res) => {
    //code
})          
```
now ek route bhi bana do us ka under secured route section in user routes (that end point jo hit krna h)