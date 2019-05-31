import fetchJson from 'fetch.json'
import { Entity, Collection } from './entity'
import { buildUrl } from './utils'

const createEntity = raw => {
  if (!raw.data) {
    raw = { data: raw }
  }
  if (_.isArray(raw.data)) {
    return new Collection(raw)
  }
  return new Entity(raw)
}

const wrapFetch = (createEntity, fetch, method) => {
  return (url, payload, options) => {
    if (method === 'get') {
      if (payload && !options) {
        options = payload
        payload = null
      }
      url = buildUrl(url, options)
    }
    if (payload) {
      if (_.isFunction(payload.toJSON)) {
        payload = payload.toJSON()
      }
      payload = payload.data ? payload : { data: payload }
    }
    return fetch[method](url, payload, options).then(createEntity)
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
