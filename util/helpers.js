
module.exports = {

    isInArray: function(value, array) {
        return array.indexOf(value) > -1;
    },

    removeItem: function (arr, value) {

        for (var b in arr) {
            if (arr[b] != null && String(arr[b]) === String(value)) {
                arr.splice(b, 1);
                deletedUser = b;
                break;
            }
        }
        return arr;
    },
}