// Imports
const {
  ChangeResourceRecordSetsCommand
} = require('@aws-sdk/client-route-53')
const { sendRoute53Command: sendCommand } = require('./helpers')

// Declare local variables
const hzId = '/* TODO: Add your hostedzone id which is returned when creating hostedzone*/'

async function execute () {
  try {
    const response = await createRecordSet(hzId)
    console.log(response)
  } catch (err) {
    console.error('Error creating record set:', err)
  }
}

async function createRecordSet (hzId) {
  const params = {
    HostedZoneId: hzId,
    ChangeBatch: {
      Changes: [
        {
          Action: 'CREATE',
          ResourceRecordSet: {
            Name: 'hbfl.online', //this is the DNS name for the record
            Type: 'A',
            AliasTarget: {
              DNSName: 'load-balancer-DNS name', //this is the internal AWS DNS name
              EvaluateTargetHealth: false,
              HostedZoneId: 'Z215JYRZR1TBD5' /*don't get this confused with the HostedZoneId at the root of our params object.
               This is actually the HostedZoneId of the Elastic Load Balancer, value taken from 
               https://docs.aws.amazon.com/general/latest/gr/elb.html Application Load Balancers for region where we deploying.
               */
            }
          }
        }
      ]
    }
  }
  
  // Link to ELB Regions:
  // https://docs.aws.amazon.com/general/latest/gr/elb.html
  const command = new ChangeResourceRecordSetsCommand(params)
  return sendCommand(command)

}

execute()
