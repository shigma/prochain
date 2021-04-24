import { wrap } from '..'

class A {
  foo() {
    console.log('foo')
    return this
  }

  async bar() {
    console.log('bar')
    return this
  }
}

const a = wrap(new A())

a.foo().bar().foo().bar().bar()
