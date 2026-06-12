# Portfolio Website

A simple and elegant portfolio website built with Node.js, Express.js, and Bootstrap.

**Live Site**: https://zachbagley.net
**Deployment**: AWS Lightsail VPS with Docker + Caddy (automatic HTTPS)
**Cost**: ~$5/month

## Current Status

✅ **DEPLOYED AND LIVE**
- Domain: zachbagley.net (via GoDaddy DNS)
- Hosting: AWS Lightsail VPS (us-west-2)
- Container Registry: AWS ECR (403894226819.dkr.ecr.us-east-1.amazonaws.com/portfolio-website)
- SSL: Automatic via Caddy
- Static IP: 54.201.223.169

## Features

- Responsive design using Bootstrap 5
- Dark, high-contrast aesthetic (SpaceX-inspired: sharp edges, vivid accent colors on black)
- Animated hero text rotator (vertical flip ticker, color-coded terms)
- Multiple pages: Home, About, Resume, Projects, Programming Portfolio, and per-project detail pages
- Dockerized application
- Automatic HTTPS with Caddy reverse proxy
- Easy to customize and extend

## Project Structure

```
portfolio-website/
├── public/
│   ├── css/
│   │   └── style.css                    # Custom CSS styles
│   ├── js/
│   │   └── rotator.js                   # Hero flip-ticker animation
│   ├── images/                          # Image assets
│   └── favicon.jpg                      # Site favicon (copy of root favicon.jpg)
├── views/
│   ├── index.html                       # Home page
│   ├── about.html                       # About page
│   ├── resume.html                      # Resume/CV page
│   ├── projects.html                    # Projects showcase page
│   ├── programming-portfolio.html       # LeetCode/algorithms portfolio
│   ├── project-detail-template.html     # Template for project detail pages
│   ├── atelier.html                     # Project detail: Atelier
│   ├── sorterra.html                    # Project detail: Sorterra
│   ├── navicomputer.html                # Project detail: navicomputer.net
│   ├── realspace.html                   # Project detail: Realspace
│   ├── intex1.html                      # Project detail: INTEX 1
│   ├── intex2.html                      # Project detail: INTEX 2
│   └── contact.html                     # Contact page (not linked - in development)
├── server.js                            # Express server
├── package.json                         # Project dependencies
├── Dockerfile                           # Docker container configuration
├── .dockerignore                        # Docker build exclusions
├── info.json                            # Personal info/resume data (not used yet)
├── LeetCodePortfolio.pdf                # Source PDF for programming portfolio
├── ZachBagley_Resume_051726.pdf         # Source PDF for resume page content
├── UPDATE_061126.md                     # June 2026 overhaul instruction document
├── README.md                            # This file
├── DESIGN_NOTES.md                      # Design decisions and aesthetic guidelines
├── DEPLOYMENT_PLAN.md                   # Original ECS+ALB deployment plan (NOT USED)
└── LIGHTSAIL_DEPLOYMENT.md              # Current Lightsail deployment guide (ACTIVE)
```

## Getting Started

### Prerequisites

- Node.js (v20 or higher)
- npm (comes with Node.js)
- Docker (for containerization)
- AWS CLI (for ECR deployment)

### Local Development (Without Docker)

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

The website will be available at `http://localhost:3000`

### Local Testing with Docker

**IMPORTANT**: Always build for AMD64 architecture (Lightsail uses x86_64, not ARM):

```bash
# Build for AMD64 (required for Lightsail deployment)
docker build --platform linux/amd64 -t portfolio-website .

# Run locally to test
docker run -p 3000:3000 portfolio-website

# Stop with Ctrl+C
```

Test at `http://localhost:3000`

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

## Deployment Workflow

**NOTE: Always deploy via ECR (never build directly on server)**

### Step 1: Build and Push to ECR

```bash
# Build for correct architecture
docker build --platform linux/amd64 -t portfolio-website .

# Authenticate to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 403894226819.dkr.ecr.us-east-1.amazonaws.com

# Tag image
docker tag portfolio-website:latest 403894226819.dkr.ecr.us-east-1.amazonaws.com/portfolio-website:latest

# Push to ECR
docker push 403894226819.dkr.ecr.us-east-1.amazonaws.com/portfolio-website:latest
```

### Step 2: Deploy to Lightsail

```bash
# SSH into Lightsail
ssh -i portfolio-key.pem ubuntu@54.201.223.169

# Authenticate Docker to ECR (on Lightsail)
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 403894226819.dkr.ecr.us-east-1.amazonaws.com

# Pull latest image
docker pull 403894226819.dkr.ecr.us-east-1.amazonaws.com/portfolio-website:latest

# Stop and remove old container
docker stop portfolio
docker rm portfolio

# Run new container
docker run -d --name portfolio --restart unless-stopped -p 3000:3000 403894226819.dkr.ecr.us-east-1.amazonaws.com/portfolio-website:latest

# Verify
docker ps
docker logs portfolio
```

Changes should be live at https://zachbagley.net within seconds.

## Deployment Details

### AWS Resources
- **ECR Repository**: `403894226819.dkr.ecr.us-east-1.amazonaws.com/portfolio-website`
- **Lightsail Instance**: `portfolio-website` (us-west-2)
- **Static IP**: `54.201.223.169`
- **Instance Plan**: $5/month (1 GB RAM, 1 vCPU, 40 GB SSD)

### Lightsail Configuration
- **OS**: Ubuntu 22.04 LTS
- **Docker**: Installed and running
- **Caddy**: Reverse proxy (handles SSL/HTTPS automatically)
- **Caddyfile Location**: `/etc/caddy/Caddyfile`
- **Container**: `portfolio` (port 3000)

### Domain Configuration
- **Domain**: zachbagley.net (managed via GoDaddy)
- **DNS**: A records pointing to 54.201.223.169
  - `@` → 54.201.223.169
  - `www` → 54.201.223.169
- **SSL**: Automatic via Let's Encrypt (through Caddy)

### Caddy Configuration
```
zachbagley.net, www.zachbagley.net {
    reverse_proxy localhost:3000
}
```

Caddy automatically:
- Obtains SSL certificates from Let's Encrypt
- Redirects HTTP to HTTPS
- Handles www and non-www versions

## Technologies Used

- **Node.js 20**: JavaScript runtime (Alpine Linux base)
- **Express.js 5**: Web framework
- **Bootstrap 5**: CSS framework for responsive design
- **HTML5/CSS3**: Markup and styling
- **Docker**: Containerization
- **Caddy**: Reverse proxy and automatic HTTPS
- **AWS ECR**: Container registry
- **AWS Lightsail**: VPS hosting

## Session History

### Session 2026-06-11
**Completed (full overhaul per UPDATE_061126.md):**
- ✅ Site-wide: favicon (favicon.jpg, served from public/), larger navbar brand (~80% of navbar height), navbar links reordered to HOME · PROJECTS · RESUME · ABOUT
- ✅ Landing page hero: subheader word "software" replaced with a vertical flip ticker cycling 7 color-coded terms on its own centered line (public/js/rotator.js + CSS); hero reduced to two buttons (VIEW PROJECTS, GET IN TOUCH → scrolls to Contact); bouncing arrow now scrolls to Featured Projects
- ✅ Featured Projects → Atelier, Sorterra, navicomputer.net: buttons removed, whole cards clickable, colored titles (orange/blue/green), repo-accurate descriptions (≤300 chars) and badges
- ✅ Projects page: GITHUB button, removed lead text, cards reordered to Atelier, Sorterra, navicomputer.net, Realspace, Programming Problems Portfolio, INTEX 2, INTEX 1 (Flowboarder/Classwork/Website v1–v2 removed); all cards clickable with colored titles
- ✅ Built 6 project detail pages from project-detail-template.html (atelier, sorterra, navicomputer, realspace, intex1, intex2) with routes in server.js; content researched from each project's GitHub repos; Demo sections left as placeholders for manual insertion
- ✅ Resume page rewritten to match ZachBagley_Resume_051726.pdf exactly (new TA title/dates, Melaleuca AI-workflows bullet, Skills & Projects restructure, Security card removed)
- ✅ Follow-ups: flip ticker moved to its own line (fixes reflow glitch), Recent Experience TA dates synced, AWS Lambda badges added to navicomputer.net cards and detail page
- ✅ New CSS utilities: vivid color palette variables, .accent-* title colors, .card-link clickable cards, .word-rotator ticker
- ✅ Tested locally with Docker; deployed via ECR → Lightsail; all routes verified live at https://zachbagley.net

**Current State:**
- Site is LIVE at https://zachbagley.net with the new dark design fully deployed
- 7 project cards on Projects page, each linking to a detail page (Programming Portfolio links to its existing page)
- Demo sections on detail pages are placeholders awaiting manual demo embeds
- Contact page still unlinked (in development)

### Session 2025-11-04
**Completed:**
- ✅ Reviewed project structure and design
- ✅ Created comprehensive deployment plan (ECS+ALB vs Lightsail)
- ✅ Chose Lightsail deployment (cost optimization: $5/mo vs $30+/mo)
- ✅ Successfully deployed to Lightsail with Caddy
- ✅ Configured zachbagley.net domain with automatic HTTPS
- ✅ Commented out Contact page links (page in development)
- ✅ Created Programming Portfolio page from LeetCodePortfolio.pdf
  - Linked Lists (LeetCode #234 - 3 solutions)
  - Binary Trees (LeetCode #100, #101, Binary Tree Visualizer)
  - Tries (LeetCode #208)
  - Graphs (BFS implementation)
  - Other problems (LeetCode #14, #241, #88, #13, #9, #169)
- ✅ Added route `/programming-portfolio` to server.js
- ✅ Linked from Projects page (NOT in navbar per user request)
- ✅ Established ECR deployment workflow as standard practice
- ✅ Updated all documentation files

**Current State:**
- Site is LIVE at https://zachbagley.net
- All pages functional except Contact (intentionally not linked)
- Programming Portfolio displays all LeetCode solutions with proper formatting
- Docker images stored in ECR for deployment
- Lightsail VPS running with Caddy handling HTTPS

## License

ISC
