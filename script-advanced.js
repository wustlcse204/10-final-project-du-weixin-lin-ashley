// binds to advanced search form
const advancedForm = document.getElementById("advanced-search");
advancedForm.addEventListener("submit", makeAdvancedDealsList, false);

var checkedStores;
function makeAdvancedDealsList() {
    event.preventDefault(); // Prevent page reloads
    // reset "masterlists", master variables
    listOfDeals = [];
    pageVar = 0;
    checkedStores = "";
    
    // gets the checked stores here and saves in a string so it doesn't happen every loop
    var advancedStores = document.getElementById("advanced-stores");
    for (s of advancedStores.getElementsByClassName("form-check-input")) {
        if (s.checked) {  // if checked, add the store id to the string
            checkedStores += s.value + ","
        }
    }
    checkedStores = checkedStores.slice(0,-1); //cuts off the end comma
    
    // get keyword and kick off recursive
    keyword = document.getElementById("advanced-title").value;
    getAdvancedDeals(pageVar);

    // resets keyword, everything else left alone since you generally want to save those settings
    document.getElementById("advanced-title").value = "";
}

// get all available pages of deals by pushing sucessive pages until the next page is empty
function getAdvancedResults(deals) {
    // page has some deals - add to master list
    if (deals.length != 0) {
        //pushes deals to the master list
        deals.forEach(function(deal) {
            listOfDeals.push(deal);
        })
        pageVar += 1;
        getAdvancedDeals(pageVar);
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
function getAdvancedDeals(page) {
    event.preventDefault(); // Prevent page reload

    var url = "https://www.cheapshark.com/api/1.0/deals?";

    // required/automatic stuff
    // keyword, required
    url += "title=" + keyword
    // applies what to sort by (labled filter but its a sort by)
    url += "&sortBy=" + document.getElementById("advanced-sort-by").value;

    // set of if statements that tack on filters to the sent url if they are applied
    // upper & lower price range
    if (document.getElementById("advanced-low").value != "") {
        url += "&lowerPrice=" + document.getElementById("advanced-low").value;
    }
    if (document.getElementById("advanced-high").value != "") {
        url += "&upperPrice=" + document.getElementById("advanced-high").value;
    }
    // min ratings
    if (document.getElementById("advanced-metacritic").value != "") {
        url += "&metacritic=" + document.getElementById("advanced-metacritic").value;
    }
    if (document.getElementById("advanced-steam").value != "") {
        url += "&steamRating=" + document.getElementById("advanced-steam").value;
    }

    // checkboxes
    // match exact title
    if (document.getElementById("advanced-exact").checked) {
        url += "&exact=1"
    }
    // only get onsale deals
    if (document.getElementById("advanced-onsale").checked) {
        url += "&onSale=1"
    }
    // sort descending
    if (document.getElementById("advanced-desc").checked) {
        url += "&desc=1"
    }
    // store IDs, to filter by store
    if (checkedStores != "") {
        url += "&storeID=" + checkedStores;
    }

    var pageUrl = url + "&pageNumber=" + page;
    console.log(pageUrl);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        // Wait for readyState = 4 & 200 response
        if (this.readyState == 4 && this.status == 200) {
            var deals = JSON.parse(this.responseText);   // gets array of games matching search
            getAdvancedResults(deals);
        }
        else if (this.readyState == 4) {
            console.log(this.responseText);
        }
    };

    xhttp.open("GET", pageUrl, true);
    xhttp.send();
}