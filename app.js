//importing npm installers
var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var mongoose=require('mongoose'); 
var methodOverride=require('method-override');
var expressSanitizer=require('express-sanitizer');

//start using body parser to take input from form
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

//view engine..getting rid of typing .ejs
//also allows to search directly in views directory
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(expressSanitizer());

//connect mongoose
mongoose.connect("mongodb://localhost/blog_app", {
  useMongoClient: true
}, function(err, client) {
  if (err) {
    console.log(err);
  }
  else
  console.log('mongodb connected!!!');
});

//mongoose promise
mongoose.Promise=global.Promise;

//mongo config

var blogSchema=new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created: {type:Date ,default:Date.now}
});

var blog=mongoose.model("blog",blogSchema);

// blog.create({
//     title:"test case",
//     image:"https://images.unsplash.com/photo-1536753111214-f4710693f6af?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=9caba759b904c2abf00d2f5a1ea4c010&auto=format&fit=crop&w=500&q=60",
//     body:"just checking the working"
// });


//routes

//home
app.get("/",function(req,res){
    res.redirect("/blogs");
});

//index
app.get("/blogs",function(req,res){
    blog.find({},function(err,blogs){
        if(err)
        console.log(err);
        else
        {
            res.render("index",{blogs:blogs});
        }
    });
});


//new 
app.get("/blogs/new",function(req,res){
    res.render("new");
});

//create
app.post("/blogs",function(req,res){
    
    req.body.blog.body=req.sanitize(req.body.blog.body)
   var newblog=req.body.blog;
   blog.create(newblog,function(err,blog){
       if(err)
       res.render("new");
       else
       res.redirect("/blogs");
   })
   
});

//show 
app.get("/blogs/:id",function(req,res){
    blog.findById(req.params.id,function(err,foundblog){
        if(err)
        console.log(err);
        else
        {
            res.render("show",{blog:foundblog});
        }
    });
});

//edit
app.get("/blogs/:id/edit",function(req,res){
    blog.findById(req.params.id,function(err,foundblog){
        if(err)
        console.log(err);
        else
        {
            res.render("edit",{ blog: foundblog});
        }
    });
});

//update 
app.put("/blogs/:id",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body)
   blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedblog){
       if(err)
       console.log(err);
       else
       {
           res.redirect("/blogs/"+req.params.id);
       }
   });
});

//destroy
app.delete("/blogs/:id",function(req,res){
    blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs");
        }
    });
});


//setting up port and ip address
app.listen(process.env.PORT,process.env.IP,function(){
    console.log('blog app has started');
});