// Imports
const {
  AttachVolumeCommand,
  DetachVolumeCommand
} = require('@aws-sdk/client-ec2')
const { sendCommand, sleep } = require('./helpers')

// Declare local variables
const volumeId = '/* TODO: Add the volume to detach/attach */'
const instanceId = '/* TODO: Add the instance to attach to */'

async function execute () {
  try {
    await detachVolume(volumeId)
    console.log('Detached volume:', volumeId)
    await sleep(3)
    await attachVolume(instanceId, volumeId)
    console.log(`Attached volume: ${volumeId} to instance: ${instanceId}`)
  } catch (err) {
    console.error('Could not attach volume:', err)
  }
}

async function detachVolume (volumeId) {
  const params = {
    VolumeId: volumeId
  }
  const command = new DetachVolumeCommand(params)
  return sendCommand(command)
}

async function attachVolume (instanceId, volumeId) {
  const params = {
    InstanceId: instanceId,
    VolumeId: volumeId,
    Device: '/dev/sdf' // --> this is kind of a linux like mounting
  }

  const command = new AttachVolumeCommand(params)
  return sendCommand(command)

}

execute()
