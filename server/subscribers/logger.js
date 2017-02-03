const {createServer} = require('net')

module.exports = ({getState}) => {
  let prevState = getState()

  // This will be called on every state update
  return () => {
    const newState = getState()

    // …which is why we check for diff
    if (prevState.serverStatus !== newState.serverStatus) {
      console.log(getMessage(newState))
    }

    if (prevState.messages.length !== newState.messages.length) {
      console.log(
        `new message: ${newState.messages[newState.messages.length - 1]}`
      )

      if (prevState.messages.length > 0) {
        console.log(`previous messages:\n- ${prevState.messages.join('\n- ')}`)
      }
    }

    // this is the kind of stuff that React is doing under the hood :)
    // so you can imagine it can be abstracted away easily
    prevState = newState
  }
}

// for clarity I keep it here, but this should/could be on a separate file
const getMessage = ({serverStatus, port}) => {
  switch (serverStatus) {
    case 'OFF':
      return 'server is offline'

    case 'STARTING':
      return `server starting on port ${port}`

    case 'ON':
      return `server running on port ${port}`
  }
}
