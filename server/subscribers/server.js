const {createServer} = require('net')

module.exports = ({getState, dispatch, subscribe}) => {
  let prevState = getState()

  // This will be called on every state update
  return () => {
    const newState = getState()

    // …which is why we check for diff
    if (prevState.port !== newState.port) {

      setupServer({
        // the object we send is part of the state, much like
        // the `mapStateToProps` in Redux
        port: newState.port,

        // we also send handlers that abstract away the calls to
        // `dispatch`, like with `mapDispatchToProps`
        onStart: () => dispatch({
          type: 'SERVER_UP'
        }),

        onCommand: data => {
          const command = JSON.parse(data.toString())

          switch (command.type) {
            case 'MESSAGE':
              return dispatch({
                type: 'CLIENT_MESSAGE',
                payload: command.payload
              })

            case 'CHANGE_PORT':
              // notice how starting the app "immutably" from state diff
              // allows us to reuse the SETUP action
              return dispatch({
                type: 'SETUP',
                payload: {
                  port: parseInt(command.payload, 10)
                }
              })
          }
        }
      })
    }

    // this is the kind of stuff that React is doing under the hood :)
    // so you can imagine it can be abstracted away easily
    prevState = newState
  }
}

// for clarity I keep it here, but this should/could be on a separate file
const setupServer = (() => {
  let server
  let currentPort

  return ({port, onStart, onCommand}) => {
    if (currentPort !== port) {
      if (server) {
        server.close()
      }

      server = createServer(client => {
        client.on('data', onCommand)
      })

      server.listen(port, onStart)

      currentPort = port
    }
  }
})()
