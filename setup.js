function getPatternNum() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    var patternNum = (urlParams.get("pattern"));
    return patternNum;
}

function toggle(cell) {
    if (cell.alive == 0) {
        cell.alive = 1;
        cell.className = "alive";
    }
    else {
        cell.alive = 0;
        cell.className = "empty";
    }
    cell.innerHTML = icons[cell.alive];
}

function setup_game() {
    patterNum = getPatternNum();
    pattern = Pattern.load(patternNum);
    pattern.apply(document.querySelector("#gameboard"));
}

let icons = { 1: "•", 0: "◦" };  // thank you Stephen Hinton!
let rules = [
    [0, 0, 0, 1, 1, 1, 1, 1, 1], // Empty cells with 3 or more neighbors come to life
    [0, 0, 1, 1, 0, 0, 0, 0, 0]  // Living cells survive if they have 2-3 neighbors
];
let startPattern = {};
let running = false;
let runner; // Interval timer
let interval = 500; // Interval time

window.addEventListener("load", function(){
    patternNum = getPatternNum();
    pattern = Pattern.load(patternNum);
    startPattern = Pattern.defaultPattern();
    startPattern.width = pattern.width;
    startPattern.height = pattern.height;
    startPattern.boolRows = JSON.parse(JSON.stringify(pattern.boolRows));
    let tbl = document.querySelector("#gameboard");
    let thumb = document.querySelector("#startPattern");
    pattern.new_table(tbl);
    startPattern.new_thumb(thumb);
    pattern.apply(tbl);
    document.querySelector("#start").addEventListener("click", function() {
        startPattern.boolRows = JSON.parse(JSON.stringify(pattern.boolRows));
        startPattern.apply(thumb);
        running = true;
        runner = setInterval(() => {
            pattern.advance(tbl);
            pattern.apply(tbl);
        }, interval);
        document.querySelector("#stop").disabled = false;
        document.querySelector("#step").disabled = true;
        document.querySelector("#reset").disabled = true;
        document.querySelector("#clear").disabled = true;
        document.querySelector("#save").disabled = true;
        document.querySelector("#load").disabled = true;
        this.disabled = true;
    });
    document.querySelector("#stop").addEventListener("click", function() {
        running = false;
        clearInterval(runner);
        document.querySelector("#start").disabled = false;
        document.querySelector("#step").disabled = false;
        document.querySelector("#reset").disabled = false;
        document.querySelector("#clear").disabled = false;
        document.querySelector("#save").disabled = false;
        document.querySelector("#load").disabled = false;
        this.disabled = true;
    });
    document.querySelector("#step").addEventListener("click", function() {
        pattern.advance(tbl);
        pattern.apply(tbl);
    });
    document.querySelector("#reset").addEventListener("click", function() {
        pattern.boolRows = JSON.parse(JSON.stringify(startPattern.boolRows));
        pattern.apply(tbl);
    });
    document.querySelector("#clear").addEventListener("click", function() {
        pattern.clear();
        pattern.apply(tbl);
        startPattern.boolRows = JSON.parse(JSON.stringify(pattern.boolRows));
        startPattern.apply(thumb);
    });
});


