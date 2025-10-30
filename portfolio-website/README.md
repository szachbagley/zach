# Portfolio Website

A simple and elegant portfolio website built with Node.js, Express.js, and Bootstrap.

## Features

- Responsive design using Bootstrap 5
- Clean and modern UI
- Multiple pages: Home, About, Projects, Contact
- Easy to customize and extend

## Project Structure

```
portfolio-website/
├── public/
│   ├── css/
│   │   └── style.css          # Custom CSS styles
│   ├── js/                    # JavaScript files (add as needed)
│   └── images/                # Image assets
├── views/
│   ├── index.html             # Home page
│   ├── about.html             # About page
│   ├── projects.html          # Projects page
│   └── contact.html           # Contact page
├── server.js                  # Express server
├── package.json               # Project dependencies
└── README.md                  # This file
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. Navigate to the project directory:
```bash
cd portfolio-website
```

2. Install dependencies (already done):
```bash
npm install
```

### Running the Application

Start the server:
```bash
npm start
```

The website will be available at `http://localhost:3000`

## Customization

### Update Content

1. **Personal Information**: Edit the HTML files in the `views/` directory to add your own information
2. **Projects**: Update `views/projects.html` with your actual projects
3. **Styling**: Modify `public/css/style.css` to change colors, fonts, and layout
4. **Images**: Add your images to `public/images/` and reference them in your HTML

### Change Colors

The main theme color is defined in `public/css/style.css`. Look for the color values like `#667eea` and `#764ba2` to customize the color scheme.

### Add More Pages

1. Create a new HTML file in the `views/` directory
2. Add a route in `server.js`:
```javascript
app.get('/your-page', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'your-page.html'));
});
```
3. Update the navigation in all HTML files to include the new page

## Technologies Used

- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **Bootstrap 5**: CSS framework for responsive design
- **HTML5/CSS3**: Markup and styling

## License

ISC
