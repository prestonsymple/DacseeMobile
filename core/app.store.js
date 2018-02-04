
// import { AsyncStorage } from 'react-native'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { applyMiddleware, createStore } from 'redux'
// import { AsyncStorage } from 'react-native'
import createSagaMiddleware from 'redux-saga'
// import logger from 'redux-logger'

const persistConfig = {
  key: 'v0.0.1',
  storage: storage,
  whitelist: ['account', 'config']
}
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
  const persistedReducer = persistReducer(persistConfig, reducers)
  const store = createStore(persistedReducer, middleware)
  sagaMiddleware.run(sagas)
  store.persist = persistStore(store)
  return store
}
