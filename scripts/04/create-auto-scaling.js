// Imports
const {
  CreateAutoScalingGroupCommand,
  PutScalingPolicyCommand
} = require('@aws-sdk/client-auto-scaling')

const { sendAutoScalingCommand } = require('./helpers')

// Declare local variables
const asgName = 'hamsterASG'
const ltName = 'hamsterLT'
const policyName = 'hamsterPolicy'
const tgArn = 'arn:aws:elasticloadbalancing:eu-central-1:484029862917:targetgroup/hamsterTG/19533ad97194fdf5'

async function execute () {
  try {
    const response = await createAutoScalingGroup(asgName, ltName)
    await createASGPolicy(asgName, policyName)
    console.log('Created auto scaling group with:', response)
  } catch (err) {
    console.error('Failed to create auto scaling group with:', err)
  }
}

function createAutoScalingGroup (asgName, ltName) {
 const params = {
  AutoScalingGroupName: asgName,
  AvailabilityZones: [
    'eu-central-1a',
    'eu-central-1b'
  ],
  LaunchTemplate: {
    LaunchTemplateName: ltName
    // we can add a version here to tag specific one. Otherwise it is Default
  },
  MaxSize: 2,
  MinSize: 1,
  TargetGroupARNs: [ tgArn ] 
 }
 const command = new CreateAutoScalingGroupCommand(params)
 return sendAutoScalingCommand(command)
}

function createASGPolicy (asgName, policyName) {
  const params = {
    AdjustmentType: 'ChangeInCapacity',
    AutoScalingGroupName: asgName,
    PolicyName: policyName,
    PolicyType: 'TargetTrackingScaling',
    TargetTrackingConfiguration: {
      TargetValue: 5,
      PredefinedMetricSpecification : {
        PredefinedMetricType: 'ASGAverageCPUUtilization'
      }
    }
  }
const command = new PutScalingPolicyCommand(params)
return sendAutoScalingCommand(command)

}

execute()