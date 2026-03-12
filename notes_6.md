Abhi tak db connect ho chuka hai and server wala kaam nahi hua hai . ham chahte hain ki jaise hi db connect ho waise hi server v listen kare , 

    async and await are the methods that **we create** in order to handle data that is coming from API  , in that API they have already used promises So the async and await keyword already written promise which are declared in methods written by somebody else in Apis etc

ConnectDB() ek async function tha , woh v ek promise return karta hai so uske liye ham .then() use kar sakte hain

### steps

sabse pehle app.js file me express ka use karke ek app bana lena hai and usko export karna hai.  
then go to index.js file and use .then in front of connectdb function and apply the listen thing.  

**NOTE** that app banaye app.js mein hai but listen woh index mein kar raha hai.  

now we need two more packages , they are middlewares , cookie-parser and cors.  
```
npm i cookie-parser cors
```
### why cookie parser 
Kai baar jo request ham lenge , woh data cookie ke form mein lenge uske liye ye jaruri hai.
server ki taraf se user ke browser ko access and set kar sakte hain secured manner mein jo ki sirf server hi read and write kar sakta hai and CRUD operation perform kar sakta hai.

Install toh kar liye ab inko apne hisaab se configure bhi karte hain . do it in app.js file , pehle app bana lo express() ka use karke and then uske niche ye configurations karte hain.  (app banega tabhi toh app.use() likh payege)
  import karlo cors and cookie parser ko

  Dhayn rakho ki jab bhi ham middleware use karte hain ham app.use() likhte hain.

cors ki configuration karte hain , origin daal sakte hain ki frontend mein kaun sa port se lena hai , env variable ka use kiye hain yaha.  
ab jo data aayega woh json mein v ho sakta hai url mein v , ek limit toh honi chahiye ki kitna amount of data lenge us format mein (best / security practice), so dono ko configure kiye .  
further jo v file upload hogi for eg pdf or images wo ham temporarily store krege public folder mein uske liye v configuration likhni thi.  
cookie parser ko v configure kiye .  


## Middlewares
kisi url pe ham get lagate the , suppose /instagram pe jaane se ham res.send('hello') karte the , ab har koi ye data thodi lelega , bich mein ham middle ware laga sakte hain jo check karega ki kya user logged in the , kya user ka role admin tha etc. usi ko middle ware kehte hain. 
    note : actual mein 4parameters hote hain (err , req , res , next)
    next mtlb ek middleware kaam pura krke aage bhejta h .


## Utils 
The code of connecting to database we have written inside DB folder index.JS would be needed back and back again in user controller and video controllers For it we make some wrapper function in utils folder. 
Inside util's folder making asynchandler JS file.  we can write code in two forms using promises(uncommented) and try catch(commented).  

```
Around (24:51-25:17), the speaker explains the necessity of a wrapper function (also called an async handler) when dealing with database operations.

Here's why it's needed:

Repetitive code: When interacting with a database, you consistently need to use async/await because these operations take time. You also need try...catch blocks to handle potential errors.  

Standardization: Instead of writing the same async/await and try...catch boilerplate every time you connect to the database (e.g., in user controllers, video controllers), you can create a single, reusable wrapper function.  

Abstraction: This wrapper function encapsulates the common logic, allowing you to simply pass your specific database interaction function to it. The wrapper then handles the asynchronous nature and error handling, making your code cleaner and more standardized.
```

**MATLAB  -->** : yeh try catch aur async await ka boiler har baar hi likhna hai db ko user / video controller mein har bar hi call karna hai uske liye asynchandler naam ka ek wrapper fn de diye.

In simple words ,we can say that async handler is a higher order function that takes in a function and applies try catch and makes it async and it turns the function as well

```
the fn (function) passed as a parameter to the asyncHandler cannot be executed directly at that point because the asyncHandler itself is designed as a higher-order function that returns another function (a callback).

Since asyncHandler is returning a new function, the fn passed to it needs to be executed within that returned function's scope, not directly when asyncHandler is initially defined. The outer function simply accepts fn and prepares it for later execution by the inner, returned function.
```


utna code karne ke baad ab ham custom classes banayege error and api response ki taki error and response ka  structure streamlined rahe.
uske liye do aur files banegi utils mein. ApiError.js and ApiResponse.js.  