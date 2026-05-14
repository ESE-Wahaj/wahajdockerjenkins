# DevOps Final Exam - Infrastructure Documentation
**Muhammad Wahaj Naveed | FA22-BSE-100**

---

## Architecture Overview

```
                        AWS EC2 (54.234.94.152)
                        ┌──────────────────────────────────────────────┐
                        │                                              │
  GitHub Repo ──────►   │  Jenkins :8080                               │
  (push trigger)        │     │                                        │
                        │     ▼                                        │
                        │  Docker Build                                │
                        │     │                                        │
                        │     ├──► Docker Container :3001              │
                        │     │                                        │
                        │     └──► Minikube (Docker driver)            │
                        │              │                               │
                        │              └──► K8s Pod :30080             │
                        │                    (wahaj-app namespace)     │
                        │                                              │
                        │  Prometheus :9090  ◄── Node Exporter :9100  │
                        │       │                                      │
                        │       ▼                                      │
                        │  Grafana :3030                               │
                        └──────────────────────────────────────────────┘
```

---

## Infrastructure as Code - Terraform

Terraform provisions the EC2 instance and security group on AWS.

### Files
| File | Purpose |
|------|---------|
| `terraform/main.tf` | EC2 instance + security group resource definitions |
| `terraform/variables.tf` | Configurable inputs (region, AMI, instance type) |
| `terraform/outputs.tf` | Printed URLs and IDs after apply |

### How to Run

```bash
# 1. Configure AWS credentials
aws configure

# 2. Initialize Terraform
cd terraform
terraform init

# 3. Preview what will be created
terraform plan

# 4. Create the infrastructure
terraform apply

# 5. Destroy when done
terraform destroy
```

### Resources Created
- **EC2 Instance**: `t2.medium`, Ubuntu 24.04 LTS, 20GB gp3 EBS
- **Security Group**: `wahaj-devops-sg` with the following open ports:

| Port | Protocol | Purpose |
|------|----------|---------|
| 22 | TCP | SSH access |
| 80 | TCP | HTTP |
| 3000 | TCP | Next.js web app |
| 3001 | TCP | Alternate app port |
| 3030 | TCP | Grafana UI |
| 8080 | TCP | Jenkins UI |
| 9090 | TCP | Prometheus UI |
| 9100 | TCP | Node Exporter metrics |
| 30000-32767 | TCP | Kubernetes NodePort range |

---

## Configuration Management - Ansible

Ansible automates the installation and configuration of all services on EC2.

### Files
| File | Purpose |
|------|---------|
| `ansible/inventory.ini` | EC2 host definition with IP and SSH key |
| `ansible/playbook.yml` | Full configuration playbook |

### What the Playbook Installs
1. System dependencies (curl, wget, git, etc.)
2. Docker CE + Docker daemon
3. kubectl (Kubernetes CLI)
4. Minikube (started with Docker driver)
5. Prometheus 2.47.0 (as systemd service)
6. Node Exporter 1.6.1 (as systemd service)
7. Grafana (on port 3030, as systemd service)
8. Kubernetes manifests applied to Minikube

### How to Run

```bash
# From your local machine (requires Ansible installed)
cd ansible

# Test connectivity to EC2
ansible -i inventory.ini ec2 -m ping

# Run the full playbook
ansible-playbook -i inventory.ini playbook.yml

# Run with verbose output
ansible-playbook -i inventory.ini playbook.yml -v
```

> **Note**: Update `ansible/inventory.ini` if your EC2 IP changes after restart.

---

## Containerization - Docker

The Next.js application is containerized using a multi-stage Dockerfile.

### Dockerfile Stages

| Stage | Base Image | Purpose |
|-------|-----------|---------|
| `deps` | node:20-alpine | Install npm dependencies |
| `builder` | node:20-alpine | Build the Next.js app (`npm run build`) |
| `runner` | node:20-alpine | Minimal production image |

### Key Settings
- `output: 'standalone'` in `next.config.ts` — produces a self-contained server bundle
- Runs as non-root user `nextjs` (uid 1001)
- Exposes port **3000**

### Build & Run Manually

```bash
# Build image
docker build -t wahaj-app:latest .

# Run container
docker run -d --name wahaj-app -p 3001:3000 wahaj-app:latest

# Check logs
docker logs wahaj-app

# Stop container
docker stop wahaj-app && docker rm wahaj-app
```

---

## Container Orchestration - Kubernetes (Minikube)

The application runs in a Kubernetes pod managed by Minikube on the EC2 instance.

### Files
| File | Purpose |
|------|---------|
| `kubernetes/namespace.yaml` | Isolated namespace `wahaj-app` |
| `kubernetes/deployment.yaml` | Pod spec with health checks and resource limits |
| `kubernetes/service.yaml` | NodePort service exposing port 30080 |

### Deployment Details

| Setting | Value |
|---------|-------|
| Namespace | `wahaj-app` |
| Replicas | 1 |
| Container port | 3000 |
| NodePort | 30080 |
| Image pull policy | `Never` (uses local Minikube image cache) |
| Memory limit | 512Mi |
| CPU limit | 500m |

### How to Deploy Manually

```bash
# On the EC2 instance:

# Start Minikube
minikube start --driver=docker

# Load your Docker image into Minikube
minikube image load wahaj-app:latest

# Apply manifests
kubectl apply -f kubernetes/namespace.yaml
kubectl apply -f kubernetes/deployment.yaml
kubectl apply -f kubernetes/service.yaml

# Check status
kubectl get pods -n wahaj-app
kubectl get svc -n wahaj-app

# Access the app
# http://54.234.94.152:30080
```

### Useful kubectl Commands

```bash
# View pod logs
kubectl logs -f deployment/wahaj-app -n wahaj-app

# Describe pod (debugging)
kubectl describe pod -l app=wahaj-app -n wahaj-app

# Delete and redeploy
kubectl rollout restart deployment/wahaj-app -n wahaj-app

# Check rollout status
kubectl rollout status deployment/wahaj-app -n wahaj-app
```

---

## CI/CD Pipeline - Jenkins

Jenkins automates the full build-deploy cycle on every git push.

### Pipeline Stages

| Stage | What it Does |
|-------|-------------|
| Clean Workspace | Wipes the workspace before building |
| Clone Repo | Pulls latest code from GitHub main branch |
| Build Image | Runs `docker build`, tags image as `latest` and `$BUILD_NUMBER` |
| Deploy Docker Container | Stops old container, starts new one on port 3001 |
| Load Image into Minikube | Pushes image into Minikube's image cache |
| Deploy to Kubernetes | Applies k8s manifests, rolling restart |
| Verify Deployment | Prints pod and service status |

### Jenkins URL
`http://54.234.94.152:8080`

---

## Monitoring Stack

### Prometheus (`:9090`)
- Scrapes metrics every 15 seconds
- Targets: self (`localhost:9090`), Node Exporter (`localhost:9100`), Jenkins (`localhost:8080/prometheus`)

### Node Exporter (`:9100`)
- Exposes EC2 system metrics: CPU, RAM, Disk, Network

### Grafana (`:3030`)
- Connected to Prometheus as data source
- Dashboard IDs:
  - **1860** — Node Exporter Full (server metrics)
  - **9964** — Jenkins: Performance and Health Overview

---

## Service URLs (Current IP: 54.234.94.152)

| Service | URL |
|---------|-----|
| Web App (Docker) | http://54.234.94.152:3001 |
| Web App (Kubernetes) | http://54.234.94.152:30080 |
| Jenkins | http://54.234.94.152:8080 |
| Prometheus | http://54.234.94.152:9090 |
| Grafana | http://54.234.94.152:3030 |
| Node Exporter | http://54.234.94.152:9100/metrics |

> **Important**: EC2 public IP changes on every instance restart. Update `ansible/inventory.ini` and this doc with the new IP.
