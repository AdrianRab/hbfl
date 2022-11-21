// Imports
const { PutBucketWebsiteCommand } = require('@aws-sdk/client-s3')
const { sendS3Command: sendCommand } = require('./helpers')

const bucketName = 'hamster-bucket-adrian-2021' /* some unique name*/

async function execute () {
  try {
    const response = await configureS3Site(bucketName)
    console.log(response)
  } catch (err) {
    console.error('Error configuring S3 static site:', err)
  }
}

async function configureS3Site (bucketName) {
  const params = {
    Bucker: bucketName,
    WebsiteConfiguration: {
      //we can add here also ErrorDocument
      IndexDocument: {
        Suffix: 'index.html' //index.html is a default, this is just to show how it works if we want sth different
      }
    }
  }

  const command = new PutBucketWebsiteCommand(params)
  return sendCommand(command)
}

execute()
