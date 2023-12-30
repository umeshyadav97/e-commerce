// Jenkinsfile for wavesleep frontend panels
def COLOR_MAP = [
    'SUCCESS': 'good',
    'FAILURE': 'danger',
    'UNSTABLE': 'warning'
]

def MESSAGES_MAP = [
    'SUCCESS': "success",
    'FAILURE': "failed",
    'UNSTABLE': "unstable"
]

// AWS S3 buckets name
def S3_DEV_BUCKET = 'customer.dev.gomble.org'
def S3_QA_BUCKET = 'customer.qa.gomble.org'
def S3_STAGE_BUCKET = 'customer.stage.gomble.org'
def S3_PROD_BUCKET = 'www.gomble.org'


// AWS Cloudfront distribution id
def CF_DEV_DISTRIBUTION_Id = 'ETJY2L5ISUD69'
def CF_QA_DISTRIBUTION_Id = 'E2BN21K1IBZ7V0'
def CF_STAGE_DISTRIBUTION_Id = 'E2RMKL30XNT9W2'
def CF_PROD_DISTRIBUTION_Id = 'E21ZI2VC3BRFRT'

def AWS_REGION = 'us-east-1'
def AWS_CREDENTIAL_ID = 'gomble-aws-bucket-iam'
def SLACK_CHANNEL = "#opsengine"

pipeline {
    agent any
    options {
        // fail build if takes more than 30 minutes, mark reason as build timeout
        timeout(time: 30, unit: 'MINUTES')
        // Keep the 10 most recent builds
        buildDiscarder(logRotator(numToKeepStr: '10'))
        // Don't run any stage if found to be unstable
        skipStagesAfterUnstable()
    }
    environment {
        CI                      = "false"
        DISPLAY_SERVICE_NAME    = 'Gomble Customer Panel'
        npm_config_cache        = 'npm-cache'
        BRANCH_NAME             = sh(script: "echo ${env.BRANCH_NAME}", returnStdout: true).trim()
    }
    stages {
        stage('SCM Checkout') {
            steps {
                checkout scm
                slackSend color: COLOR_MAP[currentBuild.currentResult], message: "${DISPLAY_SERVICE_NAME}: Job ${env.JOB_NAME}, Build No: ${env.BUILD_NUMBER}, Environment: ${BRANCH_NAME}"
            }
        }
        stage("Environment Variables") {
            steps {
                sh "printenv"
            }
        }
        stage('Install Dependencies') {
            steps {
                echo 'NPM install dependencies.'
                sh   'npm install --legacy-peer-deps'
                slackSend color: COLOR_MAP[currentBuild.currentResult], message: "Installing Dependencies " + MESSAGES_MAP[currentBuild.currentResult] + ", Logs (<${env.BUILD_URL}|Open>)"
            }
        }
        stage('Build Application') {
            parallel {
                stage('Building Dev Artifacts') {
                    when {
                        branch 'develop'
                    }
                    steps {
                        sh 'CI=false npm run build:dev'
                        slackSend color: COLOR_MAP[currentBuild.currentResult], message: "Building Dev Artifacts " + MESSAGES_MAP[currentBuild.currentResult] + ", Logs (<${env.BUILD_URL}|Open>)"
                    }
                }
                stage('Building QA Artifacts') {
                    when {
                        branch 'qa'
                    }
                    steps {
                        sh 'CI=false npm run build:qa'
                        slackSend color: COLOR_MAP[currentBuild.currentResult], message: "Building Artifacts " + MESSAGES_MAP[currentBuild.currentResult] + ", Logs (<${env.BUILD_URL}|Open>)"
                    }
                }
                stage('Building STAGE Artifacts') {
                    when {
                        branch 'stage'
                    }
                    steps {
                        sh 'CI=false npm run build:stage'
                        slackSend color: COLOR_MAP[currentBuild.currentResult], message: "Building Artifacts " + MESSAGES_MAP[currentBuild.currentResult] + ", Logs (<${env.BUILD_URL}|Open>)"
                    }
                }
                stage('Building Prod Artifacts') {
                    when {
                        branch 'master'
                    }
                    steps {
                        sh 'CI=false npm run build:prod'
                        slackSend color: COLOR_MAP[currentBuild.currentResult], message: "Building Artifacts " + MESSAGES_MAP[currentBuild.currentResult] + ", Logs (<${env.BUILD_URL}|Open>)"
                    }
                }
            }
        }
        stage('Deploying to S3') {
            parallel {
                    stage('Deploying to Dev Environment') {
                        when {
                            branch 'develop'
                        }
                        steps {
                            withAWS(region: AWS_REGION, credentials: AWS_CREDENTIAL_ID) {
                              s3Delete(bucket: S3_DEV_BUCKET, path:'**/*')
                              s3Upload(bucket: S3_DEV_BUCKET, workingDir:'build', includePathPattern:'**/*');
                              cfInvalidate(distribution: CF_DEV_DISTRIBUTION_Id, paths:['/*'], waitForCompletion: true);
                            }
                            slackSend color: COLOR_MAP[currentBuild.currentResult], message: "Deploying to S3, Environment Dev: " + MESSAGES_MAP[currentBuild.currentResult] + ", Logs (<${env.BUILD_URL}|Open>)"
                        }
                    }
                    stage('Deploying to QA Environment') {
                        when {
                            branch 'qa'
                        }
                        steps {
                            withAWS(region: AWS_REGION, credentials: AWS_CREDENTIAL_ID) {
                              s3Delete(bucket: S3_QA_BUCKET, path:'**/*')
                              s3Upload(bucket: S3_QA_BUCKET, workingDir:'build', includePathPattern:'**/*');
                              cfInvalidate(distribution: CF_QA_DISTRIBUTION_Id, paths:['/*'], waitForCompletion: true)
                            }
                            slackSend color: COLOR_MAP[currentBuild.currentResult], message: "Deploying to S3, Environment Quality Assurance (QA): " + MESSAGES_MAP[currentBuild.currentResult] + ", Logs (<${env.BUILD_URL}|Open>)"
                        }
                    }
                    stage('Deploying to STAGE Environment') {
                        when {
                            branch 'stage'
                        }
                        steps {
                            withAWS(region: AWS_REGION, credentials: AWS_CREDENTIAL_ID) {
                              s3Delete(bucket: S3_STAGE_BUCKET, path:'**/*')
                              s3Upload(bucket: S3_STAGE_BUCKET, workingDir:'build', includePathPattern:'**/*');
                              cfInvalidate(distribution: CF_STAGE_DISTRIBUTION_Id, paths:['/*'], waitForCompletion: true)
                            }
                            slackSend color: COLOR_MAP[currentBuild.currentResult], message: "Deploying to S3, Environment Quality Assurance (STAGE): " + MESSAGES_MAP[currentBuild.currentResult] + ", Logs (<${env.BUILD_URL}|Open>)"
                        }
                    }
                    stage('Deploying to Master Environment') {
                        when {
                            branch 'master'
                        }
                        steps {
                            withAWS(region: AWS_REGION, credentials: AWS_CREDENTIAL_ID) {
                              s3Delete(bucket: S3_PROD_BUCKET, path:'**/*')
                              s3Upload(bucket: S3_PROD_BUCKET, workingDir:'build', includePathPattern:'**/*');
                              cfInvalidate(distribution: CF_QA_DISTRIBUTION_Id, paths:['/*'], waitForCompletion: true)
                            }
                            slackSend color: COLOR_MAP[currentBuild.currentResult], message: "Deploying to S3, Environment Quality Assurance (QA): " + MESSAGES_MAP[currentBuild.currentResult] + ", Logs (<${env.BUILD_URL}|Open>)"
                        }
                    }
                }
        }
    }
    // post process for jenkins build, notify on slack and email
    post {
        success {
            slackSend channel: SLACK_CHANNEL, color: COLOR_MAP[currentBuild.currentResult], message: "*${currentBuild.currentResult}:* Job - ${env.JOB_NAME} ${env.BUILD_NUMBER} successfully deployed, logs (<${env.BUILD_URL}|Open>)"
            // mail to:"me@example.com", subject:"SUCCESS: ${currentBuild.fullDisplayName}", body: "Yay, we passed."
            echo 'Success!'
        }
        failure {
            slackSend channel: SLACK_CHANNEL, color: COLOR_MAP[currentBuild.currentResult], message: "*${currentBuild.currentResult}:* Job - ${env.JOB_NAME} ${env.BUILD_NUMBER} failed to deploy, logs (<${env.BUILD_URL}|Open>)"
            echo 'Failed!'
        }
        unstable {
            slackSend channel: SLACK_CHANNEL, color: COLOR_MAP[currentBuild.currentResult], message: "*${currentBuild.currentResult}:* Job - ${env.JOB_NAME} ${env.BUILD_NUMBER} failed to build: unstable, logs (<${env.BUILD_URL}|Open>)"
            echo 'Unstable!'
        }
        always {
          deleteDir()
        }
    }
}