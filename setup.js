function getPatternNum() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    var patternNum = (urlParams.get("pattern"));
    return patternNum;
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
let startPattern = null;
let running = false;
let runner; // Interval timer
let interval = 500; // Interval time

window.addEventListener("load", function(){
    patternNum = getPatternNum();
    pattern = Pattern.load(patternNum);
    let tbl = document.querySelector("#gameboard");
    pattern.new_table(tbl);
    pattern.apply(tbl);
    document.querySelector("#start").addEventListener("click", function() {
        running = true;
        runner = setInterval(() => {
            pattern.advance(tbl);
            pattern.apply(tbl);
        }, interval);
        document.querySelector("#stop").disabled = false;
        this.disabled = true;
    });
    document.querySelector("#stop").addEventListener("click", function() {
        running = false;
        clearInterval(runner);
        document.querySelector("#start").disabled = false;
        this.disabled = true;
    });
});


