// Imports
const { 
  EC2Client,
  CreateImageCommand
} = require('@aws-sdk/client-ec2')

function sendCommand (command) {
  const client = new EC2Client({ region: process.env.AWS_REGION })
  return client.send(command)
}

createImage('i-0e82ed6336dcd0c04', 'hamsterImage')
  .then(() => console.log('Complete'))

async function createImage (seedInstanceId, imageName) {
  const params = {
    InstanceId: seedInstanceId,
    Name: imageName
  }
  const command = new CreateImageCommand(params)
  return sendCommand(command)
}
