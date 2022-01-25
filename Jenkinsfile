def HOST = null
def IP = "10.10.1.117"
def PROJECT_NAME = "whales-assets-spy"

pipeline {
  agent any
  options {
    timeout(time: 1, unit: 'HOURS') 
  }

  stages {
    stage("Install") {
      steps {
        sh "npm install"
      }
    }

    stage("Build") {
      steps {
        script {
          if (env.BRANCH_NAME == "master") {
            HOST = IP
          }
          sh "npm run build"
          sh "tar -cvzf dist.tar.gz --strip-components=1 dist"
          sh "tar -cvzf node_modules.tar.gz --strip-components=1 node_modules"
        }
      }
    }

    stage("Deploy") {
      steps {
        script {
          if (HOST != null) {
            sh "ssh root@${HOST} rm -rf /root/${PROJECT_NAME}/"
            sh "ssh root@${HOST} mkdir -p /root/${PROJECT_NAME}/"
            sh "scp -r dist.tar.gz root@${HOST}:/root/${PROJECT_NAME}/"
            sh "scp -r node_modules.tar.gz root@${HOST}:/root/${PROJECT_NAME}/"
            sh "ssh root@${HOST} tar -xzvf /root/${PROJECT_NAME}/dist.tar.gz -C /root/${PROJECT_NAME}/"
            sh "ssh root@${HOST} tar -xzvf /root/${PROJECT_NAME}/node_modules.tar.gz -C /root/${PROJECT_NAME}/"
            sh "ssh root@${HOST} rm -rf /root/${PROJECT_NAME}/dist.tar.gz"
            sh "ssh root@${HOST} rm -rf /root/${PROJECT_NAME}/node_modules.tar.gz"
          }
        }
      }
    }

    stage("Start") {
      steps {
        script {
          if (HOST != null) {
            sh "ssh root@${HOST} systemctl restart ${PROJECT_NAME}"
            sh "ssh root@${HOST} systemctl status ${PROJECT_NAME}"
          }
        }
      }
    }

    stage("Clean") {
      steps {
        dir(env.WORKSPACE) { 
          deleteDir() 
        }
      }
    }
  }
}