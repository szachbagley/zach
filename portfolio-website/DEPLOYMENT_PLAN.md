# Portfolio Website Deployment Plan
## Goal: Deploy to AWS ECS and connect to zachbagley.net

---

## Phase 1: Dockerization
### 1.1 Create Docker Configuration
- [ ] Create `Dockerfile` for Node.js application
- [ ] Create `.dockerignore` file to exclude unnecessary files
- [ ] Test Docker build locally
- [ ] Test Docker container runs locally on port 3000
- [ ] Verify all routes work in containerized environment

### 1.2 Optimize Docker Image
- [ ] Use multi-stage build if needed
- [ ] Minimize image size
- [ ] Ensure proper NODE_ENV configuration

---

## Phase 2: AWS Elastic Container Registry (ECR)
### 2.1 Set Up ECR Repository
- [ ] Create ECR repository named `portfolio-website`
- [ ] Note the repository URI
- [ ] Configure repository policies if needed

### 2.2 Push Image to ECR
- [ ] Authenticate Docker to ECR
- [ ] Tag Docker image with ECR repository URI
- [ ] Push image to ECR
- [ ] Verify image is available in ECR console

---

## Phase 3: AWS Infrastructure Setup
### 3.1 VPC and Networking
- [ ] Create or identify existing VPC
- [ ] Ensure at least 2 public subnets in different AZs
- [ ] Create Security Group for ALB (allow 80, 443 inbound)
- [ ] Create Security Group for ECS tasks (allow traffic from ALB)
- [ ] Configure Internet Gateway (if not exists)

### 3.2 Application Load Balancer (ALB)
- [ ] Create Application Load Balancer
- [ ] Configure ALB in public subnets
- [ ] Attach Security Group to ALB
- [ ] Create Target Group (target type: IP, port 3000)
- [ ] Configure health check path (/) with proper settings
- [ ] Note ALB DNS name

### 3.3 SSL/TLS Certificate
- [ ] Request SSL certificate via AWS Certificate Manager (ACM)
- [ ] Request for `zachbagley.net` and `www.zachbagley.net`
- [ ] Validate certificate (DNS validation recommended)
- [ ] Wait for certificate status to be "Issued"

### 3.4 ALB Listener Configuration
- [ ] Create HTTP listener (port 80) - redirect to HTTPS
- [ ] Create HTTPS listener (port 443) with ACM certificate
- [ ] Configure listener to forward to Target Group

---

## Phase 4: ECS Cluster Setup
### 4.1 Create ECS Cluster
- [ ] Create ECS Cluster (Fargate launch type)
- [ ] Name: `portfolio-cluster` or similar
- [ ] Enable Container Insights (optional, for monitoring)

### 4.2 Create Task Definition
- [ ] Create Task Definition (Fargate)
- [ ] Name: `portfolio-task`
- [ ] Configure task role and execution role (create if needed)
- [ ] Set task memory: 512 MB (or adjust as needed)
- [ ] Set task CPU: 256 (0.25 vCPU) (or adjust as needed)
- [ ] Add container definition:
  - Container name: `portfolio-container`
  - Image: ECR repository URI with tag
  - Port mapping: 3000
  - Environment variables (if needed)
  - CloudWatch log configuration

### 4.3 Create ECS Service
- [ ] Create Service in the cluster
- [ ] Service name: `portfolio-service`
- [ ] Launch type: Fargate
- [ ] Task Definition: Select the created task definition
- [ ] Number of tasks: 1 (can scale later)
- [ ] Select VPC and subnets (use public subnets)
- [ ] Attach Security Group for ECS tasks
- [ ] Configure Load Balancer:
  - Type: Application Load Balancer
  - Select the ALB created earlier
  - Container to load balance: portfolio-container:3000
  - Target group: Select created target group
- [ ] Enable auto-assign public IP (if using public subnets without NAT)
- [ ] Configure service auto-scaling (optional)

### 4.4 Verify ECS Deployment
- [ ] Check service is running
- [ ] Verify tasks are healthy
- [ ] Check target group shows healthy targets
- [ ] Test ALB DNS name in browser (HTTP and HTTPS)

---

## Phase 5: Domain Configuration (GoDaddy + AWS)
### Option A: Use Route 53 for DNS (Recommended)
- [ ] Create Route 53 Hosted Zone for `zachbagley.net`
- [ ] Note the Route 53 nameservers
- [ ] Update GoDaddy nameservers to Route 53 nameservers
- [ ] Create A record (Alias) pointing to ALB
- [ ] Create A record for www (Alias) pointing to ALB
- [ ] Wait for DNS propagation (can take up to 48 hours, usually faster)

### Option B: Keep GoDaddy DNS
- [ ] In GoDaddy DNS settings, create A record
- [ ] Point `@` (root domain) to ALB IP address (not recommended - ALB IPs change)
- [ ] Better: Create CNAME for www pointing to ALB DNS name
- [ ] Note: Root domain CNAME not supported, so use Route 53 or GoDaddy's forwarding

### 5.1 Verify Domain Access
- [ ] Test http://zachbagley.net (should redirect to HTTPS)
- [ ] Test https://zachbagley.net (should load website)
- [ ] Test https://www.zachbagley.net (should load website)
- [ ] Verify SSL certificate is valid and trusted

---

## Phase 6: Monitoring and Optimization
### 6.1 CloudWatch Setup
- [ ] Verify CloudWatch Logs are receiving container logs
- [ ] Create CloudWatch dashboard (optional)
- [ ] Set up alarms for:
  - ECS service CPU/Memory usage
  - ALB unhealthy target count
  - ALB 5xx errors

### 6.2 Cost Optimization
- [ ] Review Fargate task size (adjust CPU/memory if over-provisioned)
- [ ] Consider using Fargate Spot for non-production (if applicable)
- [ ] Review ALB idle timeout settings
- [ ] Set up AWS Budgets alert

### 6.3 Performance and Security
- [ ] Enable ALB access logs to S3 (optional)
- [ ] Configure ECS task auto-scaling if needed
- [ ] Review Security Group rules (principle of least privilege)
- [ ] Test website performance and loading times
- [ ] Run SSL test (ssllabs.com/ssltest)

---

## Phase 7: CI/CD Pipeline (Optional but Recommended)
### 7.1 Automated Deployments
- [ ] Set up GitHub repository (if not already)
- [ ] Choose CI/CD tool:
  - Option A: AWS CodePipeline + CodeBuild
  - Option B: GitHub Actions
- [ ] Create build pipeline:
  - Trigger on push to main branch
  - Build Docker image
  - Push to ECR
  - Update ECS service with new task definition
- [ ] Test automated deployment

---

## Phase 8: Post-Deployment Tasks
### 8.1 Documentation
- [ ] Document AWS resource IDs and ARNs
- [ ] Document environment variables and secrets
- [ ] Create rollback procedure
- [ ] Update README.md with deployment information

### 8.2 Backup and Disaster Recovery
- [ ] Document infrastructure as code (consider Terraform or CloudFormation)
- [ ] Tag all AWS resources appropriately
- [ ] Set up billing alerts

### 8.3 Final Testing
- [ ] Test all pages: /, /about, /resume, /projects, /contact
- [ ] Test on multiple devices and browsers
- [ ] Test HTTPS redirect
- [ ] Verify all static assets load correctly
- [ ] Check browser console for errors

---

## AWS Resources Summary (for reference)
### Resources to Create:
1. **ECR Repository**: Store Docker images
2. **VPC**: Network infrastructure (may already exist)
3. **Subnets**: At least 2 public subnets in different AZs
4. **Security Groups**: 2 (one for ALB, one for ECS tasks)
5. **Application Load Balancer**: Route traffic to containers
6. **Target Group**: Register ECS tasks
7. **ACM Certificate**: SSL/TLS for HTTPS
8. **ECS Cluster**: Container orchestration
9. **Task Definition**: Container specification
10. **ECS Service**: Run and maintain tasks
11. **Route 53 Hosted Zone**: DNS management (recommended)
12. **IAM Roles**: Task execution role, task role

### Estimated Monthly Cost:
- **Fargate (1 task, 0.25 vCPU, 0.5 GB)**: ~$10-15/month
- **Application Load Balancer**: ~$16-20/month
- **Route 53 Hosted Zone**: $0.50/month
- **Data Transfer**: Minimal for low traffic
- **ECR Storage**: Minimal for small images
- **Total Estimate**: ~$30-40/month for basic setup

---

## Important Notes:
- **DNS Propagation**: Can take 24-48 hours, but often faster (minutes to hours)
- **Certificate Validation**: Ensure you can validate via DNS (check email for validation link)
- **Security**: Never commit AWS credentials to Git
- **Environment Variables**: Use AWS Systems Manager Parameter Store or Secrets Manager for sensitive data
- **Fargate vs EC2**: Using Fargate for simplicity (no server management)
- **Region**: Choose AWS region closest to your users (or lowest cost)

---

## Troubleshooting Checklist:
- [ ] If tasks fail to start: Check CloudWatch logs
- [ ] If ALB returns 503: Check target group health
- [ ] If domain doesn't resolve: Check DNS propagation, verify nameservers
- [ ] If HTTPS doesn't work: Verify certificate status, check ALB listeners
- [ ] If container fails: Check environment variables, test Docker locally

---

## Quick Command Reference:
```bash
# Docker commands
docker build -t portfolio-website .
docker run -p 3000:3000 portfolio-website

# AWS ECR authentication
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Tag and push to ECR
docker tag portfolio-website:latest <ecr-uri>:latest
docker push <ecr-uri>:latest

# Force new deployment (after pushing new image)
aws ecs update-service --cluster portfolio-cluster --service portfolio-service --force-new-deployment
```

---

## Timeline Estimate:
- **Phase 1 (Docker)**: 30-60 minutes
- **Phase 2 (ECR)**: 15-30 minutes
- **Phase 3 (AWS Infrastructure)**: 1-2 hours
- **Phase 4 (ECS)**: 1-2 hours
- **Phase 5 (Domain)**: 30 minutes + DNS propagation time
- **Phase 6 (Monitoring)**: 30-60 minutes
- **Phase 7 (CI/CD)**: 1-2 hours (optional)

**Total Active Work**: 4-7 hours (spread across potentially 24-48 hours for DNS)

---

**Last Updated**: 2025-10-30
**Status**: Ready to begin Phase 1
