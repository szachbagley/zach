# Portfolio Website - Design Notes

## Project Overview
A personal portfolio website built with Node.js, Express.js, and Bootstrap with a unique aesthetic.

## Design Philosophy & Aesthetic

### Color Scheme
- **Background:** Tan/beige (#D4C4B0) - warm, neutral tone
- **Earth tone palette throughout:**
  - Terracotta (#D4A59A) - warm clay/pink
  - Sage (#A8B5A0) - muted green
  - Sand (#E8D5B7) - warm cream
  - Moss (#8B9D83) - darker green
  - Clay (#B8927D) - brown/tan
  - Stone (#C4B5A0) - gray-brown
  - Mint (#B5C9B4) - soft green

**Important:** NO bright pastel colors. Keep everything calm and earthy.

### Typography
- **Font family:** Arial, Helvetica, sans-serif (basic, clean fonts)
- **NO retro/pixel fonts** (previously removed Press Start 2P and VT323)
- Keep fonts simple and readable

### Visual Style
- **Black borders (3-5px)** on all major elements
- **Straight corners everywhere** (border-radius: 0)
- **Retro drop shadows** (4px 4px 0px black)
- **No smooth transitions** - instant state changes
- **Button press effect** - buttons move when clicked/hovered

## Home Page Layout

### Structure
- **NO hero section** - removed in favor of card-based layout
- Card grid layout on tan background
- Multiple cards with varying content

### Cards Present
1. **Large Personal Info Card** (col-lg-6)
   - Name, location, role, email, status
   - Personal introduction
   - Terracotta background

2. **Education Card** (col-lg-6)
   - Degree information
   - University and dates
   - Link to full resume

3. **Experience Card** (col-lg-6)
   - Current job role
   - Company and timeline
   - Link to full experience

4. **Latest Project Card** (col-lg-6)
   - Recent work showcase
   - Tech stack badges
   - Link to all projects

5. **Tech Stack Card** (col-lg-4)
   - Skills as badges
   - Stone-colored badges

6. **Quick Links Card** (col-lg-4)
   - Navigation buttons
   - Projects, About, Contact links

7. **Fun Fact Card** (col-lg-4)
   - Personal touch
   - Sand background
   - Emoji: 🎮

## Other Pages
- **About:** Background, education, experience details
- **Projects:** Project showcase with 6 sample projects
- **Contact:** Contact form and information

## Navigation
- Clay brown background
- Sand-colored text shadow on brand
- Black borders on active/hover states

## Footer
- Clay brown background
- Simple copyright text

## Technical Stack
- **Backend:** Node.js with Express.js
- **Frontend:** Bootstrap 5
- **Styling:** Custom CSS with CSS variables
- **Port:** 3000 (configurable via environment)

## File Structure
```
portfolio-website/
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   └── images/
├── views/
│   ├── index.html
│   ├── about.html
│   ├── projects.html
│   └── contact.html
├── server.js
├── package.json
└── README.md
```

## Running the Project
```bash
cd portfolio-website
npm start
# Visit http://localhost:3000
```

## Design Preferences (Key Decisions Made)
1. ❌ No hero section on home page
2. ✅ Card-based layout instead
3. ❌ No bright pastel colors
4. ✅ Calming earth tones only
5. ❌ No retro/pixel fonts
6. ✅ Basic Arial/Helvetica throughout
7. ✅ Tan background (not yellow-beige)
8. ✅ Black borders and straight corners everywhere
9. ✅ Retro drop shadow effects maintained

## Future Customization Areas
- Replace placeholder text with real personal information
- Add actual project details and links
- Add profile photo/images
- Implement contact form backend functionality
- Add your actual education and work experience
- Update social media links

## Notes for Future Development
- The aesthetic is intentionally minimalist and clean
- Earth tones should remain calming and professional
- Keep fonts basic - avoid decorative or retro styles
- Maintain the card-based home page layout
- All corners must remain square (no rounding)
