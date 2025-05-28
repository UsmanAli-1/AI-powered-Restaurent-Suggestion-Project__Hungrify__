const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/user');
const Post = require('./models/post');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const fs = require('fs');

const app = express();
const uploadMiddleware = multer({ dest: 'uploads/' });
const salt = bcrypt.genSaltSync(10);
const secret = "ncknknaidnckianckanc";

mongoose.connect('mongodb+srv://usmanali0044444:usmanali0044444@cluster0.gwosf.mongodb.net/');

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

// =========================== Auth Routes ===========================
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.status(200).json(userDoc);
  } catch (e) {
    res.status(400).json({ error: 'User already exists or invalid input', details: e });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });

  if (!userDoc) return res.status(400).json({ error: "User not found" });

  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie('token', token).json({ id: userDoc._id, username });
    });
  } else {
    res.status(400).json({ error: "Wrong credentials" });
  }
});

app.get('/profile', (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ error: "Token missing" });

  jwt.verify(token, secret, {}, (err, info) => {
    if (err) return res.status(403).json({ error: "Invalid or expired token" });
    res.json(info);
  });
});

app.post('/logout', (req, res) => {
  res.cookie('token', '').json('ok');
});

// ======================== Post Routes ==============================
app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
  try {
    const { originalname, path } = req.file;
    const ext = originalname.split('.').pop();
    const newPath = `${path}.${ext}`;
    fs.renameSync(path, newPath);

    const { token } = req.cookies;
    if (!token) return res.status(401).json({ error: "Token missing" });

    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) throw err;
      const { title, summary, content } = req.body;
      const postDoc = await Post.create({
        title,
        summary,
        content,
        cover: newPath,
        author: info.id,
      });
      res.json(postDoc);
    });
  } catch (err) {
    res.status(500).json({ error: "Post creation failed", details: err.message });
  }
});

app.put('/post/:id', uploadMiddleware.single('file'), async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, summary, content } = req.body;
    let newPath = null;

    if (req.file) {
      const { originalname, path } = req.file;
      const ext = originalname.split('.').pop();
      newPath = `${path}.${ext}`;
      fs.renameSync(path, newPath);
    }

    const { token } = req.cookies;
    if (!token) return res.status(401).json({ error: "Token missing" });

    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) return res.status(403).json({ error: "Token verification failed" });

      const post = await Post.findById(postId);
      if (!post) return res.status(404).json({ error: "Post not found" });

      if (post.author.toString() !== info.id)
        return res.status(403).json({ error: "Unauthorized" });

      post.title = title;
      post.summary = summary;
      post.content = content;
      if (newPath) post.cover = newPath;

      const updatedPost = await post.save();
      res.json({ message: "Post updated successfully", post: updatedPost });
    });
  } catch (err) {
    res.status(500).json({ error: "Error updating post", details: err.message });
  }
});

app.get('/post', async (req, res) => {
  const posts = await Post.find().populate('author', ['username']).sort({ createdAt: -1 }).limit(20);
  res.json(posts);
});

app.get('/post/:id', async (req, res) => {
  const postDoc = await Post.findById(req.params.id).populate('author', ['username']);
  res.json(postDoc);
});

app.get('/has-post', (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ error: 'Unauthorized, token missing' });

  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });

    try {
      const count = await Post.countDocuments({ author: info.id });
      res.json({ hasPost: count > 0 });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
});

app.listen(4000, () => console.log("Server is running on port 4000"));
