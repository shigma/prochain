import { expect, use } from 'chai'
import { Wrap, wrap, wrapDec } from 'prochain'
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

describe('simple', async () => {
  it('basic support', async () => {
    const a = wrap(new A())
    await expect(a.foo().bar().foo().bar().bar().qux).to.eventually.equal(3)
    expect(output).to.equal('12122')
  })
})

describe('decorator', async () => {
  @wrapDec
  class B extends A {
  }
  interface B { stream: Wrap<B> }

  it('basic support', async () => {
    const b = new B()
    await expect(b.stream.foo().bar().foo().bar().bar().qux)
      .to.eventually.equal(3)
    expect(output).to.equal('12122')
  })

  @wrapDec('stream1')
  class C extends A {
  }
  interface C { stream1: Wrap<C> }

  it('attr param support', async () => {
    const c = new C()
    await expect(c.stream1.foo().bar().foo().bar().bar().qux)
      .to.eventually.equal(3)
    expect(output).to.equal('12122')
  })
})
