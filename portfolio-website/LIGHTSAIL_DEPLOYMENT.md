# AWS Lightsail Deployment Guide
## Portfolio Website on Lightsail VPS

**Cost: $5/month** (compared to $28-32/month for ECS+ALB)
**Status: ✅ ACTIVE - Site deployed and live at https://zachbagley.net**

---

## Current Deployment Details

**Live Site**: https://zachbagley.net
**Static IP**: 54.201.223.169
**ECR Repository**: 403894226819.dkr.ecr.us-east-1.amazonaws.com/portfolio-website
**Instance**: portfolio-website (us-west-2, $5/month plan)
**Last Updated**: 2025-11-04

---

## Overview

This guide documents the deployment of the containerized portfolio website to AWS Lightsail using a VPS approach. The project uses **ECR as the deployment method** (not building on server).

### What You'll Get:
- ✅ Static IP address (never changes)
- ✅ Custom domain (zachbagley.net)
- ✅ Automatic HTTPS/SSL with Caddy
- ✅ Your Docker container running 24/7
- ✅ Full control over the server
- ✅ **Only $3.50-5/month**

### Architecture:
```
Internet → zachbagley.net (DNS)
    ↓
Static IP (Lightsail)
    ↓
Caddy Web Server (reverse proxy + automatic HTTPS)
    ↓
Docker Container (your Node.js app on port 3000)
```

---

## Phase 1: Create Lightsail Instance

### 1.1 Create the Instance

1. **Go to AWS Lightsail Console**: https://lightsail.aws.amazon.com/
2. Click **"Create instance"**
3. **Select instance location**:
   - Choose region closest to you (e.g., N. Virginia - us-east-1)
4. **Pick your instance image**:
   - Platform: **Linux/Unix**
   - Blueprint: **OS Only** → **Ubuntu 22.04 LTS**
5. **Choose your instance plan**:
   - **$3.50/month**: 512 MB RAM, 1 vCPU, 20 GB SSD (sufficient for portfolio)
   - **$5/month**: 1 GB RAM, 1 vCPU, 40 GB SSD (recommended for headroom)
6. **Name your instance**: `portfolio-website`
7. Click **"Create instance"**

### 1.2 Wait for Instance to Start
- Status will change from "Pending" to "Running" (takes ~1 minute)
- Note the **public IP address** (e.g., 54.123.45.67)

### 1.3 Create Static IP (Important!)

1. In Lightsail console, click **"Networking"** tab
2. Click **"Create static IP"**
3. **Attach to instance**: Select `portfolio-website`
4. **Name**: `portfolio-static-ip`
5. Click **"Create"**
6. **Note the static IP address** - this is what you'll point your domain to

---

## Phase 2: Configure Firewall

### 2.1 Open Required Ports

1. Click on your instance (`portfolio-website`)
2. Go to **"Networking"** tab
3. Under **"Firewall"**, add these rules:
   - **SSH**: TCP, Port 22 (already exists)
   - **HTTP**: TCP, Port 80 (click "Add rule" if not exists)
   - **HTTPS**: TCP, Port 443 (click "Add rule")

**Result**: Should have 3 rules total (SSH, HTTP, HTTPS)

---

## Phase 3: Connect and Set Up Server

### 3.1 Connect via SSH

**Option A: Browser-based SSH (easiest)**
1. In Lightsail console, click **"Connect using SSH"** button
2. A terminal window opens in your browser

**Option B: SSH from your terminal**
1. Download SSH key from Lightsail console
2. Run: `ssh -i /path/to/key.pem ubuntu@<your-static-ip>`

### 3.2 Update System

```bash
# Update package lists
sudo apt update

# Upgrade installed packages
sudo apt upgrade -y
```

### 3.3 Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add your user to docker group (so you don't need sudo)
sudo usermod -aG docker ubuntu

# Start Docker service
sudo systemctl enable docker
sudo systemctl start docker

# Log out and back in for group changes to take effect
exit
```

**Reconnect to SSH after running `exit`**

Verify Docker is working:
```bash
docker --version
docker ps
```

### 3.4 Install Caddy (for automatic HTTPS)

Caddy is a web server that automatically handles SSL certificates from Let's Encrypt.

```bash
# Install Caddy
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy -y

# Verify Caddy is running
sudo systemctl status caddy
```

---

## Phase 4: Deploy Your Docker Container

**NOTE: ALWAYS USE ECR (Option A) - This is the standard deployment method**

### 4.1 Option A: Pull from ECR (PREFERRED METHOD)

```bash
# Install AWS CLI
sudo apt install awscli -y

# Configure AWS credentials
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Enter region (e.g., us-east-1)
# Press enter for output format

# Login to ECR
aws ecr get-login-password --region <your-region> | docker login --username AWS --password-stdin <account-id>.dkr.ecr.<your-region>.amazonaws.com

# Pull your image
docker pull <account-id>.dkr.ecr.<your-region>.amazonaws.com/portfolio-website:latest

# Run the container
docker run -d \
  --name portfolio \
  --restart unless-stopped \
  -p 3000:3000 \
  <account-id>.dkr.ecr.<your-region>.amazonaws.com/portfolio-website:latest
```

### 4.2 Option B: Build on Server (NOT RECOMMENDED - DO NOT USE)

**NOTE: User preference is to ALWAYS use ECR. Skip this option.**

This option is documented for reference but should not be used for this project.

### 4.3 Verify Container is Running

```bash
# Check container status
docker ps

# View logs
docker logs portfolio

# Test locally
curl http://localhost:3000
```

You should see your HTML output!

---

## Phase 5: Configure Caddy for HTTPS

### 5.1 Create Caddyfile

```bash
# Create Caddyfile
sudo nano /etc/caddy/Caddyfile
```

### 5.2 Add This Configuration

**Replace `zachbagley.net` with your actual domain:**

```
zachbagley.net, www.zachbagley.net {
    reverse_proxy localhost:3000
}
```

**What this does:**
- Automatically gets SSL certificate from Let's Encrypt
- Redirects HTTP to HTTPS automatically
- Proxies all traffic to your Docker container on port 3000
- Handles both www and non-www versions

**Save and exit**: Press `Ctrl+X`, then `Y`, then `Enter`

### 5.3 Reload Caddy

```bash
# Reload Caddy configuration
sudo systemctl reload caddy

# Check Caddy status
sudo systemctl status caddy

# View Caddy logs (if issues)
sudo journalctl -u caddy -f
```

---

## Phase 6: Configure Domain (GoDaddy)

### 6.1 Update DNS Records in GoDaddy

1. **Log in to GoDaddy**: https://www.godaddy.com
2. Go to **My Products** → **DNS** for `zachbagley.net`
3. **Add/Edit A Records**:

   **Record 1 (root domain):**
   - Type: `A`
   - Name: `@`
   - Value: `<your-lightsail-static-ip>`
   - TTL: `600` (10 minutes)

   **Record 2 (www subdomain):**
   - Type: `A`
   - Name: `www`
   - Value: `<your-lightsail-static-ip>`
   - TTL: `600`

4. **Save** changes

### 6.2 Wait for DNS Propagation

- Typically takes **5-30 minutes** (can take up to 48 hours)
- Check propagation: https://www.whatsmydns.net/

Test in terminal:
```bash
# Check if DNS is resolving
dig zachbagley.net
dig www.zachbagley.net
```

### 6.3 Test Your Website

Once DNS propagates:
- Visit: http://zachbagley.net (should auto-redirect to HTTPS)
- Visit: https://zachbagley.net (should work!)
- Visit: https://www.zachbagley.net (should work!)

**Caddy will automatically obtain SSL certificate when it receives the first HTTPS request!**

---

## Phase 7: Verify Everything Works

### 7.1 Check SSL Certificate

Visit: https://www.ssllabs.com/ssltest/analyze.html?d=zachbagley.net

Should get an **A or A+ rating**!

### 7.2 Test All Pages

- https://zachbagley.net/ (Home)
- https://zachbagley.net/about
- https://zachbagley.net/resume
- https://zachbagley.net/projects
- https://zachbagley.net/contact

### 7.3 Verify Container Auto-Restart

```bash
# Stop the container
docker stop portfolio

# Wait 10 seconds
sleep 10

# Check if it restarted
docker ps
```

Should see it running (because of `--restart unless-stopped` flag)

---

## Phase 8: Maintenance & Updates

### 8.1 Update Your Website (Future Updates)

**Method 1: Pull new image from ECR**
```bash
# SSH into Lightsail
ssh ubuntu@<static-ip>

# Pull new image
aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <account>.dkr.ecr.<region>.amazonaws.com
docker pull <account>.dkr.ecr.<region>.amazonaws.com/portfolio-website:latest

# Stop old container
docker stop portfolio
docker rm portfolio

# Run new container
docker run -d --name portfolio --restart unless-stopped -p 3000:3000 <ecr-uri>:latest
```

**Method 2: Rebuild on server**
```bash
# SSH into Lightsail
ssh ubuntu@<static-ip>

# Pull latest code
cd ~/portfolio-website
git pull

# Rebuild image
docker build -t portfolio-website .

# Stop old container
docker stop portfolio
docker rm portfolio

# Run new container
docker run -d --name portfolio --restart unless-stopped -p 3000:3000 portfolio-website:latest
```

### 8.2 View Logs

```bash
# Container logs
docker logs portfolio
docker logs -f portfolio  # Follow logs in real-time

# Caddy logs
sudo journalctl -u caddy -f

# System logs
sudo journalctl -xe
```

### 8.3 Monitor Resources

```bash
# Check disk space
df -h

# Check memory usage
free -h

# Check running containers
docker ps

# Check Docker resource usage
docker stats
```

### 8.4 Backup (Optional)

**Create Lightsail snapshot:**
1. In Lightsail console
2. Click on your instance
3. Go to **"Snapshots"** tab
4. Click **"Create snapshot"**
5. Free for first 5 GB!

---

## Troubleshooting

### Website Not Loading

**Check 1: Is Docker container running?**
```bash
docker ps
```
If not listed:
```bash
docker logs portfolio  # Check for errors
docker start portfolio  # Try starting it
```

**Check 2: Is Caddy running?**
```bash
sudo systemctl status caddy
```
If not running:
```bash
sudo systemctl start caddy
sudo journalctl -u caddy -f  # Check logs
```

**Check 3: Is DNS resolving?**
```bash
dig zachbagley.net
```
Should show your Lightsail static IP.

**Check 4: Firewall ports open?**
- Check Lightsail console → Networking → Firewall
- Should have ports 80 and 443 open

### SSL Certificate Not Working

**Check 1: DNS must be pointing to your server**
- Caddy can only get SSL cert if DNS is correct
- Verify: `dig zachbagley.net` shows your IP

**Check 2: Check Caddy logs**
```bash
sudo journalctl -u caddy -f
```

**Check 3: Verify Caddyfile syntax**
```bash
sudo caddy validate --config /etc/caddy/Caddyfile
```

### Container Crashes

**Check logs:**
```bash
docker logs portfolio
```

**Common issues:**
- Port 3000 already in use
- Application error in code
- Out of memory (upgrade to $5 plan)

**Restart container:**
```bash
docker restart portfolio
```

### Out of Disk Space

```bash
# Remove old Docker images
docker image prune -a

# Remove old containers
docker container prune

# Check space
df -h
```

---

## Cost Breakdown

### Monthly Costs:
- **Lightsail VPS**: $3.50 or $5/month
- **Static IP**: Free (while attached to instance)
- **SSL Certificate**: Free (Let's Encrypt via Caddy)
- **Data Transfer**: 1 TB included in Lightsail price
- **Snapshots**: First 5 GB free

**Total: $3.50-5/month** 🎉

### Comparison:
| Solution | Cost |
|----------|------|
| **Lightsail VPS** | **$3.50-5** ✅ |
| ECS + ALB | $28-32 |
| App Runner | $5-10 |
| Lightsail Containers | $7 |

---

## Quick Reference Commands

```bash
# SSH into server
ssh ubuntu@<static-ip>

# Check container status
docker ps

# View container logs
docker logs portfolio

# Restart container
docker restart portfolio

# Stop container
docker stop portfolio

# Start container
docker start portfolio

# Remove container (to redeploy)
docker stop portfolio && docker rm portfolio

# Rebuild and redeploy
cd ~/portfolio-website
git pull
docker build -t portfolio-website .
docker stop portfolio && docker rm portfolio
docker run -d --name portfolio --restart unless-stopped -p 3000:3000 portfolio-website:latest

# Check Caddy status
sudo systemctl status caddy

# Reload Caddy config
sudo systemctl reload caddy

# View Caddy logs
sudo journalctl -u caddy -f

# Check disk space
df -h

# Check memory
free -h
```

---

## Security Best Practices

### 1. Keep System Updated
```bash
# Run monthly
sudo apt update && sudo apt upgrade -y
```

### 2. Enable Automatic Security Updates
```bash
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

### 3. Configure SSH Key-Only Access (Disable Password)
```bash
sudo nano /etc/ssh/sshd_config
# Set: PasswordAuthentication no
sudo systemctl restart ssh
```

### 4. Monitor Failed Login Attempts
```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
```

---

## Next Steps After Deployment

- [ ] Test all pages on mobile and desktop
- [ ] Update placeholder links in projects
- [ ] Add actual project images to `/public/images/`
- [ ] Set up monitoring (optional: use Uptime Robot - free)
- [ ] Create Lightsail snapshot (backup)
- [ ] Set up AWS Budgets alert (AWS Console → Billing)

---

## Additional Resources

- **Lightsail Docs**: https://docs.aws.amazon.com/lightsail/
- **Caddy Docs**: https://caddyserver.com/docs/
- **Docker Docs**: https://docs.docker.com/
- **Let's Encrypt**: https://letsencrypt.org/

---

## Standard Deployment Workflow (ECR Method)

### For Future Updates:

**On Local Machine:**
```bash
# 1. Build for AMD64 architecture
docker build --platform linux/amd64 -t portfolio-website .

# 2. Authenticate to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 403894226819.dkr.ecr.us-east-1.amazonaws.com

# 3. Tag image
docker tag portfolio-website:latest 403894226819.dkr.ecr.us-east-1.amazonaws.com/portfolio-website:latest

# 4. Push to ECR
docker push 403894226819.dkr.ecr.us-east-1.amazonaws.com/portfolio-website:latest
```

**On Lightsail Server:**
```bash
# 1. SSH into server
ssh -i ../portfolio-key.pem ubuntu@54.201.223.169

# 2. Authenticate to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 403894226819.dkr.ecr.us-east-1.amazonaws.com

# 3. Pull latest image
docker pull 403894226819.dkr.ecr.us-east-1.amazonaws.com/portfolio-website:latest

# 4. Stop and remove old container
docker stop portfolio
docker rm portfolio

# 5. Run new container
docker run -d --name portfolio --restart unless-stopped -p 3000:3000 403894226819.dkr.ecr.us-east-1.amazonaws.com/portfolio-website:latest

# 6. Verify
docker ps
docker logs portfolio
```

**Changes are live immediately at https://zachbagley.net**

---

## Session History

### 2025-11-04 - Initial Deployment and Programming Portfolio
**Completed:**
- ✅ Deployed website to Lightsail
- ✅ Configured Caddy for automatic HTTPS
- ✅ Connected zachbagley.net domain
- ✅ Established ECR workflow as standard
- ✅ Added programming portfolio page with LeetCode solutions
- ✅ Commented out Contact page links (in development)
- ✅ Updated all documentation

**Current Pages:**
- Home (index.html)
- About (about.html)
- Resume (resume.html)
- Projects (projects.html)
- Programming Portfolio (programming-portfolio.html) - Linked from Projects page
- Contact (contact.html) - Not linked, in development

---

**Last Updated**: 2025-11-04
**Deployment Status**: ✅ LIVE AND OPERATIONAL
**Site**: https://zachbagley.net
