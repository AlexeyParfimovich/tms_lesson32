// Jenkinsfile (Declarative Pipeline)

pipeline {
    agent  
    {
        label 'VMJenkinsBuildHost1'
    }

    // options {
    //     buildDiscarder(logRotator(numToKeepStr: '3'))
    // }

    environment {
        GITHUB_CREDS = credentials('GitHub-creds')
        DOCKERHUB_CREDS = credentials('DockerHub-creds')
    }

    parameters {
        string(name: "Branch_Name", defaultValue: 'main', description: 'the Git branch, contains the jenkinsfile code')
        string(name: "Image_Name", defaultValue: 'tms_calc', description: 'the name of the Docker image to be build')
        string(name: "Image_Tag", defaultValue: 'latest', description: 'Docker image tag')
        
        booleanParam(name: "PushImage", defaultValue: false)
        booleanParam(name: "DeployImage", defaultValue: false)
    }

    // Stage Block
    stages {

        stage("Build docker images") {
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

        stage("Push image to Dockerhub") {
            when {
                equals expected: "true", actual: "${params.PushImage}"
            }
            steps {               
                script {
                    echo "Pushing the image to docker hub"

                    def localImage = "${params.Image_Name}:${params.Image_Tag}"
                    def repositoryName = "alexeyparfimovich/${localImage}"
                    echo "Image name: ${repositoryName}"

                    sh "docker login -u ${DOCKERHUB_CREDS_USR} -p ${DOCKERHUB_CREDS_PSW} "
                    sh "docker tag ${localImage} ${repositoryName} "
                    sh "docker push ${repositoryName} "

                    /*
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
                    */
                }
            }
        }

        stage("Deploy image from Dockerhub") {
            agent  
            {
                label 'VMJenkinsDeployHost1'
            }
            // options {
            //     buildDiscarder(logRotator(numToKeepStr: '3'))
            // }
            when {
                equals expected: "true", actual: "${params.DeployImage}"
            }
            steps {
                script {
                    echo "Deploing the image from docker hub"

                    def localImageName = "${params.Image_Name}:${params.Image_Tag}"
                    def repositoryName = "alexeyparfimovich/${localImageName}"
                    sh "docker pull ${repositoryName} "

                    def containerName = "${params.Image_Name}_${params.Image_Tag}"

                    sh """
                        if [ \$(docker ps -qf "name=${containerName}") ]; then \
                            docker stop \$(docker ps -qf "name=${containerName}"); \
                            docker rm \$(docker container ls -aq)
                        fi
                    """

                    //sh "docker ps -aq | xargs docker stop "
                    sh "docker run -p 8081:80 -d --name ${containerName} ${repositoryName} "
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
}