const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

// Serve HTML files directly
app.engine('html', require('fs').readFile);

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

app.get('/resume', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'resume.html'));
});

app.get('/projects', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'projects.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'contact.html'));
});

app.get('/programming-portfolio', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'programming-portfolio.html'));
});

app.get('/atelier', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'atelier.html'));
});

app.get('/sorterra', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'sorterra.html'));
});

app.get('/navicomputer', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'navicomputer.html'));
});

app.get('/realspace', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'realspace.html'));
});

app.get('/intex1', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'intex1.html'));
});

app.get('/intex2', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'intex2.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
