import fetchJson from 'fetch.json'
import { Entity, Collection } from './entity'
import { buildUrl } from './utils'

const createEntity = raw => {
  if (_.isArray(raw.data)) {
    return new Collection(raw)
  }
  return new Entity(raw)
}

const jsonApi = fetchFn => {
  return (url, data, options) => {
    if (data) {
      if (_.isFunction(data.toJSON)) {
        data = data.toJSON()
      }
      data = { data }
    }
    if (fetchFn === fetchJson.get) {
      if (data && !options) {
        options = data
      }
      url = buildUrl(url, options)
    }
    return fetchFn(url, data, options).then(createEntity)
  }
}

const request = {}
;['get', 'post', 'put', 'patch', 'delete'].forEach(method => {
  request[method] = jsonApi(fetchJson[method])
})

request.headers = fetchJson.headers.bind(jsonApi)

export {
  request,
  Entity,
  Collection,
  buildUrl
}

export default request
