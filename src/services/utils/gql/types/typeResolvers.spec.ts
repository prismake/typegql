import { resolveType } from './typeResolvers'

describe('resolveType', function() {
  it('should resolve an array type', () => {
    expect(resolveType([Number])).toMatchInlineSnapshot(`"[Float!]!"`)
  })

  it('should resolve a thunk returning an array type', () => {
    expect(resolveType(() => [Number])).toMatchInlineSnapshot(`"[Float!]!"`)
  })
})
