let url = "http://45.79.202.219:3000/pattern";
let icons = { 1: "•", 0: "◦" };  // thank you Stephen Hinton!

function getSource() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const source = (urlParams.get("source"));
    return source;
}

function fillUl(gameList) {

    function addLi(row) {
        if (!row.hasOwnProperty('id')) return; //FIXME: Remove after testing complete
        var li = document.createElement('li');
        gameList.append(li);
        let html = `<a id=id${row['id']} href="index.html?pattern=${row['id']}&source=${getSource()}">`;
        html = html + `<p>${row['name']}<br> (by ${row['author']})</p>`;
        html = html + `<div class="startPatternThumb">`;
        html = html + `<table class="thumbnail"></table>`;
        html = html + `</div>`;
        html = html + `</a>`;
        li.innerHTML = html;
        let startPattern = Pattern.defaultPattern();
        startPattern.width = row['width'];
        startPattern.height = row['pattern'].length;
        startPattern.boolRows = JSON.parse(JSON.stringify(row['pattern']));
        let thumb = document.querySelector('#id' + row['id'] + ' div table.thumbnail');
        startPattern.new_thumb(thumb);
        startPattern.apply(thumb);
    }

    if (getSource() == "local") {
        let storedPatterns = [];
        if (localStorage.patterns) {
            storedPatterns = JSON.parse(localStorage.patterns);
        }
        //alert(JSON.stringify(storedPatterns));
        storedPatterns.forEach(addLi);
    }
    else {
        fetch(url)
            .then(response => {
                if (response.ok &&
                    response.headers.get("Content-Type") === "application/json; charset=utf-8") {
                    return response.json();
                }
                else {
                    throw new Error(
                        'Unexpected response status ${response.status} or content type'
                    );
                }
            })
            .then(data => {
                data.forEach(addLi);
            })
            .catch(error => {
                console.log("Error while fetching list of patterns:", error);
                alert("Error while getting patterns!");
            });
    }

}
window.addEventListener("load", function() {
    let gameList = document.getElementById("game-list");
    fillUl(gameList);
});
