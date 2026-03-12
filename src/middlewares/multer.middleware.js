import multer from 'multer'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {  //cb means callback , multer mein hi file bhi milti hai , yeh wahi file hai jo upload honi h .
    cb(null, './public/temp')  //agar error aajaye toh kya karna h woh likhte hain (mostly null) and then file directory dete hain.
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

export const upload = multer({ storage: storage }) // storage : storage ko sirf storage v bol sakte hain as per ES6. 