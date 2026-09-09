pipeline {

    agent any

    environment {
        APP_DIR = '/home/ubuntu/157A-Rental-Service'
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out latest source code...'

                checkout scm
            }
        }

        stage('Deploy Source Code') {
            steps {
                echo 'Updating application source code...'

                sh '''
                    rsync -av --delete \
                    --exclude='.env' \
                    --exclude='.git' \
                    --exclude='node_modules' \
                    --exclude='dist' \
                    ./ ${APP_DIR}/
                '''
            }
        }

        stage('Build Docker Images') {
            steps {
                echo 'Building Docker images...'

                sh '''
                    cd ${APP_DIR}

                    docker compose build
                '''
            }
        }

        stage('Deploy Containers') {
            steps {
                echo 'Starting application containers...'

                sh '''
                    cd ${APP_DIR}

                    docker compose up -d
                '''
            }
        }

        stage('Wait for Services') {
            steps {
                sh '''
                    echo "Waiting for services..."
                    sleep 15

                    cd ${APP_DIR}

                    docker compose ps
                '''
            }
        }

        stage('Application Health Check') {
            steps {
                sh '''
                    echo "Checking application..."

                    curl -f http://localhost/ || exit 1

                    echo "Application health check successful."
                '''
            }
        }
    }

    post {

        success {
            echo '''
            ==========================================
            DEPLOYMENT SUCCESSFUL
            ==========================================
            Application is running on port 80.
            ==========================================
            '''
        }

        failure {
            echo '''
            ==========================================
            DEPLOYMENT FAILED
            ==========================================
            Collecting container logs...
            ==========================================
            '''

            sh '''
                cd ${APP_DIR} || true

                docker compose ps || true

                docker compose logs --tail=50 backend || true

                docker compose logs --tail=50 nginx || true
            '''
        }
    }
}
