
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { applyMiddleware, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers'

import reducers from './reducers'
import sagas from './sagas'

const navigationMiddleware = createReactNavigationReduxMiddleware('AuthLoading', state => state.nav)

const persistConfig = {
  key: 'v0.0.6',
  storage: storage,
  // whitelist: ['account', 'storage', 'jobs', 'circle']
}

export default () => {
  /* sagas */
  const sagaMiddleware = createSagaMiddleware(sagas)

  /* redux store create */
  const middleware = applyMiddleware(...[
    navigationMiddleware,
    sagaMiddleware
  ])
  const persistedReducer = persistReducer(persistConfig, reducers)
  const store = createStore(persistedReducer, middleware)
  sagaMiddleware.run(sagas)
  store.persist = persistStore(store)
  return store
}