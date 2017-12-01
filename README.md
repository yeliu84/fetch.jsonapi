# fetch.jsonapi

*fetch.jsonapi* is a wrapper on top of the `Fetch API` to let you deal with JSON API endpoints with ease.


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
const siblings = jon.getRalted('siblings')
// `siblings` is an Collection object

// You can get collection's size by `Collection.size()`
console.log(siblings.size())
// -> 5

// You can map data of the collection
console.log(siblings.map(p => g.get('name')).join(', '))
// -> 'Sansa Stark, Arya Stark, Robb Stark, Bran Stark, Rickon Stark'
```

## License

[MIT](LICENSE)
