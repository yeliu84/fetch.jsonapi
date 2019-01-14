import { buildUrl } from '../src/utils'

const url = 'https://somedomain.com'

test('build url with no options', () => {
  expect(buildUrl(url)).toBe(url)
})

test('build url with one include', () => {
  const result = buildUrl(url, {
    include: 'post'
  })
  expect(result).toBe(`${url}?include=post`)
})

test('build url with multiple includes', () => {
  const result = buildUrl(url, {
    include: [
      'post',
      'author'
    ]
  })
  expect(result).toBe(`${url}?include=${encodeURIComponent('post,author')}`)
})

test('build url with one sort', () => {
  const result = buildUrl(url, {
    sort: 'date'
  })
  expect(result).toBe(`${url}?sort=date`)
})

test('build url with multiple sorts', () => {
  const result = buildUrl(url, {
    sort: [
      'date',
      '-votes'
    ]
  })
  expect(result).toBe(`${url}?sort=${encodeURIComponent('date,-votes')}`)
})

test('build url with one sort and one include', () => {
  const result = buildUrl(url, {
    include: 'post',
    sort: 'date'
  })
  expect(result).toBe(`${url}?include=post&sort=date`)
})

test('build url with multiple sorts and includes', () => {
  const result = buildUrl(url, {
    include: [
      'post',
      'author'
    ],
    sort: [
      'date',
      '-votes'
    ]
  })
  expect(result).toBe(`${url}?include=${encodeURIComponent('post,author')}&sort=${encodeURIComponent('date,-votes')}`)
})

test('build url with one filter one value', () => {
  const result = buildUrl(url, {
    filter: {
      author: 'Peter Lynch'
    }
  })
  expect(result).toBe(`${url}?${encodeURIComponent('filter[author]')}=${encodeURIComponent('Peter Lynch')}`)
})

test('build url with one filter multiple values', () => {
  const result = buildUrl(url, {
    filter: {
      author: [
        'Peter Lynch',
        'Steven Pressfield'
      ]
    }
  })
  expect(result).toBe(`${url}?${encodeURIComponent('filter[author]')}=${encodeURIComponent('Peter Lynch,Steven Pressfield')}`)
})

test('build url with multiple filters multiple values', () => {
  const result = buildUrl(url, {
    filter: {
      author: [
        'Peter Lynch',
        'Steven Pressfield'
      ],
      category: [
        'Sci-Fi',
        'Technology',
        'Money'
      ],
      publicDomain: true
    }
  })
  const expected = url +
    '?' + `${encodeURIComponent('filter[author]')}=${encodeURIComponent('Peter Lynch,Steven Pressfield')}` +
    '&' + `${encodeURIComponent('filter[category]')}=${encodeURIComponent('Sci-Fi,Technology,Money')}` +
    '&' + `${encodeURIComponent('filter[publicDomain]')}=true`
  expect(result).toBe(expected)
})

test('build url with page parameters', () => {
  const result = buildUrl(url, {
    page: {
      number: 1,
      size: 500
    }
  })
  expect(result).toBe(`${url}?${encodeURIComponent('page[number]')}=1&${encodeURIComponent('page[size]')}=500`)
})

