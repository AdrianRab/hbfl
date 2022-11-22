// Imports
const {
  PutMetricAlarmCommand
} = require('@aws-sdk/client-cloudwatch')
const { sendCloudWatchCommand: sendCommand } = require('./helpers')

// Declare local variables
const alarmName = 'hamster-elb-alarm'
const topicArn = '/* TODO: Add your SNS topic ARN SNS::Topics::ARN*/'
const tg = '/* TODO: Add last part of Target Group ARN EC2::Load Balancing::Target Groups::<hamsterTG> last part after a colon(:)*/'
const lb = '/* TODO: Add last part of Load Balancer ARN EC2::Load Balancing::Load Balancers::<hamsterLB> last part after a loadbalancer/ */'

async function execute () {
  try {
    const response = await createCloudWatchAlarm(alarmName, topicArn, tg, lb)
    console.log(response)
  } catch (err) {
    console.error('Error creating CloudWatch alarm:', err)
  }
}

function createCloudWatchAlarm (alarmName, topicArn, tg, lb) {
  const params = {
    AlarmName: alarmName,
    ComparisonOperator: 'LessThanThreshold',
    EvaluationPeriods: 1,
    MetricName: 'HealthyHostCound',
    Namespace: 'AWS/ApplicationELB',
    Period: 60,
    Threshold: 1,
    AlarmActions: [
      topicArn
    ],
    Dimensions: [
      {
        Name: 'TargetGroup',
        Value: tg
      },
      {
        Name: 'LoadBalancer',
        Value: lb
      }
    ],
    Statistic: 'Average', //Other possible options here are Minimum, Maximum, Sum, and Sample Count
    TreatMissingData: 'breaching'
  }

  const command = new PutMetricAlarmCommand(params)
  return sendCommand(command)
}

execute()
