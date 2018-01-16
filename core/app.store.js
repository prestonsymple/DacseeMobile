
// import { AsyncStorage } from 'react-native'
import { persistStore } from 'redux-persist'
import { applyMiddleware, createStore, combineReducers } from 'redux'
import { AsyncStorage } from 'react-native'
import createSagaMiddleware from 'redux-saga'
import logger from 'redux-logger'


/* Redux Reducers */
import reducers from './redux/reducers'
/* Redux Sagas */
import sagas from './redux/sagas'

export default () => {
  /* sagas */
  const sagaMiddleware = createSagaMiddleware(sagas)

  /* redux store create */
  const middleware = applyMiddleware(...[
    sagaMiddleware,
    // logger
  ])
  const store = createStore(reducers, middleware)
  sagaMiddleware.run(sagas)
  // store.persist = persistStore(store)
  return store
}
