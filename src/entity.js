import _ from 'lodash'

const getRandomId = () =>
  `${Math.floor(Math.random() * (100000 - 10000)) + 10000}`

const normalizeRawData = (raw) => {
  raw = _.cloneDeep(raw)
  return raw.data ? raw : { data: raw }
}

class Base {
  constructor(raw) {
    this._raw = normalizeRawData(raw)
    this.data = this._raw.data
  }
  getLink(key) {
    if (this._raw.links) {
      return this._raw.links[key]
    }
    return null
  }
  getMeta(key) {
    if (this._raw.meta) {
      return this._raw.meta[key]
    }
    return null
  }
  toJSON() {
    throw new Error('not implemented error')
  }
  getRaw() {
    return this._raw
  }
  findIncluded({ type, id, lid }) {
    return (this._raw.included || []).find((item) => {
      if (item.type !== type) {
        return false
      }
      if (item.id) {
        return item.id === id
      }
      if (item.lid) {
        return item.lid === lid
      }
      return false
    })
  }
  removeIncluded({ type, id, lid }) {
    if ((this._raw.included || []).length < 1) {
      return
    }
    this._raw.included = this._raw.included.filter(item => {
      if (item.type !== type) {
        return true
      }
      if (item.id) {
        return item.id !== id
      }
      if (item.lid) {
        return item.lid !== lid
      }
      return true
    })
  }
}

export class Entity extends Base {
  constructor(...args) {
    super(...args)
    this.id = this.data.id
    this.type = this.data.type
    this.source = this.data.source
  }
  get(key) {
    return this.data.attributes[key]
  }
  getRelated(key) {
    if (
      !this.data.relationships ||
      !this.data.relationships[key] ||
      !this.data.relationships[key].data
    ) {
      return null
    }
    let related = this.data.relationships[key].data
    if (_.isArray(related)) {
      return new Collection({
        data: related.map(item => this.findIncluded(item) || item),
        included: this._raw.included
      })
    }
    return new Entity({
      data: this.findIncluded(related) || related,
      included: this._raw.included
    })
  }
  setRelated(key, resource, replace = true) {
    if (resource.toJSON) {
      resource = resource.toJSON()
    }
    let related = []
    const included = []
    ;[].concat(resource).forEach(item => {
      if (item.toJSON) {
        item = item.toJSON()
      }
      if (!item.id) {
        item.lid = getRandomId()
      }
      if (!_.isEmpty(item.attributes)) {
        included.push(Object.assign({}, item))
      }

      delete item.attributes
      related.push(item)
    })
    if (!_.isArray(resource)) {
      related = related[0]
    }

    this.data.relationships = this.data.relationships || {}
    if (replace) {
      this.removeRelated(key)
    }
    this.data.relationships[key] = this.data.relationships[key] || {}
    const data = this.data.relationships[key].data
    this.data.relationships[key].data = data
      ? [].concat(data, related)
      : related

    if (included.length > 0) {
      this._raw.included = (this._raw.included || []).concat(included)
    }

    return this
  }
  addRelated(key, resource) {
    return this.setRelated(key, resource, false)
  }
  removeRelated(key, id) {
    if (
      !this.data.relationships ||
      !this.data.relationships[key] ||
      !this.data.relationships[key].data
    ) {
      return null
    }

    const related = (this.data.relationships[key] || {}).data
    if (!related) {
      return null
    }

    if (_.isArray(related) && id) {
      this.data.relationships[key].data = related.filter(item => item.id !== id)
    } else {
      delete this.data.relationships[key]
    }
    [].concat(related).forEach(this.removeIncluded.bind(this))

    return related
  }
  toJSON() {
    return {
      id: this.data.id,
      type: this.data.type,
      attributes: _.cloneDeep(this.data.attributes)
    }
  }
  clone() {
    return new Entity(this._raw)
  }
}

export class Collection extends Base {
  constructor(...args) {
    super(...args)
    this.data = this.data.map(item => {
      item.included = this._raw.included
      return new Entity(item)
    })
  }
  get(id) {
    return _.find(this.data, item => item.id === id)
  }
  getAt(i) {
    return this.data[i]
  }
  set(item) {
    const i = _.findIndex(this.data, _item => _item.id === item.id)
    if (i < 0) {
      this.data.push(item)
      if (this._raw.meta) {
        this._raw.meta.recordsTotal++
      }
    } else {
      this.data[i] = item
    }
  }
  size() {
    return this.data.length
  }
  each(fn) {
    this.data.forEach(fn)
  }
  map(fn) {
    return this.data.map(fn)
  }
  filter(fn) {
    return this.data.filter(fn)
  }
  sort(comparator) {
    this.data = this.data.sort(comparator)
    return this
  }
  getPageNumber() {
    const pageNumber = this.getMeta('pageNumber')
    if (pageNumber) {
      return parseInt(pageNumber)
    }
    return -1
  }
  toJSON() {
    return this.data.map(entity => entity.toJSON())
  }
}
