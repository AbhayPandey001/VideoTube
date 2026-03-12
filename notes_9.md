# HTTP Crash course :

### why http and not https
dono mein bas protocol ka difference hai baki technology/rules behind same hi rehte hain.  
bas ek encryption ki layer add ho jati hai https mein . and mostly researches mein v http hi likhte hain.  

## HTTP 
text ke transfer se related discussion.  

## HTTP headers
jab kabhi bhi file transfer karte hain toh uske sath kuch file ke baare mein data v send karte hain(metadata) usi ko file headers bolte hain. hota kch v nahi hai inse bas file ke baare mein jaankari hai.   

### dikhte kaise hain yeh headers ?
simple sa key value pair hote hain.  
khud ke v hote hain aur ham v bana sakte hain.  

### uses 
they are used for caching , authentication and managing state.

2012 ke pehle tak metadata ke pehle x- suffix lagana pdta tha lekin ab woh deprecate hogya hai and ham directly likh sakte hain.  

### types : 
- request headers           --> from client
- response headers          --> from server
- Representation headers    --> encoding / encryption ko dikhata hai
- payload headers           --> payload ka simple sa mtlb hai data . woh bas ek fancy name hai . so kch v data bhejna ho uske aage ( : ) laga ke uski value likh ke bhej dete hain. 

### most common headers :
- accept : application/json   // matlb kis type ka data accept ho raha
- user-agent :                // kaun si app se req aayi h browser / postman etc . phone ka browser etc
- authorization :             
- content-type : 
- cookie : 
- cache-control :             // data kitni der mein expire karna hai .

inke alawa bhi hote hain , jaise CORS related and security related jo set kiye jate hain .  

## HTTP Methods
    Basic set of operations that can be used to interact with server . 

- GET               : retrieve a resource 
- HEAD              : no body message , only header file aati hai
- OPTIONS           : kaun se operation available hain end points pe 
- TRACE             : kaun si proxies se aara hai 
- DELETE            : Remove a resource
- PUT               : replace a resource
- Post              : to add a resource
- PATCH             : replace a resource partially

ye saare end points hamein banane hote hain apne aap nahi bante hain yeh .  

## Status codes
- 1xx : information 
- 2xx : success
- 3xx : redirection
- 4xx : client error
- 5xx : server error


## Kuch common codes : 

- 100: Continue
- 102: Processing
- 200: OK
- 201: Created
- 202: Accepted
- 307: Temporary
- 308: Permanent
- 400: Bad Request
- 401: Unauthorized
- 402: Payment
- 404: Not Found
- 500: Internal Server
- 504: Gateway Timeout