
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { applyMiddleware, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers'
// import logger from 'redux-logger'

const navigationMiddleware = createReactNavigationReduxMiddleware(
  'AuthLoading',
  state => state.nav,
);

const persistConfig = {
  key: 'v0.0.1',
  storage: storage,
  whitelist: ['account', 'storage', 'jobs']
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
    navigationMiddleware
    // logger
  ])
  const persistedReducer = persistReducer(persistConfig, reducers)
  const store = createStore(persistedReducer, middleware)
  sagaMiddleware.run(sagas)
  store.persist = persistStore(store)
  return store
}
