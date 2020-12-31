// makes map of ids to store to call on later
var idToStoreName = new Map();
getStores(idToStoreName);
console.log(idToStoreName); //TEST DELETE WHEN DONE

// currently bound to the homepage search, TODO: MAKE ONE FOR EACH FORM, UNIQUE IDS FOR EACH
const dealForm = document.getElementById("homepage-search");
dealForm.addEventListener("submit", makeDealsList, false);   //triggers submission & making of ToDo via event listener

// kicks off a loop jumping between getDeals and getResults until listOfDeals is filled
var listOfDeals = [];
var pageVar;
function makeDealsList() {
    event.preventDefault(); // Prevent page reloads
    // reset "masterlists"
    listOfDeals = [];
    pageVar = 0;

    // get keyword and kick off recursive
    var keyword = document.getElementById("homepage-title").value;
    getDeals(pageVar, keyword);

    // reset form value
    document.getElementById("homepage-title").value = "";
    // not resetting the price range, if you've got a price limit you're generally sticking to it
}

// get all available pages of deals by pushing sucessive pages until the next page is empty
function getResults(deals, keyword) {
    // page has some deals - add to master list
    if (deals.length != 0) {
        //pushes deals to the master list
        deals.forEach(function(deal) {
            listOfDeals.push(deal);
        })
        pageVar += 1;
        getDeals(pageVar, keyword);
    }
    // no deals left - list done, publish results
    else {
        console.log("Loop end");
        console.log(listOfDeals);

        // show total # of results, publish table featuring results
        document.getElementById("results-label").innerHTML = "Found " + listOfDeals.length + " results";
        pageOne();
    }
}
// gets one page of deals from CheapShark (each page has 60 deals)
function getDeals(page, keyword) {
    event.preventDefault(); // Prevent page reload

    var title =  "title=" + keyword;
    var url = "https://www.cheapshark.com/api/1.0/deals?" + title;

    // set of if statements that tack on filters to the sent url if they are applied
    if (document.getElementById("homepage-low").value != "") {
        url += "&lowerPrice=" + document.getElementById("homepage-low").value;
    }
    if (document.getElementById("homepage-high").value != "") {
        url += "&upperPrice=" + document.getElementById("homepage-high").value;
    }

    url += "&sortBy=Title";
    var pageUrl = url + "&pageNumber=" + page;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        // Wait for readyState = 4 & 200 response
        if (this.readyState == 4 && this.status == 200) {
            var deals = JSON.parse(this.responseText);   // gets array of games matching search
            getResults(deals, keyword);
        }
        else if (this.readyState == 4) {
            console.log(this.responseText);
        }
    };

    xhttp.open("GET", pageUrl, true);
    xhttp.send();
}

// master list complied, show sections of it in pages
var currentPage;
var totalPageNumber;
function pageOne() {
    event.preventDefault(); // Prevent page reload
    totalPageNumber = Math.ceil((listOfDeals.length)/6); // 20 deals per page? Math.ceil rounds up

    alert("Showing page one"); //TEST DELETE WHEN DONE
    currentPage = 1;
    document.getElementById("page-label").innerHTML = "Page " + currentPage;

    var deals = [];
    if (listOfDeals.length <= 6) {
        document.getElementById("next-deal").style.display = "none";
        for (var i = 0; i < listOfDeals.length; i++) {
            deals.push(listOfDeals[i]);
        }
    }
    else {
        document.getElementById("next-deal").style.display = "block";
        for (var i = (currentPage-1)*6; i < currentPage*6; i++) {
            deals.push(listOfDeals[i]);
        }
    }
    addDeals(deals);
}
function prevDeal() {
    event.preventDefault(); // Prevent page reload
    alert("Previous"); //TEST DELETE WHEN DONE
    currentPage -= 1;
    document.getElementById("page-label").innerHTML = "Page " + currentPage;

    var deals = [];
    document.getElementById("next-deal").style.display = "block";
    // if prev (now current) page is the first page, then you can't go on
    if (currentPage == 1) {
        document.getElementById("prev-deal").style.display = "none";
    }
    for (var i = (currentPage-1)*6; i < currentPage*6; i++) {
        deals.push(listOfDeals[i]);
    }
    addDeals(deals);
}
function nextDeal() {
    event.preventDefault(); // Prevent page reload
    alert("Next"); //TEST DELETE WHEN DONE
    currentPage += 1;
    document.getElementById("page-label").innerHTML = "Page " + currentPage;

    var deals = [];
    document.getElementById("prev-deal").style.display = "block";
    // if next (now current) page is the last page, then you can't go on
    if (currentPage == totalPageNumber) {
        document.getElementById("next-deal").style.display = "none";
        for (var i = (currentPage-1)*6; i < listOfDeals.length; i++) {
            deals.push(listOfDeals[i]);
        }
    }
    else {
        for (var i = (currentPage-1)*6; i < currentPage*6; i++) {
            deals.push(listOfDeals[i]);
        }
    }
    addDeals(deals);
}
document.getElementById("prev-deal").addEventListener("click", prevDeal, false);
document.getElementById("next-deal").addEventListener("click", nextDeal, false);

function addDeals(deals) {
    event.preventDefault(); // Prevent page reload

    document.getElementById("deal-table").remove(); //remove previous
    var results = document.createElement("table");  // gets the containing form
    results.id = "deal-table";

    // header row
    var header = document.createElement("tr");
    var headerCells = new Array("Name", "Sale", "Standard", "Savings", "Rating", "Release Date", "Store");
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
        name.id = "name_id"
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
        store.style.textAlign = "center";
        var storePic = document.createElement("img");
        storePic.src = "https://cheapshark.com" + idToStoreName.get(deal.storeID).images.icon;
        storePic.alt = idToStoreName.get(deal.storeID).name;
        storePic.title = idToStoreName.get(deal.storeID).name;
        store.append(storePic);
        row.append(store);

        console.log(getByValue(idToStoreName, storePic.title))

        results.append(row);
    });
    document.getElementById("mainpage").append(results);
}
