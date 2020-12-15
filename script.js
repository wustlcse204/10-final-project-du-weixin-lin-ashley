// gets games based on title from server, then adds it to HTML
function getGames() {
    event.preventDefault(); // Prevent page reload
    var title =  "title=" + document.getElementById("submission").value;
    var url = "https://www.cheapshark.com/api/1.0/games?" + title;

    var xhttp2 = new XMLHttpRequest();
    xhttp2.onreadystatechange = function() {
        // Wait for readyState = 4 & 200 response
        if (this.readyState == 4 && this.status == 200) {
            var games = JSON.parse(this.responseText);   // gets array of games matching search
            console.log(games);   //TEST DELETE WHEN DONE
            addGames(games); 
            document.getElementById("submission").value = "";
        } 
        else if (this.readyState == 4) {
            console.log(this.responseText);   
        }
    };

    xhttp2.open("GET", url, true);
    xhttp2.send();
}
const gameForm = document.getElementById("game-form");
gameForm.addEventListener("submit", getGames, false);   //triggers submission & making of ToDo via event listener

function addGames(games) {
    event.preventDefault(); // Prevent page reload
    
    document.getElementsByClassName("games", "empty")[0].remove();  //removes previous
    var results = document.getElementById("game-result");  // gets the containing form

    var container = document.createElement("div");  
    container.classList.add("container", "games");
        
    if (games.length == 0) {
        var div = document.createElement("div"); 
        div.classList.add("empty");
        div.innerHTML = "Sorry, but it looks like there's no games matching this search. Try some other search terms."
        container.append(div);
    }
    else {
        for (var i = 0; i < games.length; i++) {
            var div = document.createElement("div"); 
            // var id = "div" + i; 
            // div.id = id;
            div.innerHTML = "Game: " + games[i].external;
            container.append(div);  
        }
    } 
    results.append(container);  
}



var currentPage;
function showDeals() {
    currentPage = 0;
    getDeals(currentPage); 
}
const dealForm = document.getElementById("deal-form");
dealForm.addEventListener("submit", showDeals, false);   //triggers submission & making of ToDo via event listener

function prevDeal() {
    event.preventDefault(); // Prevent page reload
    alert("Previous"); //TEST DELETE WHEN DONE
    currentPage -= 1;
    getDeals(currentPage);
    
}
function nextDeal() {
    event.preventDefault(); // Prevent page reload
    alert("Next"); //TEST DELETE WHEN DONE
    currentPage += 1;
    getDeals(currentPage);
}
document.getElementById("prev-deal").addEventListener("click", prevDeal, false);
document.getElementById("next-deal").addEventListener("click", nextDeal, false);

function getDeals(pageNo) {
    event.preventDefault(); // Prevent page reload
    document.getElementsByClassName("page-label")[0].remove();  //removes previous //TEST DELETE WHEN DONE
    document.getElementsByClassName("deals","empty")[0].remove();  //removes previous
    
    var title =  "title=" + document.getElementById("title").value;
    var url = "https://www.cheapshark.com/api/1.0/deals?" + title;
    url = url + "&sortBy=Store";  //TEST DELETE WHEN DONE

    var pageUrl = url + "&pageNumber=" + pageNo;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        // Wait for readyState = 4 & 200 response
        if (this.readyState == 4 && this.status == 200) {
            var deals = JSON.parse(this.responseText);   // gets array of games matching search
            console.log(deals);
            addDeals(deals); 
        } 
        else if (this.readyState == 4) {
            console.log(this.responseText);   
        }
    };
    
    xhttp.open("GET", pageUrl, true);
    xhttp.send();

    var results = document.getElementById("deal-result");  // gets the containing form
    var page = document.createElement("p");
    page.innerHTML = "Page number " + pageNo;
    page.classList.add("page-label");
    results.append(page);
}

function addDeals(deals) {
    event.preventDefault(); // Prevent page reload

    var results = document.getElementById("deal-result");  // gets the containing form

    var container = document.createElement("div");  
    container.classList.add("container", "deals");
    
    if (deals.length == 0) {
        var div = document.createElement("div"); 
        div.classList.add("empty");
        div.innerHTML = "Sorry, but it looks like there's no deals matching this search. Try some other search terms."
        container.append(div);
    }
    else {
        for (var i = 0; i < deals.length; i++) {
            var div = document.createElement("div"); 
            // var id = "div" + i; 
            // div.id = id;
            div.innerHTML = "Deal: " + deals[i].salePrice + " for " + deals[i].title;
            div.innerHTML = div.innerHTML + " with store ID of " + deals[i].storeID//TEST DELETE WHEN DONE
            container.append(div);  
        }
    } 
    results.append(container);  
}

