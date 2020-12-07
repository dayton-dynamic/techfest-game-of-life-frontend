function get_pattern_num() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    var pattern_num = (urlParams.get("pattern"));
    return pattern_num;
}

function toggle(cell) {
    if (cell.innerHTML == "0") {
        cell.innerHTML = "1";
    }
    else {
        cell.innerHTML = "0";
    }
}


class Pattern {

    static default_pattern() {
        let result = new Pattern();
        result.width = 8 
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
        let bool_rows = [];
        for (row of tbl.rows) {
            width = row.length;
            let characters = "0b";
            for (cell of row.cells) {
                characters += cell.innerHTML;
            }
            bool_rows.push(Number(characters))
        }
        result = Pattern();
        result.width = row.length;
        result.bool_rows = bool_rows;
        return result
    }

    apply(tbl) {
        let row_num = 0;
        for (const row of this.rows) {  // try leaving off this bracket!
            for (let char_num = 0; char_num < row.length; char_num++) {
                tbl.rows[row_num].cells[char_num].innerHTML = row[char_num]
            }
            row_num++
        }
    }
}

