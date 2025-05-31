const express = require('express');
const cors = require('cors');
const { default: mongoose, connect } = require('mongoose');
const User = require('./models/user');
const Post = require('./models/post');
const bcrypt = require('bcrypt'); //used to ecrypt data
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const fs = require('fs');
const { json } = require('stream/consumers');
// const router = express.Router();





app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

const secret = "ncknknaidnckianckanc";
const salt = bcrypt.genSaltSync(10);
mongoose.connect('mongodb+srv://usmanali0044444:usmanali0044444@cluster0.gwosf.mongodb.net/');

app.get('/test', async (req, res) => {
        res.status(200).json('Test is running hey from backend server');
});




app.post('/register', async (req, res) => {
        const { username, password } = req.body;
        try {
                const userDoc = await User.create({
                        username,
                        password: bcrypt.hashSync(password, salt),
                });
                res.json(userDoc);
        }
        catch (e) {
                res.status(400).json(e);
        }
});

app.post('/login', async (req, res) => {
        const { username, password } = req.body;
        const userDoc = await User.findOne({ username });
        const passOk = bcrypt.compareSync(password, userDoc.password);

        if (passOk) {
                jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
                        if (err) throw err;
                        res.cookie('token', token).json({
                                id: userDoc._id,
                                username,
                        });
                });
        } else {
                res.status(400).json('Wrong credentials');
        }
});

app.get('/profile', (req, res) => {
        console.log("📡 Received GET request to /profile");

        const { token } = req.cookies;
        if (!token) {
                console.warn("⚠️ No token found in cookies!");
                return res.status(401).json({ error: "Authentication token is missing" });
        }
        console.log("🔑 Token found in cookies:", token);

        jwt.verify(token, secret, {}, (err, info) => {
                if (err) {
                        console.error("❌ JWT verification failed:", err.message);
                        return res.status(403).json({ error: "Invalid or expired token" });
                }
                console.log("✅ JWT verified successfully. User info:", info);
                res.json(info);
        });
});


// to logout the user 
app.post('/logout', (req, res) => {
        res.cookie('token', '').json('ok')
})




// ================old code for create post ================ 

app.post('/post', uploadMiddleware.fields([
    { name: 'file', maxCount: 1 },
    { name: 'logo', maxCount: 1 }
]), async (req, res) => {
    try {
        const { title, about, content ,contact , website , email} = req.body;

        const coverFile = req.files?.file?.[0];
        const logoFile = req.files?.logo?.[0];

        if (!coverFile || !logoFile) {
            return res.status(400).json({ error: "Cover image and logo are required!" });
        }

        const coverExt = coverFile.originalname.split('.').pop();
        const logoExt = logoFile.originalname.split('.').pop();

        const newCoverPath = coverFile.path + '.' + coverExt;
        const newLogoPath = logoFile.path + '.' + logoExt;

        fs.renameSync(coverFile.path, newCoverPath);
        fs.renameSync(logoFile.path, newLogoPath);

        const { token } = req.cookies;
        jwt.verify(token, secret, {}, async (err, info) => {
            if (err) return res.status(401).json({ error: "Unauthorized" });

            const postDoc = await Post.create({
                title,
                about,
                content,
                contact,
                website,
                email,
                cover: newCoverPath,
                logo: newLogoPath,
                author: info.id,
            });

            res.json(postDoc);
        });
    } catch (err) {
        console.error("POST creation failed:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});


app.put('/post/:id', uploadMiddleware.fields([
    { name: 'file', maxCount: 1 },
    { name: 'logo', maxCount: 1 }
]), async (req, res) => {
    try {
        const postId = req.params.id;

        if (!postId) {
            console.error("❌ Post ID is missing");
            return res.status(400).json({ error: "Post ID is required!" });
        }

        console.log(`📌 Post ID: ${postId}`);

        const { title, about, content, contact , website , email } = req.body;

        if (!title || !about || !content || !contact || !website || !email) {
            console.error("❌ Missing title, about, or content");
            return res.status(400).json({ error: "Title, about, content ,contact , website , email  are required!" });
        }

        let coverPath = null;
        let logoPath = null;

        // Handle cover image
        if (req.files?.file?.[0]) {
            const { originalname, path } = req.files.file[0];
            const ext = originalname.split('.').pop();
            coverPath = path + '.' + ext;
            fs.renameSync(path, coverPath);
        }

        // Handle logo image
        if (req.files?.logo?.[0]) {
            const { originalname, path } = req.files.logo[0];
            const ext = originalname.split('.').pop();
            logoPath = path + '.' + ext;
            fs.renameSync(path, logoPath);
        }

        const { token } = req.cookies;

        if (!token) {
            console.error("❌ Missing token in cookies");
            return res.status(401).json({ error: "Unauthorized: Token is required!" });
        }

        jwt.verify(token, secret, {}, async (err, info) => {
            if (err) {
                console.error("❌ Token verification failed:", err.message);
                return res.status(401).json({ error: "Unauthorized access!" });
            }

            const post = await Post.findById(postId);

            if (!post) {
                console.error("❌ Post not found");
                return res.status(404).json({ error: "Post not found!" });
            }

            if (post.author.toString() !== info.id) {
                console.error("❌ Unauthorized: User is not the author of this post");
                return res.status(403).json({ error: "You are not authorized to update this post!" });
            }

            // Update post
            post.title = title;
            post.about = about;
            post.content = content;
            post.contact = contact;
            post.website = website;
            post.email = email;

            if (coverPath) {
                post.cover = coverPath;
            }

            if (logoPath) {
                post.logo = logoPath;
            }

            const updatedPost = await post.save();

            res.json({ message: "Post updated successfully!", post: updatedPost });
        });
    } catch (error) {
        console.error("💥 Internal server error:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});




app.get('/post', async (req, res) => {
        res.json(
                await Post.find()
                        .populate('author', ['username'])
                        .sort({ createdAt: -1 })
                        .limit(20)
        );
});

app.get('/post/:id', async (req, res) => {
        const { id } = req.params;
        const postDoc = await Post.findById(id).populate('author', ['username']);
        console.log("Post  ⌛⌛⌛⌛" , postDoc);
        res.json(postDoc);
});


// create post updated code for hidden btn 
// Check if logged-in user has any posts
app.get('/has-post', (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized, token missing' });
  }

  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    try {
      const userPostsCount = await Post.countDocuments({ author: info.id });
      res.json({ hasPost: userPostsCount > 0 });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
});

// create post updated code for hidden btn 
// app.use(router);


app.listen(4000, () => console.log("Server is running on port 4000"));



