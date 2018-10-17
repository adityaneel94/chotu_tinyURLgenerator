
///////////// body parser to get data from body ////////
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
////////////////////////////////////////////////////////

//###################################### connecting to mongodb #########################################
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/mydb',{useMongoClient:true});

mongoose.connection.once('open',function(){
  console.log("Connected to MongoDB !!!")
}).on('error',function(){
  console.log("Connection to MongoDB failed !!!");
})

const Schema = mongoose.Schema;

//////////////// creating schema for registered user /////////////////////////
const RegisterUserSchema = new Schema({
  username:String,
  email:String,
  password:String
});

const RegisterUser = mongoose.model('registerusercollections',RegisterUserSchema);
////////////////////////////////////////////////////////////////////////////

//////////////////////// creating schema for shortened url ///////////////////
const ShortenedUrlSchema = new Schema({
  email:String,
  long_url:String,
  shortened_url:String,
  click_count: Number,
  date: String,
  date_number: Number
});

const ShortenURL = mongoose.model('shortenedurlcollections',ShortenedUrlSchema);

////////////////////////////////////////////////////////////////////////////

//////////////////////// creating schema for making charts ///////////////////
const ChartSchema = new Schema({
  hash:String,
  date:String,
  click_count: Number,
  date_number: Number
});

const Chart = mongoose.model('chartcollections',ChartSchema);

////////////////////////////////////////////////////////////////////////////

module.exports = function(app){

//#################### rendering web pages ##############################

app.get('/login',function(req,res){
  res.render('login');//login page rendering by its page name
});

app.get('/dashboard',function(req,res){
  res.render('dashboard');//dashboard page rendering by its page name
});

app.get('/signup',function(req,res){
  res.render('signup');//dashboard page rendering by its page name
});

app.get('/invalidate',function(req,res){
  res.render('invalidate');//login page rendering by its page name
});

//########################################################################

//######### handling mongodb operations of webpage #########


//---------------------------- for login (complete it)--------------------------------

app.post('/check_for_username_login',urlencodedParser,function(req,res){

      // console.log("check_for_username_login");
      // console.log("Username recvd. from login:");
      // console.log(req.body.email);
      // console.log("Password recvd. from login:");
      // console.log(req.body.password);

      //var data = [{item:'get milk'},{item:'get water'},{item:'get biscuit'}];

      RegisterUser.find({email:req.body.email,password:req.body.password}).then(function (result) {

              res.json(result);

            // console.log("checking for username during login");
            // console.log(result);

      });


});

//-----------------------------------------------------------------------

//------------------------------- for charts ----------------------------

app.post('/chart_database',urlencodedParser,function(req,res){
  const chart = new Chart({
    hash:req.body.hash,
    date:req.body.date,
    click_count:req.body.click_count,
    date_number:req.body.date_number
  });

  chart.save().then(function(){
    // console.log("Chart entries are inserted to 'chartcollections' db...")
    // console.log(req.body.hash);
    // console.log(req.body.date);
    // console.log(req.body.click_count);
  })

});
//-------------------------------------------------------------------------


//-------------------------------- for signup ---------------------------
app.post('/signup_database',urlencodedParser,function(req,res){
const user = new RegisterUser({
  username:req.body.username,
  email:req.body.email,
  password:req.body.password
});

user.save().then(function(){
  // console.log("Signup details inserted to 'registerusercollections' db...")
})

});
//--------------------------------------------------------------------------

//------------------------------- for dashboard ----------------------------

app.post('/dashboard_database',urlencodedParser,function(req,res){
  const user = new ShortenURL({
    email:req.body.email,
    long_url:req.body.long_url,
    shortened_url:req.body.shortened_url,
    click_count:req.body.click_count,
    date:req.body.date,
    date_number:req.body.date_number
  });

  user.save().then(function(){
    // console.log("Short and long urls are inserted to 'shortenedurl db...")
    // console.log("click count rcvd.")
    // console.log(req.body.click_count);
  })

});
//-------------------------------------------------------------------------


//-------------------------------- for getting click_count ---------------------------
app.post('/get_click_count',urlencodedParser,function(req,res){

  ShortenURL.find({long_url:req.body.long_url,email:req.body.email,date:req.body.date,date_number:req.body.date_number}).then(function (result) {

//          console.log(req.body.click_count);
          res.json(result);
          console.log(result);
//          console.log("COUNT SENT = "+req.body.click_count);

    //    console.log("Displaying Old links at the dashboard page...");

  });

});
//--------------------------------------------------------------------------




//------------------ retrieving old links of the user ---------------------
app.post('/dashboard_old_link',urlencodedParser,function(req,res){


  ShortenURL.find({email:req.body.email}).then(function (result) {

//          console.log(req.body.click_count);
          res.json(result);
          // console.log(result);

    //    console.log("Displaying Old links at the dashboard page...");

  });

});
//-------------------------------------------------------------------------

//------------------ incrementing click count ---------------------
app.post('/increment_click_count',urlencodedParser,function(req,res){


  ShortenURL.update({long_url:req.body.long_url},{$inc: {click_count:1}}).then(function(result){//    ({long_url:req.body.long_url}).then(function (result) {
//,shortened_url:req.body.shortened_url
          // console.log("Count incremented !!!");
          // console.log("New Count = "+req.body.click_count);

  });
});
//-------------------------------------------------------------------------



//----------------- invalidating a link in database -----------------------

app.post('/dashboard_invalidate',urlencodedParser,function(req,res){

//update from here onwards
  ShortenURL.update({long_url:req.body.long_url},{$set: {long_url:"/invalidate"}}).then(function(result){//    ({long_url:req.body.long_url}).then(function (result) {

          // console.log("A long URL has been invalidated !!!");
          // console.log(req.body.long_url);
  //        res.json(result);

    //    console.log("Displaying Old links at the dashboard page...");
      //  console.log(result);

  });

});





app.post('/show_graph',urlencodedParser,function(req,res){


  Chart.find().then(function (result) {

//          console.log(req.body.click_count);
          res.json(result);
          // console.log(result);

    //    console.log("Displaying Old links at the dashboard page...");

  });

});

//-------------------------------------------------------------------------

//#######################################################################

};
