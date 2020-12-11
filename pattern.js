let icons = { 1: "•", 0: "◦" };  // thank you Stephen Hinton!
let start_pattern = null;

function get_pattern_num() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    var pattern_num = (urlParams.get("pattern"));
    return pattern_num;
}

function toggle(cell) {
    if (cell.alive == 0) {
        cell.alive = 1;
    }
    else {
        cell.alive = 0;
    }
    cell.innerHTML = icons[cell.alive];
}


class Pattern {

    static default_pattern() {
        let result = new Pattern();
        result.width = 16
        result.author = "Dayton Dynamic Languages"
        result.name = "Default start pattern"
        result.bool_rows = [0, 0, 0, 0, 0, 0, 0, 0]
        return result;
    }

    static load(pattern_num) {
        if (!pattern_num) {
            return Pattern.default_pattern();
        }
        return Pattern.default_pattern();  // replace me
    }

    static random() {
        return default_pattern();  //replace me
    }

    get rows() {
        // translates the bool_rows into 011001 string representation

        let result = []
        for (const bool_row of this.bool_rows) {
            result.push(bool_row.toString(2).padStart(this.width, '0'))
        }
        return result
    }

    new_table(tbl) {
        tbl.innerHTML = "";
        // $(`"#${tbl.id} tr`).remove();  requires jquery
        for (const row_values of this.rows) {
            let row = tbl.insertRow();
            for (const cell_value of row_values) {
                let cell = row.insertCell(-1);
                cell.onclick = function () {
                    toggle(cell);
                }
            }
        }
    }


    static from_table(tbl) {
        let result = new Pattern();
        let bool_rows = [];
        for (const row of tbl.rows) {
            result.width = row.length;
            let characters = "0b";
            for (const cell of row.cells) {
                characters += String(cell.alive);
            }
            bool_rows.push(Number(characters))
        }
        result.bool_rows = bool_rows;
        return result
    }

    apply(tbl) {
        let row_num = 0;
        for (const row of this.rows) {  // try leaving off this bracket!
            for (let char_num = 0; char_num < row.length; char_num++) {
                let cell = tbl.rows[row_num].cells[char_num]
                cell.alive = Number(row[char_num]);
                cell.innerHTML = icons[cell.alive]
            }
            row_num++
        }
    }

    get payload() {
        return {
            "author": this.author,
            "pattern": this.bool_rows,
            "width": this.width
        }
    }
}

function save() {
    if (!start_pattern) {
      start_pattern = Pattern.from_table(document.getElementById("gameboard"));
    }
    start_pattern.author = prompt("Your name?")
    console.log(start_pattern.payload);
    let url = "http://45.79.202.219:3000/pattern"

    const options = {
        method: 'POST',
        body: JSON.stringify(start_pattern.payload),
        headers: {"Content-type": "application/json; charset=UTF-8"} 
    }

    fetch(url, options).then(res => console.log(res));
}

