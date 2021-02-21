pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                echo '---building---'
		sh 'npm i --registry https://registry.npm.taobao.org&&npm run build'
                // sh 'docker run --rm -v npm-cache:/root/.npm -v $(pwd):/root/app node:alpine sh -c "cd /root/app&&npm i --registry https://registry.npm.taobao.org&&npm run build"'
            }
        }
        stage('Test') {
            steps {
                echo '---Testing---'
            }
        }
        stage('Deploy') {
            steps {
                echo '---Deploying---'
                sh 'ssh root@43.128.10.242 "cd /data/nginx/imliuk; rm -rf ./*"'
                sh 'scp -r .vuepress/dist/* root@43.128.10.242:/data/nginx/imliuk'
            }
        }
    }
    post {
        always {
            echo 'This will always run'
        }
        success {
            echo 'This will run only if successful'
        }
        failure {
            echo 'This will run only if failed'
        }
        unstable {
            echo 'This will run only if the run was marked as unstable'
        }
        changed {
            echo 'This will run only if the state of the Pipeline has changed'
            echo 'For example, if the Pipeline was previously failing but is now successful'
        }
    }
}
