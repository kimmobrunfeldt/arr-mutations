var xor = require('arr-xor');
var and = require('arr-and');

var _ = {
    merge: require('lodash.merge'),
    each: require('lodash.foreach'),
    findIndex: require('lodash.findIndex'),
    find: require('lodash.find'),
    isEqual: require('lodash.isEqual'),
    sortBy: require('lodash.sortby')
};

// Returns difference of two arrays, a and b
function changes(a, b, opts) {
    opts = _.merge({
        equals: defaultEquals,
        deepEquals: defaultDeepEquals
    }, opts);

    var changesList = [];

    var notInBoth = xor(a, b, opts.equals);
    _.each(notInBoth, function(item) {
        var isInA = _.findIndex(a, function(aItem) {
            return opts.equals(aItem, item);
        }) !== -1;

        changesList.push({
            type: isInA ? 'remove' : 'add',
            item: item
        });
    });

    var inBoth = and(a, b, opts.equals);
    _.each(inBoth, function(item) {
        var aItem = _.find(a, function(i) {
            return opts.equals(i, item);
        });
        var bItem = _.find(b, function(i) {
            return opts.equals(i, item);
        });

        if (!opts.deepEquals(aItem, bItem)) {
            changesList.push({
                type: 'change',
                // Return the new changed item
                item: bItem
            });
        }
    });

    return _.sortBy(changesList, 'type');
}

function defaultEquals(a, b) {
    return a === b;
}

function defaultDeepEquals(a1, a2) {
    return _.isEqual(a1, a2);
}

module.exports = changes;
