var _ = {
    merge: require('lodash.mergewith'),
    each: require('lodash.foreach'),
    findIndex: require('lodash.findindex'),
    isEqual: require('lodash.isequal'),
    sortBy: require('lodash.sortby'),
    isUndefined: require('lodash.isundefined')
};

// Returns difference of two arrays, a and b
function mutations(a, b, opts) {
    opts = _.merge({
        equals: defaultEquals,
        deepEquals: defaultDeepEquals
    }, opts);

    var mutationsList = [];
    var aCopy = a.slice();
    var bCopy = b.slice();

    while (aCopy.length > 0) {
        var aItem = aCopy.shift();
        var matchingIndex = findItemIndex(bCopy, aItem, opts.equals);
        var matchingItem = pop(bCopy, matchingIndex);

        if (_.isUndefined(matchingItem)) {
            mutationsList.push({
                type: 'remove',
                item: aItem
            });
        } else {
            var hasChanged = !opts.deepEquals(aItem, matchingItem);
            if (hasChanged) {
                mutationsList.push({
                    type: 'change',
                    old: aItem,
                    item: matchingItem
                });
            }
        }
    }

    _.each(bCopy, function(bItem) {
        mutationsList.push({
            type: 'add',
            item: bItem
        });
    });

    return _.sortBy(mutationsList, 'type');
}

function pop(arr, index) {
    if (index > -1) {
        return arr.splice(index, 1)[0];
    }
}

function findItemIndex(arr, item, equals) {
    return _.findIndex(arr, function(arrItem) {
        return equals(arrItem, item);
    });
}

function defaultEquals(a, b) {
    return a === b;
}

function defaultDeepEquals(a1, a2) {
    return _.isEqual(a1, a2);
}

module.exports = mutations;
