import fetchJson from 'fetch.json'
import { Entity, Collection } from './entity'

const createEntity = raw => {
  if (_.isArray(raw.data)) {
    return new Collection(raw)
  }
  return new Entity(raw)
}

const jsonApi = fetchFn => {
  return (url, data) => {
    if (data) {
      if (_.isFunction(data.toJSON)) {
        data = data.toJSON()
      }
      data = { data }
    }
    return fetchFn(url, data).then(createEntity)
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
  Collection
}

export default request
