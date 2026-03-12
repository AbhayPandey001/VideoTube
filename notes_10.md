# Controllers
Actual logic building wali chiz.....    
Register ka controller likhege is wale mein.    

controllers/user.controller.js bana liye  
us file mein user se related controllers likhege .  
asyncHelper hamne banaya tha , ek wrapper fn ki tarah , wo toh lagega hi. {import karliye}  
now uske andr code likhege ek method bana ke (abhi registerUser naam ka) and usko export karna hai. sample k liye kch code likhe..(actual controller aage likhege)  

## routes
method toh bana diya uper , ab ye method run kab hoga ? kisi na kisi url pe hi toh , us url ko (sare routes ke liye) separate folder bana hai routes naam ka.
routes/user.routes.js jitne v user ke routes honge woh yaha rakhege
basic routing template (routes will be added): 
``` 
import {Router} from "express"

const router = Router()


export default router
```
now route toh bana liye chalo and method v bana liye controller ka , ye sab import kaha hoga ?      
index file ko pollute nahi karte hain , app file mein hi karte hain.   

route file mein controllers ka import karte hain and usko wahi use krte hain then us route file ko app file mein import karte hain.  
app.js mein jo middleware ke configurations kiye the uske just niche is route ko import karte hain and wahin pe routing declare bhi karte hain . i.e : app file mein aisa kch syntax banta hai: 
```
// routes import
import userRouter from "./routes/user.routes.js"

// routes declaration 
app.use("/users" , userRouter)
```
declare ke time app.use karte hain qki middleware ki tarah import kiye hain . syntax mein app.get ke baad pehle route set karte hain and then uske baad comma laga ke likhte hain ki agar is url pe aaye toh aage ka kaam is wali router file se samjh lena .   
```example : ``` is example mein likha hua hai ki agar /users karke koi v endpoint milta hai toh userRouter wali file mein uske aage ki kahani hai, woh control us file ko pass kr deta hai , waha par controller ka naam hai woh leke us hisaab se run kardo.

## router file mein controller kaise daalte hain
pehle toh import krlo and then simply :
```
router.route("/register").post(registerUser)

```

## matlab hua kya ?
jab v koi request user pe jaayegi woh sidha router file me jaake dekhega ki user ke aage kaun sa endpoint hai . for eg register naam ka end pt hamne banaya tha toh jab overall url : localhost:____/users/register hoga tab register user naam ka controller activate hojayega.    
standard practice mein direct /users nahi likhte    
/api/v1/users is type likhte hain (v1 means version 1) .  

## SUMMARY(with flow):
jab v url hit hoga : http://localhost:8000/users/registers toh sabse pehle app file ke paas jayega jahaan app.use mein bataya gaya hai ki router file me jao toh fir woh route file mein jayega jahan /register ke ke liye kya call karna hai woh likha hai.    

postman ka use kar sakte hain for api testing / ya fir thunderclient v use kar sakte hain.