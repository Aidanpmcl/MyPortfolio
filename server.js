const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure Handlebars
app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts/'),
  partialsDir: path.join(__dirname, 'views/partials/')
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes - support both paths for flexibility
app.get(['/', '/index.html'], (req, res) => {
  res.render('home', {
    title: 'Home',
    isHome: true
  });
});

app.get(['/about', '/about.html'], (req, res) => {
  res.render('about', {
    title: 'About',
    isAbout: true
  });
});

app.get(['/projects', '/projects.html'], (req, res) => {
  res.render('projects', {
    title: 'Projects',
    isProjects: true
  });
});

app.get(['/contact', '/contact.html'], (req, res) => {
  res.render('contact', {
    title: 'Contact',
    isContact: true
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('home', {
    title: '404 - Not Found',
    isHome: true
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Press Ctrl+C to stop the server');
});

