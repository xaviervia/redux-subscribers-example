const {createStore} = require('redux')
const serverSubscriber = require('./subscribers/server')
const loggerSubscriber = require('./subscribers/logger')

const initialState = {
  port: undefined,
  serverStatus: 'OFF',
  messages: []
}

const reducer = (state, {type, payload}) => {
  switch (type) {
    case 'SETUP':
      return {
        ...state,
        port: payload.port,
        serverStatus: 'STARTING'
      }

    case 'SERVER_UP':
      return {
        ...state,
        serverStatus: 'ON'
      }

    case 'CLIENT_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, payload]
      }

    default:
      return state
  }
}

const store = createStore(reducer, initialState)

store.subscribe(serverSubscriber(store))
store.subscribe(loggerSubscriber(store))

store.dispatch({
  type: 'SETUP',
  payload: {
    port: 8080
  }
})
