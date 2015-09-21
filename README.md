# Array changes

[![Build Status](https://travis-ci.org/kimmobrunfeldt/arr-changes.svg?branch=master)](https://travis-ci.org/kimmobrunfeldt/arr-changes)

Calculate all mutation operations between two arrays. Supports a generic equals predicate function.

## Install

```
npm install arr-changes
```

## Usage

```js
var changes = require('arr-changes');

changes([1, 2], [2, 3]);
//=> [{type: 'remove', item: 1}, {type: 'add', item: 3}]

var first = [{id: 1, text: 'one'}, {id: 2, text: 'two'}];
var second = [{id: 2, text: 'another'}, {id: 3, text: 'three'}];
changes(first, second, {
	equals: function(a, b) { return a.id === b.id; },
	// Immutable.js
	deepEquals: function(a1, a2) { return a === b; }
});
//=> [
//     {type: 'remove', item: {id: 1, text: 'one'}},
//     {type: 'change', item: {id: 2, text: 'another'}},
//     {type: 'add', item: {id: 3, text: 'three'}}
//   ]
```

## API

### changes(a, b, [options])

Returns an array of mutation operations which are needed to convert array a to b.

#### a

*Required*  
Type: `array`

Original array of items.

#### b

*Required*  
Type: `array`

New array of items.

#### options

Type: `object`  

##### options.equals

Type: `function`
Default: `function equals(a, b) { return a === b; }`

Equality function. Should return true if `a` and `b` items are considered as the same entity.

##### options.deepEquals

Type: `function`  
Default: `function deepEquals(a1, a2) { return _.isEqual(a1, a2); }`

Deep equality function. Should return true if `a1` is not equal to `a2`. Used to detect if an entity has changed.


## License

MIT
