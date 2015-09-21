# Array mutations

[![Build Status](https://travis-ci.org/kimmobrunfeldt/arr-mutations.svg?branch=master)](https://travis-ci.org/kimmobrunfeldt/arr-mutations)

Calculate all mutation operations between two arrays. Supports a generic equals predicate function.

## Install

```
npm install arr-mutations
```

## Usage

```js
var mutations = require('arr-mutations');

mutations([1, 2], [2, 3]);
//=> [{type: 'add', item: 3}, {type: 'remove', item: 1}]

mutations([2, 2, 2], [2, 2]);
//=> [{type: 'remove', item: 2}]

mutations([2, 2, 3, 2], [2, 3, 3, 2]);
//=> [{type: 'add', item: 3}, {type: 'remove', item: 2}]

// Items are matched in order from the new array, consider this example:
var first = [{id: 1, name: 'a'}, {id: 1, name: 'b'}, {id: 1, name: 'c'}];
var second = [{id: 1, name: 'aa'}, {id: 1, text: 'bb'}];
mutations(first, second, {
	equals: function(a, b) { return a.id === b.id; }
});
//=> [
//     {type: 'change', old: {id: 1, name: 'a'}, item: {id: 1, name: 'aa'}},
//     {type: 'change', old: {id: 1, name: 'b'}, item: {id: 1, text: 'bb'}},
//     {type: 'remove', item: {id: 1, name: 'c'}}
//   ]

var first = [{id: 1, text: 'one'}, {id: 2, text: 'two'}];
var second = [{id: 2, text: 'another'}, {id: 3, text: 'three'}];
mutations(first, second, {
	equals: function(a, b) { return a.id === b.id; }
});
//=> [
//     {type: 'add', item: {id: 3, text: 'three'}},
//     {type: 'change', old: {id: 2, text: 'two'}, item: {id: 2, text: 'another'}},
//     {type: 'remove', item: {id: 1, text: 'one'}}
//   ]
```

## API

### mutations(old, new, [options])

Returns an array of mutation operations which are needed to convert array `old` to `new`.
When detecting if an item has changed, the items from new array are scanned
from left to right and the first item passing `options.equals` check, will be
considered as the new version of the original item. If that new item also
matches `options.deepEquals`, it will be listed as a changed item.

Returned mutation operations are sorted by type.

#### old

*Required*  
Type: `array`

Original array of items.

#### new

*Required*  
Type: `array`

New array of items.

#### options

Type: `object`  

##### options.equals

Type: `function`
Default: `function equals(a, b) { return a === b; }`

Equality function. Should return true if `a` and `b` items are considered
as the same entity. Entity means e.g. single user with id: 1.

If you have e.g. an array of users, this function answers to: **is `a` the same user as `b`?**

##### options.deepEquals

Type: `function`  
Default: `function deepEquals(a1, a2) { return _.isEqual(a1, a2); }`

Deep equality function. Should return true if `a1` is not equal to `a2`.
Used to detect if an entity has changed.

If you have e.g. an array of users, this function answers to:
**is `a2` a changed version `a1`?**


## License

MIT
