var assert = require('assert');
var mutations = require('../src/index');

describe('arr-mutations', function() {
    it('basic mutations', function() {
        var result = mutations([1, 2], [2, 3]);
        // Mutations are sorted by type
        var expected = [{type: 'add', item: 3}, {type: 'remove', item: 1}];

        assert.deepStrictEqual(result, expected);
    });

    it('basic mutations with duplicates', function() {
        var result = mutations([1, 2, 2], [3, 2, 4]);
        // Mutations are sorted by type
        var expected = [
            {type: 'add', item: 3},
            {type: 'add', item: 4},
            {type: 'remove', item: 1},
            {type: 'remove', item: 2}
        ];

        assert.deepStrictEqual(result, expected);
    });

    it('complex mutations', function() {
        var first = [{id: 1, text: 'one'}, {id: 2, text: 'two'}];
        var second = [{id: 2, text: 'another'}, {id: 3, text: 'three'}];
        var result = mutations(first, second, {
            equals: function(a, b) { return a.id === b.id; }
        });

        var expected = [
            {type: 'add', item: {id: 3, text: 'three'}},
            {type: 'change', old: {id: 2, text: 'two'}, item: {id: 2, text: 'another'}},
            {type: 'remove', item: {id: 1, text: 'one'}}
        ];
        assert.deepStrictEqual(result, expected);
    });

    it('multiple same entities in first array', function() {
        var first = [{id: 1, text: 'one'}, {id: 1, text: 'second one'}];
        var second = [{id: 2, text: 'one changed'}, {id: 3, text: 'changed'}];
        var result = mutations(first, second, {
            equals: function(a, b) { return a.id === b.id; }
        });

        var expected = [
            {type: 'add', item: {id: 2, text: 'one changed'}},
            {type: 'add', item: {id: 3, text: 'changed'}},
            {type: 'remove', item: {id: 1, text: 'one'}},
            {type: 'remove', item: {id: 1, text: 'second one'}}
        ];
        assert.deepStrictEqual(result, expected);
    });

    it('multiple same entities in should match in order when adding', function() {
        var first = [{id: 1, text: 'one'}, {id: 1, text: 'second'}];
        var second = [
            {id: 1, text: 'one changed'},
            {id: 1, text: 'second changed'},
            {id: 1, text: 'third changed'},
        ];
        var result = mutations(first, second, {
            equals: function(a, b) { return a.id === b.id; }
        });

        var expected = [
            {type: 'add', item: {id: 1, text: 'third changed'}},
            {type: 'change', old: {id: 1, text: 'one'}, item: {id: 1, text: 'one changed'}},
            {type: 'change', old: {id: 1, text: 'second'}, item: {id: 1, text: 'second changed'}},
        ];

        assert.deepStrictEqual(result, expected);
    });

    it('multiple same entities in should match in order when removing', function() {
        var first = [{id: 1, name: 'a'}, {id: 1, name: 'b'}, {id: 1, name: 'c'}];
        var second = [{id: 1, name: 'aa'}, {id: 1, text: 'bb'}];
        var result = mutations(first, second, {
            equals: function(a, b) { return a.id === b.id; }
        });

        var expected = [
            {type: 'change', old: {id: 1, name: 'a'}, item: {id: 1, name: 'aa'}},
            {type: 'change', old: {id: 1, name: 'b'}, item: {id: 1, text: 'bb'}},
            {type: 'remove', item: {id: 1, name: 'c'}}
        ];

        assert.deepStrictEqual(result, expected);
    });
});
