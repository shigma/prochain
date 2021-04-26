type WrapFunction<T, U = Promise<T>> = T extends (...args: infer R) => infer S ? (...args: R) => Wrap<S> : U
type WrapSync<T> = WrapFunction<T, { [P in keyof T]: WrapFunction<T[P]> }> & Promise<T>

export type Wrap<T> = WrapSync<T extends Promise<infer U> ? U : T>

const asyncMethods = ['then', 'catch', 'finally'] as (keyof any)[]

export function wrap<T>(target: T): Wrap<T> {
  const promise = Promise.resolve<any>(target)
  return new Proxy(function () {} as any, {
    get(_, prop) {
      return asyncMethods.includes(prop)
        ? (...args) => wrap(promise[prop](...args))
        : wrap(promise.then(target => target[prop]))
    },
    apply(_, thisArg, args) {
      return wrap(promise.then(target => Reflect.apply(target, thisArg, args)))
    },
  })
}

type WrapDecAttrName = 'stream'

type WrapT<
  T extends Function,
  S extends string = WrapDecAttrName
> = T & {
  [K in S]: Wrap<T>
}

type WrapDec = {
  <T extends Function>(
    target: T
  ): T

  <S extends string = WrapDecAttrName>(
    target: S
  ): <T extends Function>(target: T) => WrapT<T>
}

export const wrapDec: WrapDec = (target) => {
  const returnDec = <
    T extends { new (...args: any[]): {} }
  >(constructor: T) => {
    return class extends constructor {
      constructor(...args: any) {
        super(...args)
        if (typeof target !== 'string') {
          target = 'stream'
        }
        this[target] = wrap(this)
      }
    }
  }

  if (typeof target === 'string') {
    return returnDec
  } else {
    return returnDec(target)
  }
}
