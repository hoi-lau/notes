pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                echo '---building---'
                sh 'docker run --rm -v $(pwd):/root/app node:latest sh -c "cd /root/app&&npm i --registry https://registry.npm.taobao.org&&npm run build"'
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
                // sh 'scp Dockerfile blog.sh root@172.17.0.9:/data/blog-backend;'
                // sh 'scp target/blog-0.0.1-SNAPSHOT.jar root@172.17.0.9:/data/blog-backend/target;'
                sh 'ssh root@172.17.0.9 "cd /data/nginx/www; rm -rf _posts/ assets/ category/ tag/ timeline/ 404.html index.html manifest.json service-worker.js"'
                sh 'scp -r .vuepress/dist/* root@172.17.0.9:/data/nginx/www'
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