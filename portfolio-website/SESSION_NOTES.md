# Session Notes and History

This file tracks important session information and decisions for future reference.

---

## Session 2025-11-04: Initial Deployment & Programming Portfolio

### Session Goals Accomplished
1. ✅ Reviewed entire project codebase
2. ✅ Evaluated deployment options (ECS+ALB vs Lightsail)
3. ✅ Successfully deployed to AWS Lightsail
4. ✅ Connected custom domain zachbagley.net
5. ✅ Created Programming Portfolio page
6. ✅ Established ECR deployment workflow
7. ✅ Updated all documentation

### Key Decisions Made

#### Deployment Architecture
- **Chose**: AWS Lightsail VPS ($5/month)
- **Rejected**: AWS ECS + ALB ($28-32/month) - too expensive for portfolio site
- **Rationale**: Lightsail provides all needed features at 85% lower cost

#### Deployment Method
- **Standard Practice**: Always deploy via ECR (never build directly on server)
- **Reason**: User preference for consistent, version-controlled deployments
- **ECR Repository**: 403894226819.dkr.ecr.us-east-1.amazonaws.com/portfolio-website

#### Site Structure Changes
- **Added**: `/programming-portfolio` route and page
- **Removed**: Contact page links from navigation (page in development)
- **Source**: Programming portfolio created from LeetCodePortfolio.pdf

### Technical Configuration

#### Lightsail Instance
- **Region**: us-west-2
- **Plan**: $5/month (1 GB RAM, 1 vCPU, 40 GB SSD)
- **OS**: Ubuntu 22.04 LTS
- **Static IP**: 54.201.223.169
- **SSH Key**: ../portfolio-key.pem

#### Domain Configuration
- **Domain**: zachbagley.net (via GoDaddy)
- **DNS**: A records pointing to 54.201.223.169
  - @ → 54.201.223.169
  - www → 54.201.223.169
- **SSL**: Automatic via Caddy + Let's Encrypt

#### Container Setup
- **Container Name**: portfolio
- **Port**: 3000
- **Restart Policy**: unless-stopped
- **Reverse Proxy**: Caddy (handles HTTPS automatically)

#### Caddy Configuration
Location: `/etc/caddy/Caddyfile`
```
zachbagley.net, www.zachbagley.net {
    reverse_proxy localhost:3000
}
```

### Content Added

#### Programming Portfolio Page
**File**: `views/programming-portfolio.html`
**Route**: `/programming-portfolio`
**Linked From**: Projects page (NOT in main navigation)

**Content Includes**:
- **Linked Lists**: LeetCode #234 (3 different solutions with analysis)
- **Binary Trees**: LeetCode #100, #101, Binary Tree Visualizer with full implementation
- **Tries**: LeetCode #208 (Trie implementation)
- **Graphs**: BFS implementation with traverse and search methods
- **Other Problems**: LeetCode #14, #241, #88, #13, #9, #169

**Styling**: Matches site aesthetic (earth tones, black borders, code blocks with proper formatting)

### Files Modified

#### New Files Created
1. `Dockerfile` - Alpine-based Node.js 20 container
2. `.dockerignore` - Build exclusions
3. `views/programming-portfolio.html` - LeetCode solutions page
4. `DEPLOYMENT_PLAN.md` - ECS+ALB plan (not used, kept for reference)
5. `LIGHTSAIL_DEPLOYMENT.md` - Active deployment guide
6. `SESSION_NOTES.md` - This file

#### Files Updated
1. `server.js` - Added `/programming-portfolio` route
2. `views/index.html` - Commented out Contact link in nav + Quick Links card
3. `views/about.html` - Commented out Contact link in nav
4. `views/resume.html` - Commented out Contact link in nav
5. `views/projects.html` - Commented out Contact link in nav, added "View Portfolio" button to Programming Problems card
6. `README.md` - Complete rewrite with deployment info, session history
7. `DESIGN_NOTES.md` - Updated with current implementation status
8. `LIGHTSAIL_DEPLOYMENT.md` - Added ECR workflow, session history
9. `DEPLOYMENT_PLAN.md` - Added warning that it's not being used

### Standard Deployment Workflow

This is the established pattern for all future deployments:

#### On Local Machine:
```bash
# 1. Build for AMD64 (Lightsail architecture - NOT ARM)
docker build --platform linux/amd64 -t portfolio-website .

# 2. Test locally (optional but recommended)
docker run -p 3000:3000 portfolio-website
# Test at http://localhost:3000
# Stop with Ctrl+C

# 3. Authenticate to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 403894226819.dkr.ecr.us-east-1.amazonaws.com

# 4. Tag image
docker tag portfolio-website:latest 403894226819.dkr.ecr.us-east-1.amazonaws.com/portfolio-website:latest

# 5. Push to ECR
docker push 403894226819.dkr.ecr.us-east-1.amazonaws.com/portfolio-website:latest
```

#### On Lightsail Server:
```bash
# 1. SSH into server
ssh -i ../portfolio-key.pem ubuntu@54.201.223.169

# 2. Authenticate to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 403894226819.dkr.ecr.us-east-1.amazonaws.com

# 3. Pull latest image
docker pull 403894226819.dkr.ecr.us-east-1.amazonaws.com/portfolio-website:latest

# 4. Stop old container
docker stop portfolio

# 5. Remove old container
docker rm portfolio

# 6. Run new container
docker run -d --name portfolio --restart unless-stopped -p 3000:3000 403894226819.dkr.ecr.us-east-1.amazonaws.com/portfolio-website:latest

# 7. Verify
docker ps
docker logs portfolio

# 8. Exit SSH
exit
```

**Result**: Changes live at https://zachbagley.net within seconds

### Important Notes for Future Sessions

#### Architecture Requirements
- **ALWAYS build with `--platform linux/amd64`** (Mac is ARM64, Lightsail is AMD64)
- ECR authentication tokens expire after 12 hours - re-authenticate if push fails
- Container name must be exactly `portfolio` (matches Caddy and restart scripts)

#### Deployment Preferences
- ✅ **ALWAYS** deploy via ECR
- ❌ **NEVER** build directly on Lightsail server
- ✅ Test locally with Docker before pushing to production

#### Site Status
- **Live Pages**: Home, About, Resume, Projects, Programming Portfolio
- **Not Linked**: Contact page (exists but intentionally not in navigation - in development)
- **Future Work**: Contact form backend, project screenshots, additional LeetCode solutions

#### SSH Access
- **Key Location**: `../portfolio-key.pem` (one directory up from project)
- **Permissions**: Must be 400 (`chmod 400 ../portfolio-key.pem`)
- **Command**: `ssh -i ../portfolio-key.pem ubuntu@54.201.223.169`

#### Useful Commands on Server
```bash
# Check container status
docker ps

# View logs
docker logs portfolio
docker logs -f portfolio  # Follow in real-time

# Restart container
docker restart portfolio

# Check Caddy status
sudo systemctl status caddy

# Reload Caddy config (if Caddyfile changes)
sudo systemctl reload caddy

# View Caddy logs
sudo journalctl -u caddy -f
```

### Cost Breakdown
- **Lightsail VPS**: $5/month
- **ECR Storage**: $0/month (under 500 MB free tier)
- **Domain (GoDaddy)**: Separate/existing cost
- **SSL Certificate**: $0 (Let's Encrypt via Caddy)
- **Total AWS Cost**: ~$5/month

### Next Steps / TODO
- [ ] Deploy programming portfolio to live site (push to ECR and deploy)
- [ ] Add actual project screenshots to `/public/images/`
- [ ] Replace [TBA] placeholder links on projects page
- [ ] Implement contact form backend when ready
- [ ] Consider adding more LeetCode solutions to portfolio
- [ ] Test site on mobile devices
- [ ] Set up monitoring/uptime checks (optional)

---

## Future Session Template

When starting a new session, consider documenting:
- Date and session goals
- Changes made to code
- New pages or features added
- Deployment performed (yes/no)
- Any configuration changes
- Problems encountered and solutions
- Updated deployment workflow (if changed)
- Cost implications
- Next session priorities

---

**Last Updated**: 2025-11-04
**Live Site**: https://zachbagley.net
**Status**: ✅ Fully Deployed and Operational
