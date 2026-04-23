
node {
    def imageName = 'wahaj-app'
    def containerName = 'wahaj-app'
    def appPort = '3000'

    stage('Clean Workspace') {
        echo 'Cleaning Jenkins workspace'
        deleteDir()
    }

    stage('Clone Repo') {
        echo 'Cloning the repo'
        git(
            branch: 'master',
            url: 'https://github.com/ESE-Wahaj/wahaj'
        )
    }

    stage('Build Image') {
        echo 'Building Docker image'
        sh "docker build -t ${imageName}:${BUILD_NUMBER} ."
    }

    stage('Deploy') {
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
}
