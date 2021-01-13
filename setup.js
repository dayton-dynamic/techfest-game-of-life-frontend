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
    let tbl = document.querySelector("#gameboard");
    pattern = Pattern.load(patternNum, tbl);
    console.log(pattern);
    console.log(JSON.stringify(pattern));
    console.log(pattern.new_thumb);
    // startPattern = Object.assign({}, pattern);
    startPattern = new Pattern();
    startPattern.width = pattern.width;
    startPattern.height = pattern.height;
    startPattern.author = pattern.author;
    startPattern.name = pattern.name;
    startPattern.boolRows = pattern.boolRows.slice();

    console.log(startPattern);
    console.log(JSON.stringify(startPattern));
    console.log(startPattern.new_thumb);
    // startPattern = { ...pattern };  // TODO: again hosed by async!
    let thumb = document.querySelector("#thumbnail");
    startPattern.new_thumb(thumb);
    document.querySelector("#start").addEventListener("click", function() {
        startPattern.boolRows = JSON.parse(JSON.stringify(pattern.boolRows));
        //startPattern.new_thumb(thumb);
        startPattern.apply(thumb);
        running = true;
        runner = setInterval(() => {
            pattern.advance(tbl);
            pattern.apply(tbl);
        }, interval);
        document.querySelector("#stop").disabled = false;
        document.querySelector("#step").disabled = true;
        this.disabled = true;
    });
    document.querySelector("#stop").addEventListener("click", function() {
        running = false;
        clearInterval(runner);
        document.querySelector("#start").disabled = false;
        document.querySelector("#step").disabled = false;
        this.disabled = true;
    });
    document.querySelector("#step").addEventListener("click", function() {
        pattern.advance(tbl);
        pattern.apply(tbl);
    });
});


