import qs from 'query-string'

const paramsToString = (query, options) =>
  [query || ''].concat(options).filter(v => v).join(',') || undefined

export const buildUrl = (originalUrl, options = {}) => {
  const { url, query = {} } = qs.parseUrl(originalUrl)
  options = Object.assign({}, options)

  query.include = paramsToString(query.include, options.include)
  query.sort = paramsToString(query.sort, options.sort)
  Object.keys(options.filter || {}).forEach(k => {
    const filterKey = `filter[${k}]`
    query[filterKey] = paramsToString(query[filterKey], options.filter[k])
  })
  Object.keys(options.page || {}).forEach(k => {
    const pageKey = `page[${k}]`
    query[pageKey] = options.page[k]
  })

  delete options.include
  delete options.sort
  delete options.filter
  delete options.page
  Object.assign(query, options)

  const queryString = qs.stringify(query)
  return queryString ? `${url}?${queryString}` : url
}

export default {
  buildUrl
}
