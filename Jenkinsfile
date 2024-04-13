// Jenkinsfile (Declarative Pipeline)
// Global Variable goes here
// Pipeline block
pipeline {
    // Agent block
    agent any 
//    {
//        node any
//    }

//    options {
//    }

    parameters {
        string(name: "Branch_Name", defaultValue: 'main', description: 'the Git branch, contains the jenkinsfile code')
        string(name: "Image_Name", defaultValue: 'tms_calc', description: 'the name of the Docker image to be build')
        string(name: "Image_Tag", defaultValue: 'latest', description: 'Docker image tag')
        
        booleanParam(name: "PushImage", defaultValue: false)
    }

    // Stage Block
    stages {

        stage("Build docker images") {
            steps {
                echo "Bulding docker images"
                dir(path: './Source') {
                    def output = sh(script: "ls -l", returnStdout: true)
                    echo "ls: ${output}"

                    def status = sh(script: "docker build -t ${params.Image_Name}:${params.Image_Tag} . ", returnStatus: true)
                    if (status != 0) {
                        echo "Error: Docker build failed with status ${status}"
                    } else {
                        echo "Docker build executed successfully"
                    }
                }
            }
        }

        stage("Push image to Dockerhub") {
            when {
                equals expected: "true", actual: "${params.PushImage}"
            }
            steps {
                script {
                    echo "Pushing the image to docker hub"
                    
                    def output = sh(script: "ls -l", returnStdout: true)
                    echo "ls: ${output}"

                    def localImage = "${params.Image_Name}:${params.Image_Tag}"
                    def repositoryName = "alexeyparfimovich/${localImage}"
                    echo "Image name: ${repositoryName}"

                    output = sh(script: "docker tag ${localImage} ${repositoryName} ", returnStdout: true)
                    echo "Docker tag: ${output}"

                    def status = sh(returnStatus: true, script: "docker push ${repositoryName} ")
                    if (status != 0) {
                        echo "Error: Command exited with status ${status}"
                    } else {
                        echo "Command executed successfully"
                    }
                }
            }
        }
    }
}

post {
   always {
      script {
         echo "I am execute always"
      }
   }

   success {
      script {
         echo "I am execute on success"
      }
   }

   failure {
      script {
         echo "I am execute on failure"
      }
   }
}