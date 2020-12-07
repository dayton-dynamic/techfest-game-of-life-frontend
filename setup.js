function get_pattern_num() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    var pattern_num = (urlParams.get("pattern"));
    return pattern_num;
}


function setup_game() {

    pattern_num = get_pattern_num();
    pattern = Pattern.load(pattern_num);
    pattern.apply(document.getElementById("gameboard"))
}

