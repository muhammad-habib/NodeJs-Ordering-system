
module.exports = {

    isInArray: function(value, array) {
        return array.indexOf(value) > -1;
    },

    removeItem: function (arr, value) {
        for (var b in arr) {
            if (arr[b] != null &&arr[b]._id === value._id) {
                arr.splice(b, 1);
                deletedUser = b;
                break;
            }
        }
        return arr;
    },
}