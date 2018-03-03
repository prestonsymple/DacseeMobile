/* global store */
import Path from 'path-parser'
import { NavigationActions } from 'react-navigation'

const paths = [
  {
    routeName: 'SettingLanguageRegion',
    path: new Path('/lauguage/:paramB'),
  },
]

const findPath = url => paths.find(path => path.path.test(url))
const LinkRoutes = url => {
  const pathObject = findPath(url)
  
  if (!pathObject) return

  const navigateAction = NavigationActions.navigate({
    routeName: pathObject.routeName,
    params: pathObject.path.test(url)
  })

  store.dispatch(navigateAction)
}

export default LinkRoutes