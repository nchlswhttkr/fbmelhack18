import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'

import * as reducers from '../ducks'

const root = combineReducers(reducers)

const logger = createLogger({
  collapsed: true
})

const store = createStore(root, applyMiddleware(thunk, logger))

export default store
