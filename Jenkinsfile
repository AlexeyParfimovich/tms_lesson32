// Jenkinsfile (Declarative Pipeline)
// Global Variable goes here
// Pipeline block
pipeline {
// Agent block
agent {
   node any
}
options {
}
parameters {
   string(name: "Branch_Name", defaultValue: 'main', description: 'the Git branch, contains the jenkinsfile code')
   string(name: "Image_Name", defaultValue: 'tms_calc', description: 'the name of the Docker image to be build')
   string(name: "Image_Tag", defaultValue: 'latest', description: 'Docker image tag')
   
   booleanParam(name: "PushImage", defaultValue: true)
}
// Stage Block
stages {// stage blocks
   stage("Build docker images") {
      steps {
        echo "Bulding docker images"
        dir(path: './Source') {
          sh 'ls -l'
          sh "docker build -t ${params.Image_Name}:${params.Image_Tag} . "
        }
     }
}
stage("Push to Dockerhub") {
   when {
      equals expected: "true", actual: "${params.PushImage}"
   }
   steps {
      script {
         echo "Pushing the image to docker hub"
         def localImage = "${params.Image_Name}:${params.Image_Tag}"
         def repositoryName = "alexeyparfimovich/${localImage}"
         echo "Image name: ${repositoryName}"

         def output = sh(script: "docker tag ${localImage} ${repositoryName} ", returnStdout: true)
         echo "Output: ${output}"

         def status = sh(returnStatus: true, script: "docker push ${repositoryName} ")
         if (status != 0) {
            echo "Error: Command exited with status ${status}"
         } else {
            echo "Command executed successfully"
         }

        }
     }
  }
}}
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
}}