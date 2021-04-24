type WrapFunction<T, U = never> = T extends (...args: infer R) => infer S ? (...args: R) => Wrap<S> : U
type _Wrap<T> = WrapFunction<T, { [P in keyof T]: WrapFunction<T[P]> }>
export type Wrap<T> = _Wrap<T extends Promise<infer U> ? U : T>

const asyncMethods = ['then', 'catch', 'finally'] as (keyof any)[]

export function wrap<T>(target: T): Wrap<T> {
  const promise = target instanceof Promise ? target : Promise.resolve(target)
  return new Proxy(function () {} as any, {
    get(_, prop) {
      return asyncMethods.includes(prop)
        ? (...args) => wrap(promise[prop](...args))
        : wrap(promise.then(t => Reflect.get(t, prop)))
    },
    apply(_, thisArg, args) {
      return wrap(promise.then(t => Reflect.apply(t, thisArg, args)))
    },
  })
}
