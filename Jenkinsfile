
node {
    def imageName    = 'wahaj-app'
    def containerName = 'wahaj-app'
    def appPort      = '3001'
    def k8sNamespace = 'wahaj-app'
    def sonarProject = 'wahaj-nextjs-app'

    stage('Clean Workspace') {
        echo 'Cleaning Jenkins workspace'
        deleteDir()
    }

    stage('Clone Repo') {
        echo 'Cloning the repo'
        git(
            branch: 'main',
            url: 'https://github.com/ESE-Wahaj/wahajdockerjenkins'
        )
    }

    stage('SonarQube Analysis') {
        echo 'Running SonarQube static code analysis'
        def scannerHome = tool 'SonarQube'
        withSonarQubeEnv('SonarQube') {
            sh """
                ${scannerHome}/bin/sonar-scanner \
                  -Dsonar.projectKey=${sonarProject} \
                  -Dsonar.projectName='Wahaj Next.js App - FA22-BSE-100' \
                  -Dsonar.sources=app \
                  -Dsonar.exclusions='**/node_modules/**,**/.next/**,**/public/**' \
                  -Dsonar.host.url=\${SONAR_HOST_URL} \
                  -Dsonar.token=\${SONAR_AUTH_TOKEN}
            """
        }
    }

    stage('Quality Gate') {
        echo 'Waiting for SonarQube Quality Gate result'
        timeout(time: 5, unit: 'MINUTES') {
            def qg = waitForQualityGate()
            if (qg.status != 'OK') {
                error "BLOCKED: SonarQube Quality Gate failed with status: ${qg.status}. Fix security issues before deploying."
            }
        }
    }

    stage('Build Image') {
        echo 'Building Docker image'
        sh "docker build -t ${imageName}:${BUILD_NUMBER} ."
        sh "docker tag ${imageName}:${BUILD_NUMBER} ${imageName}:latest"
    }

    stage('Deploy Docker Container') {
        echo 'Stopping old container and starting new one'
        sh """
            docker stop ${containerName} || true
            docker rm ${containerName} || true
            docker run -d \
                --name ${containerName} \
                -p ${appPort}:3000 \
                --restart unless-stopped \
                ${imageName}:${BUILD_NUMBER}
        """
    }

    stage('Load Image into Minikube') {
        echo 'Loading Docker image into Minikube'
        sh "minikube image load ${imageName}:latest"
    }

    stage('Deploy to Kubernetes') {
        echo 'Applying Kubernetes manifests'
        sh "kubectl apply -f kubernetes/namespace.yaml"
        sh "kubectl apply -f kubernetes/deployment.yaml"
        sh "kubectl apply -f kubernetes/service.yaml"
        sh "kubectl rollout restart deployment/${imageName} -n ${k8sNamespace}"
        sh "kubectl rollout status deployment/${imageName} -n ${k8sNamespace} --timeout=60s"
    }

    stage('Verify Deployment') {
        echo 'Verifying pod is running'
        sh "kubectl get pods -n ${k8sNamespace}"
        sh "kubectl get svc -n ${k8sNamespace}"
    }
}
