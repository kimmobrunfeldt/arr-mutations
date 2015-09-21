var assert = require('assert');
var changes = require('../src/index');

describe('arr-changes', function() {
    it('basic changes', function() {
        var result = changes([1, 2], [2, 3]);
        // Changes are sorted by type
        var expected = [{type: 'add', item: 3}, {type: 'remove', item: 1}];

        assert.deepStrictEqual(result, expected);
    });

    it('complex changes', function() {
        var first = [{id: 1, text: 'one'}, {id: 2, text: 'two'}];
        var second = [{id: 2, text: 'another'}, {id: 3, text: 'three'}];
        var result = changes(first, second, {
            equals: function(a, b) { return a.id === b.id; }
        });

        var expected = [
            {type: 'add', item: {id: 3, text: 'three'}},
            {type: 'change', item: {id: 2, text: 'another'}},
            {type: 'remove', item: {id: 1, text: 'one'}}
        ];
        assert.deepStrictEqual(result, expected);
    });

    it('multiple same entities', function() {
        var first = [{id: 1, text: 'one'}, {id: 1, text: 'second one'}];
        var second = [{id: 1, text: 'one changed'}, {id: 1, text: 'second one changed'}];
        var result = changes(first, second, {
            equals: function(a, b) { return a.id === b.id; }
        });
        console.log(result);
        var expected = [
            {type: 'add', item: {id: 3, text: 'three'}},
            {type: 'change', item: {id: 2, text: 'another'}},
            {type: 'remove', item: {id: 1, text: 'one'}}
        ];
        assert.deepStrictEqual(result, expected);
    });
});
