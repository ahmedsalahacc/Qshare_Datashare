const express        = require("express"),
      methodOverride = require("method-override"),
      app            = express(),
      mongoose       = require("mongoose"),
      bodyParser     = require("body-parser");
      expressSan     = require("express-sanitizer")

//APP CONFIG
mongoose.connect('mongodb://localhost:27017/qshare', { useNewUrlParser: true});
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSan())
app.use(express.static("public")); //to be able to use style sheets in express and search for the directory public
app.use(methodOverride("_method")); //to be able to override methods in ejs from post to put of necessery 
//MONGOOSE/MODEL CONFIG
var blogSchema = mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type:Date,default: Date.now}
});

var Blog = new mongoose.model("Blog",blogSchema);

/* Blog.create({
    title: "Pyramids",
    image: "https://images.memphistours.com/large/417554052_giza%20pyramids%20(4).jpg",
    body: "this is beautiful"
}) */
//ROUTES
///main route
app.get("/",function(req,res){
    res.redirect("/blogs");  
});
///blogs route
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log("DATABASE ERROR!!!:\t",err)
        } else{
            res.render("index", {blogs:blogs});
        }
    });
});
///new route
app.get("/blogs/new",function(req,res){
    res.render("new");
});
///create route
app.post("/blogs",function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,function(err,newBlog){
        if(err){
            console.log("DATABASE ERROR:\t",err);
        } else{
            res.redirect("/blogs");
        }
    });
});
///show route
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,data){
        if (err){
            alert("DATABASE ERROR:\t", err);
            res.redirect("/blogs");
        } else{
            res.render("show",{blog:data});
        }
    });
});
///Edit
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,data){
        if(err){
            alert("DATABASE ERROR:\t", err);
            res.redirect("/blogs")
        } else{
            res.render("edit",{blog:data})
        }
    })
})
///update route
app.put("/blogs/:id",function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedData){
        if (err){
            res.redirect("/blogs");
        } else{
            res.redirect("/blogs/"+req.params.id)
        }
    })
})

///Delete route
app.delete("/blogs/:id/",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if (err){
            console.log("Cannot Delete");
            res.redirect("/blogs");
        } else{
            res.redirect("/blogs")
        }
    })

})
//CONFIG SERVER REQUESTS
app.listen(3100,function(){
    console.log("qshare has started");
});
