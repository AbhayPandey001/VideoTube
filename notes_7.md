// Models banana start karenge , abhi ke liye sirf 2 , user and video models likehege , Data model ka link : (https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj)  
so models folder ke andar do files banani hai. user.model.js and video.model.js .  
Note that .model bas ek convention hai taki read karke hi samajh aajaye ki is file mein models hain .  

usi eraser file ke hisab se model banate jana hai.  
database mein kisi chiz ko searchable banana hai toh usko index bana dete hain . index : true likhne se woh field ke through searching fast ho jati hai.  
Id apne aap generate ho jati hai mongo mein.  
password {
    req : [true , 'sample message if value is not given']
}

Basic user and video model dono likh liye , ab users mein watch history naam ki v field hai , usko handle karne ke liye npm ka ek package hai 
. called as mongoose-aggregate-paginate-v2 (https://www.npmjs.com/package/mongoose-aggregate-paginate-v2).  
```npm i mongoose-aggregate-paginate```  
isko video model wali file mein use krege , yeh simple sa plugin ki tarh inject hoga .  
sabse top pe import karlo and export karne se pehle usko as a plugin add karte hain .   
do videoSchema.plugin(mongooseAggregatePaginate) //jis naam se import kiya h woh hai yeh

bas ye do line karne se ab ham aggregation queries likh sakte hain .  

aisa kar sakte hain  qki mongoose ke andr kafi middle ware and plugin likhe ja sakte hain schema ke sath .  

### Password encryption
also jo password ham rakhege database mein usko encrypt karna jaruri hai.    
password ka kaam user model mein hai isliye us file mein karege yeh
do package hain  bcrypt and bcryptjs. ham bcrypt use karege.It is a library to hash the passwords.  (https://www.npmjs.com/package/bcryptjs)
also ham token ke liye JWT v install karege (jwt means json web token)https://www.npmjs.com/package/jsonwebtoken
aur samjhne ke liye (https://www.jwt.io/).  

now user file me jaake jwt and bcrypt leke aao top pe.  
unko use karne ke liye ham mongoose ka pre hook use hoga . yeh hook jaise hi data save hone jata hai uske just pehle agar koi code execute karana ho toh kaam aata hai (yaha pe encryption).  
simply do : userSchema.pre('event' , 'function') --> yeh jo fn likhte hain yaha callback nahi likh skte as hamein this keyword use karna hota hai , qki this ka use karke model ke elements ko access karege and callback ke paas this ka refrence nahi hota hai so purana method use krge funtion(){} . yeh async hota hai qki isme time lagta hai.  
yaha par pre hook use kiye hain uske andr this use karte hai and usko pata rehta hai this.password karne se ki kaun sa password . usi chiz ko hook bolte hain.  
___
jab v koi data save kare har bar password hash ho hoke change na hojaye isliye if else use kiye .  har baar thodi encrypt karna hai man lo koi apna username change kiya us case mein pass ko q chhedna .
___
jaise yeh hook aur plugin daalte hain waise hi ham apne khud ke methods v bana sakte hain just do :  
userSchema.methods.nameofmethod = function () {}

___
ab JWT use karege , ek chabhi ki tarah hota hai  , bearer token , jo usko bear karke req karega usko data bhej deta hai . 
___
env varable mein access and reftoken ke 4 values likhe .
```
ACCESS_TOKEN_SECRET = dd6628cb617e7831c4ce03e16852d9a3e3d965eaa9ba0a783f554df675414d4c
ACCESS_TOKEN_EXPIRY = 1d 
REFRESH_TOKEN_SECRET = 73998142035b93ef36517312ea1c47931c02cd65a9110dedc8e23c2baec810c4
REFRESH_TOKEN_EXPIRY = 10d 
```
ref token ko db mein v store karege aur uski expiry ko jyada rkhege , access ko db mein nahi rakhege
___
uske baad userschema mein token ke liye v method banaye hain , accestoken generate karne ka method.  same for refresh. isme async ki jrrut nahi hai as woh fast hai.  code same hi h dono ka bas usage mein difference hai dono ki .  
