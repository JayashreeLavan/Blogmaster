var express = require("express"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    mongoose = require("mongoose");
    
var app = express();

mongoose.connect("mongodb://localhost/blog_app",{useMongoClient: true,});
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

var blogSchema=new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date, default:Date.now}
});

var Blog = mongoose.model("Blog",blogSchema);

app.get("/",function(req,res){
    res.redirect("/blogs");
});

app.get("/blogs",function(req,res){
    Blog.find({},function(error,blogs){
        if (error){
            console.log(error);
        }
        else{
           res.render("index",{blogs:blogs}); 
        }
        
    });
   
});

app.get("/blogs/new",function(req,res){
    res.render("new");
});

app.post("/blogs",function(req,res){
   req.body.blog.body =req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,function(error,newBlog){
        if(error){
            console.log(error);
            res.render("new")
        }
        else{
            res.redirect("/blogs");
        }
    })
    
 
});

app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(error, foundBlog){
        if(error){
            console.log(error);
            res.redirect("/blogs");
        }
        else{
            res.render("show",{blog:foundBlog});          
        }
    })
  
});

app.get("/blogs/:id/edit",function(req,res){
     Blog.findById(req.params.id,function(error, foundBlog){
        if(error){
            console.log(error);
            res.redirect("/blogs");
        }
        else{
            res.render("edit",{blog:foundBlog});          
        }
    })
});

app.put("/blogs/:id",function(req,res){
    req.body.blog.body =req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(error,updatedBlog){
        if(error){
            console.log(error);
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs/"+req.params.id);        
        }
    });
    
});

app.delete("/blogs/:id",function(req,res){
      Blog.findByIdAndRemove(req.params.id,function(error){
        if(error){
            console.log(error);
            res.redirect("/blogs/"+req.params.id);
        }
        else{
            res.redirect("/blogs");        
        }
    });
});








app.listen(process.env.PORT , process.env.IP,function(){
   console.log("Server started"); 
});