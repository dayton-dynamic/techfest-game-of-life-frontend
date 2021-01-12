let icons = { 1: "•", 0: "◦" };  // thank you Stephen Hinton!
let start_pattern = null;
const default_width = 16;

const url = "http://45.79.202.219:3000/pattern"

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
        result.width = default_width;
        result.author = "Dayton Dynamic Languages"
        result.name = "Default start pattern"
        result.rows_as_integers = [0, 0, 0, 0, 0, 0, 0, 0]
        return result;
    }

    static load(pattern_num, tbl) {
        console.log(`pattern_num ${pattern_num}`)
        if (!pattern_num) {
            // console.log(`pattern_num ${pattern_num} is falsey`)
            let pattern = Pattern.default_pattern();
            start_pattern = null;
            pattern.new_table(tbl);
            pattern.apply(tbl);
            return;
        }

        // async madness
        fetch(`${url}?id=eq.${pattern_num}`)
            .then(response => response.json())
            .then(data => { 
                console.log(`data ${JSON.stringify(data)}`)
                let row = data[0];
                let pattern = new Pattern();
                pattern.author = row['author'];
                pattern.name = `pattern ${pattern_num}`
                pattern.width = default_width;
                pattern.rows_as_integers = row['pattern'];
                pattern.new_table(tbl);
                pattern.apply(tbl);
                start_pattern = pattern;
            }) 
    }

    static random() {
        return default_pattern();  //replace me
    }

    get rows() {
        // translates the rows_as_integers into 011001 string representation
        console.log(`this is ${JSON.stringify(this)}`);

        let result = []
        for (const bool_row of this.rows_as_integers) {
            result.push(bool_row.toString(2).padStart(this.width, '0'))
        }
        return result
    }

    new_table(tbl) {
        tbl.innerHTML = "";
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
        let rows_as_integers = [];
        for (const row of tbl.rows) {
            result.width = row.length;
            let characters = "0b";
            for (const cell of row.cells) {
                characters += String(cell.alive);
            }
            rows_as_integers.push(Number(characters))
        }
        result.rows_as_integers = rows_as_integers;
        return result
    }

    apply(tbl) {
        console.log(`Now applying pattern ${this.name}`);
        let row_num = 0;
        for (const row of this.rows) {  
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
            "pattern": this.rows_as_integers,
            "width": this.width
        }
    }
}

function save() {
    console.log(`start pattern is ${JSON.stringify(start_pattern)}`);
    if (!start_pattern) {
        console.log("no start pattern");
        start_pattern = Pattern.from_table(document.getElementById("gameboard"));
    }
    start_pattern.author = prompt("Your name?")
    console.log(start_pattern.payload);

    const options = {
        method: 'POST',
        body: JSON.stringify(start_pattern.payload),
        headers: { "Content-type": "application/json; charset=UTF-8" }
    }

    console.log("saving");
    console.log(JSON.stringify(options))

    fetch(url, options).then(res => console.log(res));
}



function fill_list(game_list) {

    function add_li(row, index) {
        var li = document.createElement('li');
        game_list.append(li);
        li.innerHTML = `<a href="index.html?pattern=${row['id']}">${row['author']}</a>`; 
        console.log(row);
    }

    fetch(url).then(response => response.json())
        .then(data => data.forEach(add_li));

}

