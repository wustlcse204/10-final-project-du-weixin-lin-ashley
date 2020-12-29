// gets games based on title from server, then adds it to HTML
// function getGames() {
//     event.preventDefault(); // Prevent page reload
//     var title =  "title=" + document.getElementById("submission").value;
//     var url = "https://www.cheapshark.com/api/1.0/games?" + title;

//     var xhttp2 = new XMLHttpRequest();
//     xhttp2.onreadystatechange = function() {
//         // Wait for readyState = 4 & 200 response
//         if (this.readyState == 4 && this.status == 200) {
//             var games = JSON.parse(this.responseText);   // gets array of games matching search
//             console.log(games);   //TEST DELETE WHEN DONE
//             addGames(games);
//             document.getElementById("submission").value = "";
//         }
//         else if (this.readyState == 4) {
//             console.log(this.responseText);
//         }
//     };

//     xhttp2.open("GET", url, true);
//     xhttp2.send();
// }
// const gameForm = document.getElementById("game-form");
// gameForm.addEventListener("submit", getGames, false);   //triggers submission & making of ToDo via event listener

// function addGames(games) {
//     event.preventDefault(); // Prevent page reload

//     document.getElementsByClassName("games", "empty")[0].remove();  //removes previous
//     var results = document.getElementById("game-result");  // gets the containing form

//     var container = document.createElement("div");
//     container.classList.add("container", "games");

//     if (games.length == 0) {
//         var div = document.createElement("div");
//         div.classList.add("empty");
//         div.innerHTML = "Sorry, but it looks like there's no games matching this search. Try some other search terms."
//         container.append(div);
//     }
//     else {
//         for (var i = 0; i < games.length; i++) {
//             var div = document.createElement("div");
//             div.innerHTML = "Game: " + games[i].external;
//             container.append(div);
//         }
//     }
//     results.append(container);
// }

// makes map of ids to store to call on later
var idToStoreName = new Map();
getStores(idToStoreName);
console.log(idToStoreName); //TEST DELETE WHEN DONE

var currentPage;
function showDeals() {
    event.preventDefault(); // Prevent page reloads
    currentPage = 0;
    getDeals(currentPage);
}

// currently bound to the homepage search, TODO: MAKE ONE FOR EACH FORM, UNIQUE IDS FOR EACH
const dealForm = document.getElementById("homepage-search");
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
    document.getElementById("page-label").remove();  //removes previous TEST DELETE WHEN DONE
    document.getElementById("deal-table").remove();  //removes previous 

    var title =  "title=" + document.getElementById("homepage-title").value;
    var url = "https://www.cheapshark.com/api/1.0/deals?" + title;

    // set of if statements that tack on filters to the sent url if they are applied
    if (document.getElementById("homepage-low").value != "") {
        url += "&lowerPrice=" + document.getElementById("homepage-low").value;
    }
    if (document.getElementById("homepage-high").value != "") {
        url += "&upperPrice=" + document.getElementById("homepage-high").value;
    }
    
    url += "&sortBy=Title" + "&pageSize=20";
    var pageUrl = url + "&pageNumber=" + pageNo;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        // Wait for readyState = 4 & 200 response
        if (this.readyState == 4 && this.status == 200) {
            var deals = JSON.parse(this.responseText);   // gets array of games matching search
            addDeals(deals);
        }
        else if (this.readyState == 4) {
            console.log(this.responseText);
        }
    };

    xhttp.open("GET", pageUrl, true);
    xhttp.send();

    var bottom = document.getElementById("mainpage");  // gets the containing form
    var page = document.createElement("p");
    page.innerHTML = "Page number " + pageNo;
    page.id = "page-label";
    bottom.append(page);
}

function addDeals(deals) {
    event.preventDefault(); // Prevent page reload

    var results = document.createElement("table");  // gets the containing form
    results.id = "deal-table";

    if (deals.length == 0) {
        var div = document.createElement("div");
        div.id = "empty";
        div.innerHTML = "Sorry, but it looks like there's no deals matching this search. Try some other search terms."
        results.append(div);
    }
    else {
        // header row
        var header = document.createElement("tr");
        var headerCells = new Array("Name", "Sale", "Standard", "Savings", "Steam Rating", "Release Date", "Store");
        headerCells.forEach(function(string) {
            var cell = document.createElement("th"); 
            cell.innerHTML = string;
            header.append(cell);
        });
        results.append(header);

        // rows for each deal
        deals.forEach(function(deal, index) {
            var row = document.createElement("tr");
            row.id = "row-" + index;

            var name = document.createElement("td");
            name.innerHTML = deal.title;
            row.append(name);

            var price = document.createElement("td");
            price.innerHTML = "$" + deal.salePrice;
            row.append(price);

            var normal = document.createElement("td");
            normal.innerHTML = "$" + deal.normalPrice;
            row.append(normal);

            var savings = document.createElement("td");
            savings.innerHTML = Math.round(deal.savings) + "%";
            row.append(savings);

            var rating = document.createElement("td");
            if (deal.steamRatingPercent != 0) {
                rating.innerHTML = deal.steamRatingPercent;
            }
            else {
                rating.innerHTML = "N/A";
            }
            row.append(rating);
            
            //https://stackoverflow.com/questions/10040291/converting-a-unix-timestamp-to-formatted-date-string
            var date = document.createElement("td");
            if (deal.releaseDate != 0) {
                var milliseconds = deal.releaseDate * 1000 
                var dateObject = new Date(milliseconds)
                date.innerHTML = dateObject.toLocaleDateString() //2019-12-9 10:30:15
            }
            else {
                date.innerHTML = "N/A";
            }
            row.append(date);

            var store  = document.createElement("td");
            store.innerHTML = idToStoreName.get(deal.storeID);
            row.append(store);

            results.append(row);
        });
    }
    document.getElementById("mainpage").append(results);
}
