var express = require("Express");
var router = express.Router();
var mongoClient = require('mongodb').MongoClient;
var twilioClient = require('twilio')(
    "ACa70bd9d318bd818d03c5b7cf4f4d8475",
    "5987b547966aab462e7c3e006394ccc4"
    );
var otp;
   

/* Used to load the static folder and files */
router.use('/', express.static(__dirname + ''));

/* To set the path of the static html file to be served. */
var path = require('path');
var db;
/* Connecting with Mongo DB */
mongoClient.connect('mongodb://localhost:27017/lastseenrestaurent', (err, database)=>{
    if(err){
        console.log('error occured while retriving');
        return;
    }
    else{
        console.log('Connected to Mongo DB');
    }

    db = database;
    

    
});

/* Handling the default get request */
router.get('/', function(req, res){

    res.sendFile(path.join(__dirname + '/index.html'));
});

router.get('/data', function(req, res){
    
    var menuItemsTable = db.collection('menuItemsTable');
    
    menuItemsTable.find().toArray(function(err, docs) {
        var itemArray = [];
        
        for(var i = 0; i< docs.length; i++){
            var itemDetail = docs[i];
            itemArray.push(itemDetail);
        }
        
        res.send(itemArray);
        
    })


});

router.post('/generateOTP', function(req, res){
    var  PhoneNumber = "+91"+req.body.PhoneNumber;
    otp = Math.floor(Math.random() * 100000);
    console.log(otp);
    twilioClient.messages.create({
        from: "+13016914627",
        to: PhoneNumber,
        body: "your OTP for Last Seen restaurent is "+otp
        }, function(err, message) {
        if(err) {
        console.error(err.message);
        res.send(err);
    }else{
        res.send(true);
    }
    
    });
});


router.post('/signup', function(req, res){
    console.log(req.body.otp);
       console.log(otp);
    if(req.body.otp == otp){
       console.log(req.body.PhoneNumber)
        var user = db.collection('User');
        user.find({'PhoneNumber': req.body.PhoneNumber}).toArray(function(err, docs) {
            var userObject = docs[0];
            if(userObject){
                res.send("Already have an account with this Phone Number");
            }
            else{
                user.insertOne( {
                    Name : req.body.Name,
                    PhoneNumber : req.body.PhoneNumber,
                    EmailId : req.body.EmailId,
                    Password : req.body.Password
                }, function(err, result) {
                
                });
                 res.send(userObject);
            }
            
        });
      
    }
    else{
        res.send("Wrong OTP");
    }
    

});

/* Handling the POST request to login */
router.post('/login', function(req, res) {
    var user = db.collection('User');
    user.find({'PhoneNumber': req.body.PhoneNumber}).toArray(function(err, docs) {
        var userObject = docs[0];
        console.log(userObject);
        if(userObject){
            if(userObject.Password == req.body.Password){
                res.send(userObject);
            }
            else{
            
                res.send("Invalid Credential");
            }
        }
        else{
            
            res.send("Invalid Credential");
        }
        
    });
    
    
    
    
});


module.exports = router;