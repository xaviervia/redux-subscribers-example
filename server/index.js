const {createStore} = require('redux')
const serverSubscriber = require('./subscribers/server')
const loggerSubscriber = require('./subscribers/logger')
const {blue} = require('chalk')

const initialState = {
  port: undefined,
  serverStatus: 'OFF',
  messages: []
}

const reducer = (state, {type, payload}) => {
  // if you want the verbose debugging experience, uncomment these two lines:
  // console.log(blue('old state'), state)
  // console.log(blue('action'), type, payload || '')
  // …and the line on the bottom of the file

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
    port: process.argv[2]
  }
})

// store.subscribe(() => console.log(blue('new state'), store.getState()))
