Sab hogya ab hamein subscriber count etc chahiye , uske liye DB pe thoda discussion :           
```sawaal```kyu hamne alag schema banaya , user k andr ek array bhi toh store kar sakte the na      
```jawab```nahi , imagine kisi ke 1 million subs ho , unka data array mein dikkt deta and imagine agar us array ka first entry hi unsubscribe kr de , fir woh operation expensive hota hai.            


## understanding subscription schema 
uske andr hmne 2 values li hain , subscriber and channel .  
hain toh dono user hi       
jaise hi koi user kisi channel ko sub karta hai tb mongo db mein ek document banta hai
    channel : X
    subscriber : y

now jitni baar koi sub krega utni baar aise bnega           
ab agar hamein subscriber count chahiye , toh hame channels select krke uske no of docucments ko count karna pdega.         
for eg : no of doc where channel = x gives total subs of x

for y ne kisko subscribe kiya : no of docs where subscriber = y.

so ,
    Subscription model ko user model se join karna hai .
    Uske liye sikhna hai Aggregation pipeline   

# Aggregation pipeline
Simple sa pipeline ka mtlb hai ek ya usse jyada stages hoti hain ,          
and documents that are output from a stage are passed to the next stage.


syntax :
```
db.___.aggregate([   ----->  Db ke baad jispe laga rahe hain woh likhna hai jaise users / orders etc 
    {} , {}          ----->  Array ke andr objects hote hain (array of objects)
])                   ----->  Har ek object ek stage / pipeline hai
```

now , to join $lookup is used , to create or add a new field we use $addfields and aise aur bhi fields hote hain.      
generally $match field is used in the first pipeline , it helps to match something in the DB.       

```Note:``` Yahan par table/row ko document bolte hain , confuse mt hona usme
___
```Now``` , 3 chizein karni hain (jo channel page mein display hongi):
- Subscriber count 
- Subscribed count
- Agar koi user kisi channel pe already subscribed hai toh uske mein subscribe ki jagah subscribed likha hua hoga , toh uski calculation bhi karni hai. 

pehle usi ka controller likhege so making a new controller inside userController jo ki ye chizein display karta hai , 
getUserChannelProfile 

## Inside the Controller
kisi bhi channel ki profile details par jana hai (channel page) toh usually us channel ke url par jate hain for eg : /channelxyz or @channelxyz jo v .so we will use req.params

## Some points : 
- Aggregation pipelines likhne ke baad array wapas aata hai. 
- [{first pipeline} , {} , {}] , first pipeline mein generally $match likhte hain yeh WHERE clause ki tarah hi hota hai jo kisi chiz ko dhundh ke deta hai.     
- kisi chiz ko count karne ke liye $size use karte hain (ham subs count isi ki help se krege)
- lookup ke andr jab from likhte hain tab ham model ke name ko lowercase + plural krke likhte hain as mongo db waise hi save karta hai. 
- Lookup wali pipeline mein as likhte hain last mein , yeh us puri field ka naam/title hai jiske andr ham jo query likhe join ki woh dikhti hai.    
- for condition we use $cond

