# Dockerize Next.js App + Jenkins CI/CD on EC2

**Date:** 2026-04-23

## Overview

Dockerize the existing Next.js 16 / React 19 / TypeScript / Tailwind app and deploy it automatically to EC2 via a Jenkins pipeline triggered by GitHub pushes. No Docker registry — the image is built and run directly on the same EC2 instance where Jenkins runs.

## Architecture

```
GitHub push → GitHub Webhook → Jenkins (on EC2)
                                    ↓
                              docker build
                                    ↓
                         stop old container
                                    ↓
                          docker run (port 3000)
```

## Files to Add to Repo

### `Dockerfile`
Multi-stage build:
- **deps** stage: `node:20-alpine`, installs all dependencies
- **builder** stage: copies source, runs `next build`
- **runner** stage: lean `node:20-alpine` image, copies built output, runs `next start -p 3000`

### `.dockerignore`
Excludes: `node_modules`, `.next`, `.git`, `Dockerfile`, `Jenkinsfile`, `docs`

### `Jenkinsfile`
Declarative pipeline with 3 stages:
1. **Checkout** — pulls latest code from `https://github.com/ESE-Wahaj/wahaj`
2. **Build Image** — `docker build -t wahaj-app:${BUILD_NUMBER} .`
3. **Deploy** — stops and removes existing `wahaj-app` container (if running), starts new: `docker run -d --name wahaj-app -p 3000:3000 wahaj-app:<BUILD_NUMBER>`

## One-Time Manual Setup (EC2 + Jenkins)

### EC2 / Jenkins
1. Install Docker on EC2
2. Add `jenkins` user to `docker` group: `sudo usermod -aG docker jenkins`
3. Restart Jenkins service
4. Install **GitHub plugin** in Jenkins
5. Create a **Pipeline job**: SCM = Git, repo URL = `https://github.com/ESE-Wahaj/wahaj`, branch = `main`, script path = `Jenkinsfile`
6. Enable **"GitHub hook trigger for GITScm polling"** in job build triggers

### GitHub
1. Go to repo → Settings → Webhooks → Add webhook
2. Payload URL: `http://<EC2-public-IP>:8080/github-webhook/`
3. Content type: `application/json`
4. Trigger: "Just the push event"

## Data Flow

- App runs inside Docker container on port 3000
- Jenkins uses `BUILD_NUMBER` as the image tag so each build is traceable
- Old container is stopped by name (`wahaj-app`) before new one starts — zero config needed between deployments
- Old images are not auto-cleaned (can add `docker image prune` to Jenkinsfile later if disk space is a concern)

## Error Handling

- If `docker stop wahaj-app` fails (first deploy, no container yet), the pipeline continues — handled with `|| true` in the Jenkinsfile shell step
- Build failures in the `builder` stage will abort the pipeline before any container is touched

## Out of Scope

- HTTPS / SSL termination (can add nginx reverse proxy later)
- Docker image registry
- Rollback (re-run previous Jenkins build to redeploy old image tag)
