# Connectivity with the Database
Here we will use MONGODB and use its online DB called mongoDB atlas , it is used in production mostly.  
go to Mongodb atlas (https://www.mongodb.com/products/platform/atlas-database) .  
It is a subservice by mongodb that provides online DB .  
It requires account . 

## connection 
1. Make .env and edit it , Port daal do and then DB_URI (string milega mongo atlas mein jab new project banayege woh yaha rakhna hai). NOTE that uri mein ending slash(/) nahi chahiye so delete it .
sabse uper hamesha index file mein dotenv ko import karke configure karna chahaiye taki index run hote hi globally sabke pass env ka accesss ho jaye  
to use .env : 
```
import dotenv from 'dotenv'
dotenv.config({
    path : './.env'
})
```

2. Source ke andr constants wali file mein db ka naam likh sakte hain , less sensitive so .env mein nahi rakhe , export const DB_name = 'hello' .  

3. install packages : 
```
npm i mongoose dotenv express
```

4. Now connect karne ke do tarike hain :
___
- Sabse pehle index file hi run hoti hai isliye sara code index file mein rakho , DB connection ka bhi function banao and then jab v index run ho , sabse pehle wahi function execute ho (use IIFE for that) .
___
- DB naam ke folder mein connection ka function banao usko import karo index mein and then call kara do.  {used mostly}
___

**NOTE :** 
- Connect karne wale part mein errors aa sakte hain so always use try/catch or promises .
- DB se baat karne mein time lagta hai , so use Async-Await  .
so yaad rakho -----> "DB is present in another continent" .  

# First method (IIFE)
IIFE SYNTAX : (code) (to execute) so () () do bracket hote hain isme.  
generally IIFE ke dono bracket ke pehle ek ; lagta hai taki agar pichli line of code mein agar miss hua toh code par koi dikkt mt ho .   
for actual code refer to index.js commented part . 

    issue : It pollutes the index file 

# Second approach (modular)

src/DB ke andr ek index.js file banao waha pr code likho (refer for code)
then import it(the connection function) to index.js and execute the function.  

Ho sakta hai cannot find wale error aaye uske liye pathname me jaake proper path dedo for eg : ./db/index.js .  
with extensions dene se lelega.