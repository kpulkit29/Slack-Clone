const express = require('express')
const bodyParser = require('body-parser')
const Chatkit = require("pusher-chatkit-server");
const cors = require('cors')

const app = express()
const chatkit= new Chatkit.default({
  instanceLocator:"v1:us1:b096f295-74eb-457b-8e46-31303cde2e79",
  key:"9426e0c0-d824-459e-b67e-bc5c80a523f2:7q/b+oiQ4lMl0S3iyKnLkWel8E0zZpu33qM4GT1DXG4="
})
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname+"/build"));
//a route to connect to the chatkit
app.get("/",function(req,res){
  res.sendFile(__dirname+"/build/index.html");
})
app.post("/username",function(req,res){
  console.log(req.body.username);
  const {username}=req.body;
 chatkit.createUser({
   name:username,
   id:username
 }).then(()=>res.sendStatus(201)).catch(err=>{
  if (err.error === 'services/chatkit/user_already_exists') {
    console.log("2");
         res.sendStatus(200);
         } else {
           console.log("1");
          res.status(error.status).json(error);
         }
 })
});
//to autheticate
app.post('/authenticate',function(req, res){
  const authData = chatkit.authenticate({ userId: req.query.user_id })
  res.status(authData.status).send(authData.body)
});
app.listen(process.env.PORT||'3001');
