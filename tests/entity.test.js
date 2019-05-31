import { Entity } from '../src/entity';
import entityData from './data-entity.json'

test('Entity can get links', () => {
  const entity = new Entity(entityData)
  expect(entity.getLink('self')).toBeTruthy()
  expect(entity.getLink('next')).toBeTruthy()
  expect(entity.getLink('last')).toBeTruthy()
})

test('Entity can get meta', () => {
  const entity = new Entity(entityData)
  expect(entity.getMeta('copyright')).toBeTruthy()
  expect(entity.getMeta('authors').length).toBeGreaterThan(0)
})

test('Entity has type', () => {
  const entity = new Entity(entityData)
  expect(entity.type).toBe('articles')
})

test('Entity has id', () => {
  const entity = new Entity(entityData)
  expect(entity.id).toBe('1')
})

test('Entity can get attribute', () => {
  const entity = new Entity(entityData)
  expect(entity.get('title')).toBeTruthy()
})

test('Entity can be converted to plain object', () => {
  const entity = new Entity(entityData)
  const obj = entity.toJSON()
  expect(obj.id).toBe('1')
  expect(obj.type).toBe('articles')
  expect(obj.attributes).toBeDefined()
  expect(obj.attributes.title).toBeTruthy()
})

test('Entity can get related resource', () => {
  const entity = new Entity(entityData)
  const related = entity.getRelated('author')
  expect(related).toBeTruthy()
  expect(related.type).toBe('people')
  expect(related.id).toBe('9')
})

test('Entity can get related resource with included data', () => {
  const entity = new Entity(entityData)
  const related = entity.getRelated('author')
  expect(related.get('firstName')).toBeTruthy()
  expect(related.get('lastName')).toBeTruthy()
})

test('Entity can get related resource with nested related data', () => {
  const entity = new Entity(entityData)
  const author = entity.getRelated('author')
  const avatar = author.getRelated('avatar')
  expect(avatar).toBeTruthy()
  expect(avatar.get('url')).toBeTruthy()
})

test('Resource with ID can be added to entity relationships', () => {
  const entity = new Entity(entityData)
  const dummyData = {
    type: 'dummy-entity',
    id: 'some-id',
  }
  const dummyEntity = new Entity({ data: dummyData })
  entity.setRelated('dummy-entity', dummyEntity)
  expect(entity.data.relationships['dummy-entity'].data.id).toBe(dummyData.id)
  expect(entity.data.relationships['dummy-entity'].data.type).toBe(dummyData.type)
  expect(entity.data.relationships['dummy-entity'].data.attributes).toBeFalsy()
})

test('Resource without ID can be added to entity relationships with lid', () => {
  const entity = new Entity(entityData)
  const dummyData = {
    type: 'dummy-entity'
  }
  const dummyEntity = new Entity({ data: dummyData })
  entity.setRelated('dummy-entity', dummyEntity)
  expect(entity.data.relationships['dummy-entity'].data.type).toBe(dummyData.type)
  expect(entity.data.relationships['dummy-entity'].data.lid).toBeTruthy()
})

test('Resource with attributes can be added to entity included', () => {
  const entity = new Entity(entityData)
  const dummyData = {
    type: 'dummy-entity',
    id: 'some-id',
    attributes: {
      name: 'Leonard'
    }
  }
  const dummyEntity = new Entity({ data: dummyData })
  entity.setRelated('dummy-entity', dummyEntity)
  const included = entity.findIncluded(dummyData)
  expect(included.id).toBe(dummyData.id)
  expect(included.type).toBe(dummyData.type)
  expect(included.attributes.name).toBe(dummyData.attributes.name)
})

test('Resource with attributes without ID can be added to entity included with lid', () => {
  const entity = new Entity(entityData)
  const dummyData = {
    type: 'dummy-entity',
    attributes: {
      name: 'Leonard'
    }
  }
  const dummyEntity = new Entity({ data: dummyData })
  entity.setRelated('dummy-entity', dummyEntity)
  const included = entity._raw.included.find(item => item.type === dummyData.type)
  expect(included.lid).toBeTruthy()
  expect(included.type).toBe(dummyData.type)
  expect(included.attributes.name).toBe(dummyData.attributes.name)
})
