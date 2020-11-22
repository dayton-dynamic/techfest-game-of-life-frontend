function get_pattern_num() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    var pattern_num = (urlParams.get("pattern"));
    return pattern_num;
}

DEFAULT_PATTERN = [
    "00000000",
    "00000000",
    "00000000",
    "00000000",
    "00000000",
    "00000000",
    "00000000",
    "00000000",
]

function get_pattern_spec(pattern_num) {

    // if pattern_num null, get default 
    // otherwise TODO: load that pattern from the server

    return DEFAULT_PATTERN
}

function toggle(cell) {
    if (cell.innerHTML == "0") {
        cell.innerHTML = "1";
    }
    else {
        cell.innerHTML = "0";
    }
}

function draw_pattern(pattern_spec) {
    let table = document.getElementById("gameboard")
    for (row_n = 0; row_n < pattern_spec.length; row_n++) {
        let row = table.insertRow();
        for (col_n = 0; col_n < pattern_spec[row_n].length; col_n++) {
            let cell = row.insertCell(0);
            cell.innerHTML=pattern_spec[row_n][col_n];
            cell.onclick = function () {
                toggle(cell)
            }
        }
    }
}

function load_pattern() {

    pattern_num = get_pattern_num();
    pattern_spec = get_pattern_spec(pattern_num);
    draw_pattern(pattern_spec);
}

function when_start_pressed() {
    // record the starting pattern so that we can get it upon when_save_pressed
    // evolve the cells
    // hook this up to a start button
}

function when_save_pressed() {
    // ask for username
    // upload pattern to the gallery 
}

function play() {

    load_pattern();

}

window.onload = play
