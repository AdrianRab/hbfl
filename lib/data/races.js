// to get data from aws change below datasource 
const dataSource = require('./lib/mock').Race //require('/lib/dynamo')
const TableName = 'races'

function getAll () {
  return dataSource.getAll(TableName)
}

function get (id) {
  return dataSource.get('races', id)
}

async function clearResults () {
  const races = await dataSource.getAll(TableName)
  return races.map((race) => {
    race.results = []
    dataSource.put(TableName, race)
  })
}

module.exports = {
  get,
  getAll,
  clearResults
}
