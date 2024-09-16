var express = require('express');
var router = express.Router();
const upload=require("./multer");
const userModel=require("./users");
const postModel=require("./posts");
const passport = require('passport');
const local=require("passport-local");
passport.use(new local(userModel.authenticate()))

/* GET home page. */
const loggedIn=(req,res,next)=>{
  if(req.isAuthenticated())
  return next();
res.redirect('/');
}
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/register',(req,res)=>{
  res.render("register");
})
router.get('/login',(req,res)=>{
  res.render("index");
})
router.get('/logout',(req,res,next)=>{
  req.logout((err)=>{
    if(err)
    return next(err);
  res.redirect('/');
  })
})
router.get('/profile',loggedIn,async (req,res)=>{
  const user=await userModel.findOne({username: req.session.passport.user});
  const posts=await user.populate("posts");
  console.log(req.session.passport);
  console.log(posts);
  res.render("profile",{user: user,posts: posts});
})
router.get('/post',(req,res,next)=>{
  res.render('post');
})
router.post('/uploadimage',loggedIn,upload.single("profile-image"),async (req,res)=>{
  console.log(req.file.filename);
  const username=await userModel.findOne({
    username:req.session.passport.user
  });
  username.profileImage=req.file.filename;
  await username.save();
  res.send("uploaded");
})
router.post("/register",(req,res)=>{
  const userdata=new userModel({
    username:req.body.username,
    email:req.body.email,
    contact:req.body.contact,
  })
  userModel.register(userdata,req.body.password).then(()=>{
    passport.authenticate("local")(req,res,()=>{
      res.redirect('/profile')
    })
  })
})
router.post("/login",passport.authenticate("local",{
  successRedirect:'/profile',
  failureRedirect:'/'
}),(req,res)=>{})
router.get('./logout',(req,res,next)=>{
  req.logOut((err)=>{
    if(err)
    return next(err);
  res.redirect('/');
  })
})
router.post('/createpost',loggedIn,upload.single("post-image"),async (req,res,next)=>{
  const user=await userModel.findOne({username:req.session.passport.user});
  const post=await postModel.create({
    userId:user._id,
    title:req.body.title,
    description:req.body.description,
    image:req.file.filename
  });
  user.posts.push(post._id);
  user.save();
  res.redirect('/profile')
})

module.exports = router;
