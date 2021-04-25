export const addComma = (x) => {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

export const sortData = (data, property, proviso) => {
    
    if (proviso === true) {
        function compare(a, b) {
            const data_idA = a[property]
            const data_idB = b[property]

            let comparison = 0;
            if (data_idA < data_idB) {
                comparison = 1;
            } else if (data_idA > data_idB) {
                comparison = -1;
            }
            return comparison;
        }
        let sort_data = data.sort(compare)
        return sort_data
    }
    else {
        function compare(a, b) {
            const data_idA = a[property]
            const data_idB = b[property]

            let comparison = 0;
            if (data_idA > data_idB) {
                comparison = 1;
            } else if (data_idA < data_idB) {
                comparison = -1;
            }
            return comparison;
        }
        let sort_data = data.sort(compare)
        return sort_data
    }

}