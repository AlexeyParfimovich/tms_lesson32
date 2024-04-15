// Jenkinsfile (Declarative Pipeline)
pipeline {
    agent  
    {
        label 'VMJenkinsBuildHost1'
    }

    // buildDiscarder option not applicable to the agent
    // options {
    //     buildDiscarder(logRotator(numToKeepStr: '3'))
    // }

    environment {
        GITHUB_CREDS = credentials('GitHub-creds')
        DOCKERHUB_CREDS = credentials('DockerHub-creds')
    }

    parameters {
        string(name: "Branch_Name", defaultValue: 'main', trim: true, description: 'the Git branch, contains the jenkinsfile code')
        string(name: "Image_Name", defaultValue: 'tms_calc', trim: true, description: 'the name of the Docker image to be build')
        string(name: "Image_Tag", defaultValue: 'latest', trim: true, description: 'Docker image tag')
        
        booleanParam(name: "PushImage", defaultValue: true)
        booleanParam(name: "DeployImage", defaultValue: false)
    }

    stages {

        stage("Build docker image") {
            steps {
                echo "Bulding docker images"
                dir(path: './Source') {
                    script {
                        sh "docker build -t ${params.Image_Name}:${params.Image_Tag} . "
                        /*
                        def output = sh(script: "ls -l", returnStdout: true)
                        echo "ls: ${output}"

                        def status = sh(script: "docker build -t ${params.Image_Name}:${params.Image_Tag} . ", returnStatus: true)
                        if (status != 0) {
                            echo "Error: Docker build failed with status ${status}"
                        } else {
                            echo "Docker build executed successfully"
                        } 
                        */
                    }
                }
            }
        }

        stage("Test docker image") {
            steps {
                echo "Testing docker images"
                script {
                    sh "docker run -p 8081:80 -d --name ${params.Image_Name}_test ${params.Image_Name}:${params.Image_Tag} "

                    final String url = "http://localhost:8081"
                    final def (String response, String code) =
                            sh(script: "curl -s -w '\n%{response_code}' $url", returnStdout: true)
                            .trim()
                            .tokenize("\n")

                    echo '$response'
                    echo '$code'
                    
                    if (code == '200') {
                        //def matcher = regex(‘^([^ ]+) ‘)
                        //def match = matcher.find(response)
                        //echo “${match.group(1)}”

                        echo response
                    }
                    else {
                        echo code
                        throw new Exception("Stop CI pipeline due to container test fails: Application returns response code $code!")
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

                    def imageName = "${params.Image_Name}:${params.Image_Tag}"
                    def repositoryName = "${DOCKERHUB_CREDS_USR}/${imageName}"

                    sh "docker login -u ${DOCKERHUB_CREDS_USR} -p ${DOCKERHUB_CREDS_PSW} "
                    sh "docker tag ${imageName} ${repositoryName} "
                    sh "docker push ${repositoryName} "
                }
            }
        }

        stage("Deploy image from Dockerhub") {
            agent  
            {
                label 'VMJenkinsDeployHost1'
            }
            // buildDiscarder option not applicable to the agent
            // options {
            //     buildDiscarder(logRotator(numToKeepStr: '3'))
            // }
            when {
                equals expected: "true", actual: "${params.DeployImage}"
            }
            steps {
                script {
                    echo "Deploing the image from docker hub"

                    def repositoryName = "${DOCKERHUB_CREDS_USR}/${params.Image_Name}:${params.Image_Tag}"
                    sh "docker pull ${repositoryName} "

                    sh """
                        if [ \$(docker ps -qf "name=${params.Image_Name}") ]; then \
                            docker stop \$(docker ps -qf "name=${params.Image_Name}"); \
                            docker rm \$(docker ps -qaf "name=${params.Image_Name}"); \
                        fi
                    """
                    sh "docker run -p 8080:80 -d --name ${params.Image_Name}_${params.Image_Tag} ${repositoryName} "
                }
            }
        }
    }

    post {
        always {
            script {
                echo "Clean docker artifacts after the pipeline operation."
                sh """
                    if [ \$(docker ps -qf "name=${params.Image_Name}") ]; then \
                    docker stop \$(docker ps -qf "name=${params.Image_Name}"); \
                    docker rm \$(docker ps -qaf "name=${params.Image_Name}"); \
                    fi
                """
            }
        }

        success {
            script {
                echo "The pipeline operation has been completed successfully."
            }
        }

        failure {
            script {
                echo "The pipeline operation is completed with errors."
            }
        }
    }
}