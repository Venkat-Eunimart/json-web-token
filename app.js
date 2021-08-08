const express=require('express')
const app=express()
require('dotenv').config()
const bodyParser = require("body-parser")
const mongoose = require("mongoose");
const jwt=require('jsonwebtoken');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())
mongoose.connect('mongodb://localhost:27017/JWT' , { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("DB CONNECTED SUCCESSFULLY")
    })
    .catch(err => {
        console.log("DB CONNECTED FAILED!!!")
        console.log(err)
    })



// const posts=[{
//    username:"kk6@gmail.com",
   
// }]


const userSchema={
    email:String,
    password:String
  };

const User=new mongoose.model("User",userSchema);  

app.post("/register",async function(req,res){
    const username=req.body.username;
    const pass=req.body.password;
    try{
    await User.findOne({email:username},async function(err,Username)
    {
      if(Username==null){
          const newUser=new User({
            email:username,
            password:pass
          });
          try{ newUser.save();
            res.json("success")
          }
          catch(err){console.log(err);}

      }
      else(res.json("Already there"))
      

    })
}
    catch(err){
        throw err
    }

    });



app.post("/login",async function(req,res)
{
  const username=req.body.username;
  const password=req.body.password;
  console.log(password)
  const user={name:username};
  try{
    let queryResult = await User.findOne({email:username});
    console.log(queryResult)
    if(queryResult.password === password)
    {
     const accessToken=jwt.sign(user,process.env.ACCESS_TOKEN_SECRET)
     res.json({accessToken:accessToken})
    }
    else res.json("User does not exist")
  }
  catch(err){
    console.log(err);
  }
});



app.get("/open",verifytoken,function(req,res){
  res.json("succes")
});


function verifytoken(req,res,next){
  console.log("jj")
  const authHeader=req.headers['authorization']
  const token=authHeader && authHeader.split(' ')[1]
  console.log(authHeader);

  try{
    if(token==null) return res.sendStatus(401)

    else{        
    let data = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    next()
    }
    
}

catch(err){

    return null;
}

}

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
