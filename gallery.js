let url = "http://45.79.202.219:3000/pattern"

function fill_ul(game_list) {

    function add_li(row, index) {
        var li = document.createElement('li');
        game_list.append(li);
        li.innerHTML = `<a href="index.html?pattern=${row['id']}">${row['author']}</a>`; 
    }

    fetch(url).then(response => response.json())
        .then(data => data.forEach(add_li));
}
