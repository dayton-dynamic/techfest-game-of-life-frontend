function getPatternNum() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const patternNum = (urlParams.get("pattern"));
    return patternNum;
}

function getSource() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const source = (urlParams.get("source"));
    return source;
}

function deletePattern(patternNum, destination) {

    if (destination == "local") {
		let newPatterns = [];
        if (localStorage.patterns) {
            storedPatterns = JSON.parse(localStorage.patterns);
	        storedPatterns.forEach(data => {
				if (data.id != patternNum) {
					newPatterns.push(data);
				}
            });
			localStorage.patterns = JSON.stringify(newPatterns);
            alert("Deletion successful.");
        }
    }
    else {
        const options = {
            method: 'DELETE',
            prefer: 'return=representation'
            //body: JSON.stringify(pattern.payload),
            //headers: { "Content-type": "application/json; charset=UTF-8" }
        }
        fetch(url + "?id=eq." + patternNum, options)
            .then(response => {
                 if (!response.ok) {
                    throw new Error(
                        `Unexpected response status ${response.status}`
                    );
                 }
				 else {
					 alert("Deletion successful.");
				 }
            })
            .catch(error => {
                console.log("Error while deleting pattern:", error);
                alert("Deletion failed!");
            });
    }
}

let url = "http://45.79.202.219:3000/pattern";

let patternNum = getPatternNum();
let source = getSource();
if (patternNum && source) {
    deletePattern(patternNum, source);
}
