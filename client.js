const {connect} = require('net')

const client = connect({port: parseInt(process.argv[3])})

client.write(JSON.stringify({
  type: process.argv[2],
  payload: process.argv[4]
}))

client.end()
