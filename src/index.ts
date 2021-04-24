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
