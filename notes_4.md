# Setup of production grade application (backend)
1. Open the folder : do npm init , package file aajayegi 
type module daal dena npm init mein hi puchta hai
agar nahi dale to package me jaake change karlo 
___
2.Agar hamein Image v leni hai , toh usko kahi bahar rakhte hain but temporarily ham apne server par rakhte hain and then usko AWS ya fir claudinary par daal dete hain . so making a folder Public/temp 

yeh folder empty hai shuru mein agar isko git pe push krna hai toh iske andr ek empy .gitkeep file bana do
___
Also making .gitignore file , there are various sites that give .gitignore file based on our project 
- [One_such_site](https://mrkandreev.name/snippets/gitignore-generator/#Node)
just search for node and click create copy paste contents to .gitignore file we made just now on root directory
___
.env file v bana lo 
___
To be more organized , make a **src** folder and keep your files here.  
Inside src make files : app.js index.js and constants.js

___
We know that whenever we make changes to a server file we need to close the server and then restart it .  
usse bachne ke liye nodemon naam ki ek dev dependency ko install karte hain : https://www.npmjs.com/package/nodemon  
isko dev dependency ke taur pe install karna hai  
```
npm install --save-dev nodemon
```
or 
``` 
npm i -D nodemon
```
## dev dependency kya hoti hai 
yeh woh dependency hai jo sirf development ke time pe hame help karti hai and production mein nahi jaati hai  

## nodemon kya karega ? 
ham jo v change karege usko reload kar dega, bas usko batana padega , go to package file and : 
``` "scripts": {
    "dev": "nodemon src/index.js"
  },
```
Now inside src , make the following folders :  
controllers ,db , middlewares , models , routes , utils  
or directly do : 
```
cd src
mkdir controllers ,db , middlewares , models , routes , utils
```

Now we have to install another plugin : **prettier**
formatting mein help karta hai   
(https://www.npmjs.com/package/prettier)
usko bhi as a  dev dependency install karna hai
```
npm i -D prettier
```


Now , jab v prettier aata hai hamein do files banani hoti hai 

1.  .prettierrc : yaha settings likhte hain jo har jagah follow hogi
2. .prettierignore : jo folders mein iska effect nahi padna chahiye like .env and nodemodules etc