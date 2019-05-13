# fetch.jsonapi

*fetch.jsonapi* is a wrapper on top of the [Fetch API][] to let you deal with [JSON:API][] endpoints with ease.



## Install

    yarn add fetch.jsonapi

or

    npm install fetch.jsonapi



## How to use

```javascript
import request from 'fetch.jsonapi'

const jon = await request.get('/lords/1')
// `jon` is an Entity object

// The `id` attribute is exposed on the object
console.log(jon.id)
// -> 1

// The `type` attribute is exposed on the object
console.log(jon.type)
// -> 'lord'

// You can get other attributes by `Entity.get(key)`
console.log(jon.get('name'))
// -> 'Jon Snow'

// You can get relationships by `Entity.getRelated(key)`
const siblings = jon.getRelated('siblings')
// `siblings` is an Collection object

// You can get collection's size by `Collection.size()`
console.log(siblings.size())
// -> 5

// You can map data of the collection
console.log(siblings.map(person => person.get('name')).join(', '))
// -> 'Sansa Stark, Arya Stark, Robb Stark, Bran Stark, Rickon Stark'
```



## API


### request

The `request` object wraps the [Fetch API][] and exposes five convenient methods `get`, `post`, `put`, `patch` and `delete` to send HTTP request and returns the [Entity](#entity-class) or [Collection](#collection-class) object by parsing the response.

**request.get(url, [options])**

Send a `GET` http request.

* `url` {String|Entity|Collection} The URL of the request
* `options` {Object} Optional options object which [fetch][] accepts

**request.post(url, data, [options])**

Send a `POST` http request.

* `url` {String} The URL of the request
* `data` {Object|Entity|Collection} The body of the request
* `options` {Object} Optional options object which [fetch][] accepts

**request.put(url, data, [options])**

Send a `PUT` http request.

* `url` {String} The URL of the request
* `data` {Object|Entity|Collection} The body of the request
* `options` {Object} Optional options object which [fetch][] accepts

**request.patch(url, data, [options])**

Send a `PATCH` http request.

* `url` {String} The URL of the request
* `data` {Object|Entity|Collection} The body of the request
* `options` {Object} Optional options object which [fetch][] accepts

**request.delete(url, data, [options])**

Send a `PATCH` http request.

* `url` {String} The URL of the request
* `data` {Object|Entity|Collection} The body of the request
* `options` {Object} Optional options object which [fetch][] accepts


### Entity class

An instance of the `Entity` class represents a single [resource][Resource Objects] object.

**Entity.id**

The `ID` of the resource object.

**Entity.type**

The `type` of the resource object.

**Entity.get(key)**

Get an attribute value

* `key` {String} The key of the attribute

**Entity.getRelated(key)**

Get a related resource from the `relationships` field. If the resource is available from the `included` field, the full resource object will be returned.

* `key` {String} The key of the resource object(s)

**Entity.toJSON()**

Get a plain object which is suitable for serialization, e.g. to be used as the `data` field of the [request](#request) methods.

**Entity.clone()**

Create a clone of the entity instance.

**Entity.getLink(key)**

Get a link from the `links` field.

* `key` {String} The key of the link

**Entity.getMeta(key)**

Get a meta value from the `meta` field.

* `key` {String} The key of the meta value


### Collection class

An instance of the `Collection` class represents a collection of [resource][Resource Objects] objects.

**Collection.get(id)**

Get the entity with `id` from the collection.

* `id` {String} The id of the entity

**Collection.getAt(i)**

Get the entity at index `i` 

* `i` {Int} The index of the entity

**Collection.set(item)**

Update an entity in the collection; or, append the entity to the collection if it is not already in the collection.

* `item` {Entity} The entity to update or add to the collection

**Collection.size()**

Get the size of the collection.

**Collection.each(fn)**

Execute the provided function `fn` for each entity of the collection.

* `fn` {Function} The function to execute on each entity

**Collection.map(fn)**

Create an array of Entity with the results of calling a provided function on every entity in the collection.

* `fn` {Function} The function that produces an element of the new array

**Collection.filter(fn)**

Create an array of Entity with all entities that pass the test implemented by the provided function.

* `fn` {Function} The function to test each entity of the collection

**Collection.sort(comparator)**

Sort the entities of the collection in place.

* `comparator` {Function} The function to define the sorting order

**Collection.toJSON()**

Get a plain array of the collection, `Entity.toJSON()` is used to produce the elements of the array.

**Collection.getLink(key)**

Get a link from the `links` field.

* `key` {String} The key of the link

**Collection.getMeta(key)**

Get a meta value from the `meta` field.

* `key` {String} The key of the meta value



## License

[MIT](LICENSE)

[Fetch API]: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
[fetch]: https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch
[JSON:API]: https://jsonapi.org
[Resource Objects]: https://jsonapi.org/format/#document-resource-objects
