class Pattern {

    static setToDefaults(pattern) {
        pattern.width = 25;
        pattern.height = 25;
        pattern.author = "Dayton Dynamic Languages";
        pattern.name = "Default start pattern";
        let boolRows = [];
        for (let i = 0; i < pattern.width; i++) { boolRows.push(0); };
        pattern.boolRows = [...boolRows];
        return pattern;
    }

    static load(patternNumm, tbl) {

        let pattern = new Pattern();

        if (!patternNumm) {
            Pattern.setToDefaults(pattern);
            pattern.new_table(tbl);
            pattern.apply(tbl);
        } else {
            // async madness
            fetch(`${url}?id=eq.${patternNumm}`)
                .then(response => response.json())
                .then(data => { 
                    console.log(`data ${JSON.stringify(data)}`)
                    let row = data[0];
                    pattern.author = row['author'];
                    pattern.name = `pattern ${patternNumm}`
                    pattern.width = default_width;
                    pattern.rows_as_integers = row['pattern'];
                    pattern.new_table(tbl);
                    pattern.apply(tbl);
                }) 
        }

        return pattern;
    }

    static random() {
        return defaultPattern();  //replace me
    }

    get rows() {
        // translates the boolRows into 011001 string representation

        let result = []
        for (const boolRow of this.boolRows) {
            result.push(boolRow.toString(2).padStart(this.width, '0'))
        }
        return result
    }

    countNeighbors(rowNum, colNum) {

        // Get cells in an aray of arrays
        let cells = [];
        for (const row of this.rows) {
            cells.push([...row].map(x => Number(x)));
        }

        let neighbors = 0;

        // Check all the adjacent cells
        for (let i = rowNum - 1; i <= rowNum + 1; i++) {
            if ((i < 0) || (i > this.height - 1)) continue;
            for (let j = colNum - 1; j <= colNum + 1; j++) {
                if ((j < 0) || (j > this.width - 1)) continue;
                if (i === rowNum && j === colNum) continue;
                if (cells[i][j] === 1) {
                    neighbors++;
                }
            }
        }
        return neighbors;
    }

    new_table(tbl) {
        tbl.pattern = this;
        tbl.innerHTML = "";
        for (const row_values of this.rows) {
            let row = tbl.insertRow();
            for (const cell_value of row_values) {
                let cell = row.insertCell(-1);
                cell.addEventListener("click", function() {
                    toggle(this);
                    let table = this.closest("table");
                    table.pattern.update(table);
                })
            }
        }
    }

    new_thumb(tbl) {
        tbl.pattern = this;
        tbl.innerHTML = "";
        for (const row_values of this.rows) {
            let row = tbl.insertRow();
            for (const cell_value of row_values) {
                let cell = row.insertCell(-1);
            }
        }
    }

    update(tbl) {
        let boolRows = [];
        for (const row of tbl.rows) {
            let characters = "0b";
            for (const cell of row.cells) {
                characters += String(cell.alive);
            }
            boolRows.push(Number(characters))
        }
        this.boolRows = boolRows;
    }

    static from_table(tbl) {
        let result = new Pattern();
        let boolRows = [];
        for (const row of tbl.rows) {
            result.width = row.length;
            let characters = "0b";
            for (const cell of row.cells) {
                characters += String(cell.alive);
            }
            boolRows.push(Number(characters))
        }
        result.boolRows = boolRows;
        return result
    }


    apply(tbl) {
        let row_num = 0;
        for (const row of this.rows) {  // try leaving off this bracket!
            for (let char_num = 0; char_num < row.length; char_num++) {
                let cell = tbl.rows[row_num].cells[char_num]
                cell.alive = Number(row[char_num]);
                if((cell.alive == 1)) {
                    cell.className = "alive"
                } else {
                    cell.className = "empty"
                }
                cell.innerHTML = icons[cell.alive];
            }
            row_num++
        }
    }

    advance(tbl) {
        // Get cells in an aray of arrays
        let cells = [];
        for (const row of this.rows) {
            cells.push([...row].map(x => Number(x)));
        }

        // Deternine new cell values
        let rowNum = 0;
        for (const row of cells) {
            let colNum = 0;
            for (const column of row) {
                let status = cells[rowNum][colNum];
                let neighbors = this.countNeighbors(rowNum, colNum);
                cells[rowNum][colNum] = rules[status][neighbors];
                colNum++;
            }
            rowNum++;
        }

        // Write cells array back to boolRows
        this.boolRows = [];
        for (const row of cells) {
            let characters = "0b" + row.join("");
            this.boolRows.push(Number(characters));
        }
    }


    get payload() {
        return {
            "author": this.author,
            "pattern": this.boolRows,
            "width": this.width
        }
    }
}

function save() {
    if (!startPattern) {
        startPattern = Pattern.from_table(document.getElementById("gameboard"));
    }
    startPattern.author = prompt("Your name?")
    console.log(startPattern.payload);
    let url = "http://45.79.202.219:3000/pattern"

    const options = {
        method: 'POST',
        body: JSON.stringify(startPattern.payload),
        headers: { "Content-type": "application/json; charset=UTF-8" }
    }

    fetch(url, options).then(res => console.log(res));
}

function fill_ul(game_list) {

    function add_li(row, index) {
        var li = document.createElement('li');
        game_list.append(li);
        li.innerHTML = `<a href="index.html?pattern=${row['id']}">${row['author']}</a>`; 
        console.log(row);
    }

    fetch(url).then(response => response.json())
        .then(data => data.forEach(add_li));
}
