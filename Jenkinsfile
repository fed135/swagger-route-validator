@Library('sstk-pipeline-plugin') _

import static com.shutterstock.Container.*

def s = sstk(this)
def g = sstk(this, 'github-utils')
def q = sstk(this, 'quality-utils')
def batContainer = fromDockerHub('node:10')
String slackChannel = '#studio-api-alerts'

batContainer.useEnvVars([
  NPM_CONFIG_LOGLEVEL: 'warn'
])

sstkNode([ qualityUtils: true ], 'build', [ batContainer ]) {
  checkout scm
  g.initialize()
  def branch = g.getBranch()
  def prNumber = g.getPrNumber()
  String gitTag = g.getTag()

  container(batContainer.getName()) {
    stage('install') {
      sh('npm install')
    }

    stage('test') {
        sh('npm run test')
    }

    // if (prNumber) {
    //   stage('update pr') {
    //     q.validatePrWithSonarQube(prNumber)
    //   }
    // } else if (branch == 'master') {
    //   stage('sonar') {
    //     q.updateSonarQube()
    //   }
    // }

    if (gitTag) {
      stage('publish npm package') {
        s.npmPublish(slackChannel)
      }
    }
  }
}