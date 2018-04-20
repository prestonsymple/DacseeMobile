import LocationService from '../native/location-service'


export default {
  view: {},
  session: {},
  map: {
    location: new LocationService()
  }
}