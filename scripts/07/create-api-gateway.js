// Imports
const {
  CreateResourceCommand,
  CreateRestApiCommand,
  GetResourcesCommand,
  PutIntegrationCommand,
  PutMethodCommand
} = require('@aws-sdk/client-api-gateway')
const { sendAPIGatewayCommand: sendCommand } = require('./helpers')

// Declare local variables
const apiName = 'hamster-api'

async function execute () {
  try {
    const response = await createRestApi(apiName)
    const apiData = response

    const rootResourceId = await getRootResource(apiData)

    const hbflResourceId = await createResource(rootResourceId, 'hbfl', apiData)
    await createResourceMethod(hbflResourceId, 'GET', apiData)
    await createMethodIntegration(hbflResourceId, 'GET', apiData)

    const proxyResourceId = await createResource(hbflResourceId, '{proxy+}', apiData)
    await createResourceMethod(proxyResourceId, 'ANY', apiData, 'proxy')
    await createMethodIntegration(proxyResourceId, 'ANY', apiData, 'proxy')

    console.log('API creation complete')
  } catch (err) {
    console.error('Error creating API Gateway API:', err)
  }
}

async function createRestApi (apiName) {
  const params = {
    name: apiName
  }
  const command = new CreateRestApiCommand(params)
  return sendCommand(command) 
}

async function getRootResource (api) {
  const params = {
    restApiId: api.id
  }
  const command = new GetResourcesCommand(params)
  const response = await sendCommand(command) 
  const rootResource = response.items.find(r => r.path === '/')
  return rootResource.id 
}

async function createResource (parentResourceId, resourcePath, api) {
  const params = {
    parentId: parentResourceId,
    pathParh: resourcePath,
    restApiId: api.id
  }

  const command = new CreateResourceCommand(params)
  const response = await sendCommand(command)
  return response.id
}

async function createResourceMethod (resourceId, method, api, path) {
 const params = {
  authorizationType: 'NONE', //won't be secured
  httpMethod: method,
  resourceId: resourceId,
  restApiId: api.id
 }
  if (path) {
    params.requestParameters = {
      [`method.request.path.${path}`]: true /* is telling our resource method that we're going to have a parameter 
      on the path of the URI, the value of which is whatever is passed into the function in the path argument.
       For instance, in our case it's going to be proxy. This is basically how you define parameters on your path 
       for a resource method. And this is similar to how you would add query parameters if you were going to use them. */
    }
  }
 const command = new PutMethodCommand(params)
 return sendCommand(command)

}

async function createMethodIntegration (resourceId, method, api, path) {
  const params = {
    httpMethod: method,
    resourceId: resourceId,
    restApiId: api.id,
    integrationHttpMethod: method,
    type: 'HTTP_PROXY', //There are several different types of integrations like sending it to a lambda function or using it as a mock or sending it to an AWS resource
    uri: 'http//<LOAD_BALANCER_URI>'
  }
  if (path) {
    params.uri += `/{${path}}`
    params.requestParameters = {
      [`integration.request.path.${path}`]: `method.request.path.${path}` //that will configure path parameters for poxing
    }
  }

  const command = new PutIntegrationCommand(params)
  return sendCommand(command)
}

execute()
