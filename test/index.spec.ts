import { expect } from 'chai'
import { wrap } from 'prochain'
import 'chai-as-promised'

let output = ''

class A {
  /** sync method */
  foo() {
    output += '1'
    return this
  }

  /** async method */
  async bar() {
    output += '2'
    return this
  }
}

it('basic support', async () => {
  const a = wrap(new A())
  await a.foo().bar().foo().bar().bar()
  expect(output).to.equal('12122')
})
