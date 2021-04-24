import { expect, use } from 'chai'
import { wrap } from 'prochain'
import cap from 'chai-as-promised'

use(cap)

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

  /** property */
  baz = 3

  /** getter */
  get qux() {
    return this.baz
  }
}

it('basic support', async () => {
  const a = wrap(new A())
  await expect(a.foo().bar().foo().bar().bar().qux).to.eventually.equal(3)
  expect(output).to.equal('12122')
})
