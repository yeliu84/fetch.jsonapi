import _ from 'lodash'

class Base {
  constructor(raw) {
    this._raw = raw || {}
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
  findIncluded({ type, id }) {
    return _.find(
      this._raw.included,
      item => item.type === type && item.id === id
    )
  }
}

export class Entity extends Base {
  constructor(...args) {
    super(...args)
    if (!this.data) {
      this.data = this._raw
    }
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
        data: related.map(item => this.findIncluded(item) || item)
      })
    }
    return new Entity(this.findIncluded(related) || related)
  }
  removeRelated(key, id) {
    if (
      !this.data.relationships ||
      !this.data.relationships[key] ||
      !this.data.relationships[key].data
    ) {
      return
    }
    let related = this.data.relationships[key].data
    if (_.isArray(related)) {
      this.data.relationships[key].data = related.filter(item => item.id !== id)
    } else {
      delete this.data.relationships[key]
    }
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
    if (!this.data) {
      this.data = []
    }
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
