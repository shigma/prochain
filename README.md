# prochain

Proxified Promise Chain in JavaScript.

It allows for method and property chaining without need for intermediate then() or await for cleaner and simpler code.

```js
const { wrap } = require('prochain')
 
// Instead of thens
fetch(url)
  .then(res => res.json())
  .then(json => json.foo.bar)
  .then(value => console.log(value))

// Instead of awaits
const res = await fetch(url)
const json = await res.json()
const value = json.foo.bar
console.log(value)

// With prochain
const value = await wrap(fetch(url)).json().foo.bar
console.log(value)

// Or you can even create a wrapped fetch
const wrapFetch = wrap(fetch)
const value = await wrapFetch(url).json().foo.bar
console.log(value)
```
