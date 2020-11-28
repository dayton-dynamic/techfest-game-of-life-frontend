function listProperties(obj) {
    var propList = "";
    for (var propName in obj) {
        if (typeof (obj[propName]) != "undefined") {
            propList += (propName + ", ");
        }
    }
    return propList
}



function read_pattern() {
    pattern = []
    let table = document.getElementById("gameboard");
    // for (row in table.rows) {
    // for…in Loop 	It iterates through the properties of the object.
    for (row of table.rows) {
        row_str = "";
        for (cell of row.cells) {
            row_str += cell.innerHTML;
        }
        pattern.push(row_str);
    }
    console.log(pattern);
    return pattern
}

