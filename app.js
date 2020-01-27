const bodyParser = require('body-parser'),
    express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    methodOverride = require('method-override'),
    expressSanitizer = require('express-sanitizer'),
    HTTP_PORT = process.env.PORT || 8080;

    
//  APP CONFIG
mongoose.connect('mongodb+srv:alexpetro:lutfulsucks@cluster0-pelgh.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
// mongodb+srv://alexpetro:lutfulsucks@cluster0-pelgh.mongodb.net/test?retryWrites=true&w=majority
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(methodOverride('_method'));
app.use(expressSanitizer());

//  MONGOOSE / MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {
        type: Date,
        default: Date.now
    }
})
var Blog = mongoose.model('Blog', blogSchema);

//  RESTFUL ROUTES
app.get('/', (req, res) => {
    res.redirect('/blogs');
})

//  INDEX ROUTE
app.get('/blogs', (req, res) => {
    Blog.find({}, function (err, blogs) {
        if (err) {
            res.send(err);
        } else {
            res.render('index', {
                blogs: blogs
            });
        }
    })
});

//  NEW ROUTE
app.get('/blogs/new', (req, res) => {
    res.render('new');
})

//  CREATE ROUTE
app.post('/blogs', (req, res) => {
    //  create blog

    //  Santize so that nothing like script tags can be used within the textarea of the blog post
    //  for example, including an alert function call in a blog post
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function (err, newBlog) {
        if (err) {
            res.render('new');
        } else {
            res.redirect('/blogs');
        }
    });
})

//  SHOW ROUTE
app.get('/blogs/:id', (req, res) => {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            res.redirect('/blogs');
        } else {
            res.render('show', {
                blog: foundBlog
            });
        }
    })
})

//  EDIT ROUTE
app.get('/blogs/:id/edit', (req, res) => {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            res.redirect('/blogs');
        } else {
            res.render('edit', {
                blog: foundBlog
            });
        }
    })
});

//  UPDATE ROUTE
app.put('/blogs/:id', (req, res) => {
    //  Santize so that nothing like script tags can be used within the textarea of the blog post
    //  for example, including an alert function call in a blog post
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, updatedBlog) {
        if (err) {
            res.redirect('/blogs');
        } else {
            res.redirect('/blogs/' + req.params.id);
        }
    });
});

//  DELETE ROUTE
app.delete('/blogs/:id', (req, res) => {
    Blog.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect('/blogs');
        } else {
            res.redirect('/blogs');
        }
    });
});

app.listen(HTTP_PORT, function () {
    console.log('Server up and running!');
})