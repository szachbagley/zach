docker build --platform linux/amd64 -t portfolio-website .
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 403894226819.dkr.ecr.us-east-1.amazonaws.com
docker tag portfolio-website:latest 403894226819.dkr.ecr.us-east-1.amazonaws.com/portfolio-website:latest  
docker push 403894226819.dkr.ecr.us-east-1.amazonaws.com/portfolio-website:latest
ssh -i ../portfolio-key.pem ubuntu@54.201.223.169    
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 403894226819.dkr.ecr.us-east-1.amazonaws.com
docker pull 403894226819.dkr.ecr.us-east-1.amazonaws.com/portfolio-website:latest
docker stop portfolio && docker rm portfolio
docker run -d --name portfolio --restart unless-stopped -p 3000:3000 403894226819.dkr.ecr.us-east-1.amazonaws.com/portfolio-website:latest
exit