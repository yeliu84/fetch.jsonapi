import fetchJson from 'fetch.json'
import { Entity, Collection } from './entity'
import { buildUrl } from './utils'

const createEntity = raw => {
  if (_.isArray(raw.data)) {
    return new Collection(raw)
  }
  return new Entity(raw)
}

const wrapFetch = (createEntity, fetch, method) => {
  return (url, data, options) => {
    if (data) {
      if (_.isFunction(data.toJSON)) {
        data = data.toJSON()
      }
      data = { data }
    }
    if (method === 'get') {
      if (data && !options) {
        options = data
      }
      url = buildUrl(url, options)
    }
    return fetch[method](url, data, options).then(createEntity)
  }
}

const request = {}
const wrapper = wrapFetch.bind(null, createEntity)
;['get', 'post', 'put', 'patch', 'delete'].forEach(method => {
  request[method] = wrapper(fetchJson, method)
})

request.headers = fetchJson.headers.bind(request)

export {
  request,
  Entity,
  Collection,
  createEntity,
  wrapFetch,
  buildUrl
}

export default request
