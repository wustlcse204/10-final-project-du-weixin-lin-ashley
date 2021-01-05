// makes map of ids to store to call on later
var idToStoreName = new Map();
getStores(idToStoreName);
function getStores(idToStoreName) {
    //event.preventDefault(); // Prevent page reload
    var url = "https://www.cheapshark.com/api/1.0/stores";

    var xhttp2 = new XMLHttpRequest();
    xhttp2.onreadystatechange = function() {
        // Wait for readyState = 4 & 200 response
        if (this.readyState == 4 && this.status == 200) {
            var stores = JSON.parse(this.responseText);   // gets array of games matching search
            stores.forEach(function(store) {
                if (store.isActive == 1) {
                    // maps store id to it's name and a set of images
                    idToStoreName.set(store.storeID, {name: store.storeName, images: store.images}); 
                }
            });
            makeStoreDealsList();  //guarantees this map will be done when the other functions run
        }
        else if (this.readyState == 4) {
            console.log(this.responseText);
        }
    };

    xhttp2.open("GET", url, true);
    xhttp2.send();
}


function hamburgerMenu(){
  let navigationBar = document.getElementById("sidebar");
  navigationBar.classList.toggle('active');
}

// adds class to search form to decide what to filter based on, changes deal-heading
var filters = document.getElementsByClassName("filter");
for (filter of filters) {
    filter.addEventListener("click", addClass);
}
function addClass() {
    document.getElementById("which-store").innerHTML = this.innerHTML;
    storeFilter = this.id; 
    makeStoreDealsList();
}

var listOfDeals; 
var pageVar;
var storeFilter = "1"; //always start off with steam
function makeStoreDealsList() {
    // event.preventDefault(); // Prevent page reloads
    // reset "masterlists", master variables
    listOfDeals = [];
    pageVar = 0;
    
    // get keyword and kick off recursive
    getStoreDeals(pageVar);
}

// get all available pages of deals by pushing sucessive pages until the next page is empty
function getStoreResults(deals) {
    //pushes deals to the master list
    deals.forEach(function(deal) {
        listOfDeals.push(deal);
    })

    // stop at 1000 - last page = 1000/50 - 1
    if (pageVar == 1) {
        // show total # of results, publish table featuring results
        document.getElementById("results-label").innerHTML = "Found " + listOfDeals.length + " results";
        pageOne();  // in script-homepage.js
    }
    // no deals left - list done, publish results
    else {
        pageVar += 1;
        getStoreDeals(pageVar);
    }
}
// gets one page of deals from CheapShark
function getStoreDeals(page) {
    // event.preventDefault(); // Prevent page reload

    var url = "https://www.cheapshark.com/api/1.0/deals?pageSize=50&sortBy=recent";

    url += "&storeID="+storeFilter;

    var pageUrl = url + "&pageNumber=" + page;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        // Wait for readyState = 4 & 200 response
        if (this.readyState == 4 && this.status == 200) {
            var deals = JSON.parse(this.responseText);   // gets array of games matching search
            getStoreResults(deals);
        }
        else if (this.readyState == 4) {
            console.log(this.responseText);
        }
    };

    xhttp.open("GET", pageUrl, true);
    xhttp.send();
}



// copied from script-homepage
// master list complied, show sections of it in pages
var currentPage;
var totalPageNumber;
function pageOne() {
    event.preventDefault(); // Prevent page reload
    totalPageNumber = Math.ceil((listOfDeals.length)/20); // 20 deals per page? Math.ceil rounds up

    currentPage = 1;
    document.getElementById("page-label").innerHTML = "Page " + currentPage;
    document.getElementById("skip-input").max = totalPageNumber;
    document.getElementById("skip-input").value = "";
    document.getElementById("skip").style.display = "block";  // shows skip to page input

    var deals = [];
    document.getElementById("prev-deal").style.display = "none";
    if (listOfDeals.length <= 20) {
        document.getElementById("next-deal").style.display = "none";
        for (var i = 0; i < listOfDeals.length; i++) {
            deals.push({deal: listOfDeals[i], index: i});
        }
    }
    else {
        document.getElementById("next-deal").style.display = "block";
        for (var i = (currentPage-1)*20; i < currentPage*20; i++) {
            deals.push({deal: listOfDeals[i], index: i});
        }
    }
    addDeals(deals);
}
function prevDeal() {
    event.preventDefault(); // Prevent page reload
    currentPage -= 1;
    document.getElementById("page-label").innerHTML = "Page " + currentPage;

    var deals = [];
    document.getElementById("next-deal").style.display = "block";
    // if prev (now current) page is the first page, then you can't go on
    if (currentPage == 1) {
        document.getElementById("prev-deal").style.display = "none";
    }
    for (var i = (currentPage-1)*20; i < currentPage*20; i++) {
        deals.push({deal: listOfDeals[i], index: i});
    }
    addDeals(deals);
}
function nextDeal() {
    event.preventDefault(); // Prevent page reload
    currentPage += 1;
    document.getElementById("page-label").innerHTML = "Page " + currentPage;

    var deals = [];
    document.getElementById("prev-deal").style.display = "block";
    // if next (now current) page is the last page, then you can't go on
    if (currentPage == totalPageNumber) {
        document.getElementById("next-deal").style.display = "none";
        for (var i = (currentPage-1)*20; i < listOfDeals.length; i++) {
            deals.push({deal: listOfDeals[i], index: i});
        }
    }
    else {
        for (var i = (currentPage-1)*20; i < currentPage*20; i++) {
            deals.push({deal: listOfDeals[i], index: i});
        }
    }
    addDeals(deals);
}
document.getElementById("prev-deal").addEventListener("click", prevDeal, false);
document.getElementById("next-deal").addEventListener("click", nextDeal, false);
function skipToPage() {
    event.preventDefault(); // Prevent page reload

    currentPage = document.getElementById("skip-input").value;
    document.getElementById("prev-deal").style.display = "block";
    document.getElementById("next-deal").style.display = "block";

    var deals = [];
    if (currentPage == 1) {
        document.getElementById("prev-deal").style.display = "none";
    }
    if (currentPage == totalPageNumber) {
        document.getElementById("next-deal").style.display = "none";
        for (var i = (currentPage-1)*20; i < listOfDeals.length; i++) {
            deals.push({deal: listOfDeals[i], index: i});
        }
    } else {
        for (var i = (currentPage-1)*20; i < currentPage*20; i++) {
            deals.push({deal: listOfDeals[i], index: i});
        }
    }
    addDeals(deals);
}
document.getElementById("skip").addEventListener("submit", skipToPage);

function addDeals(deals) {
    event.preventDefault(); // Prevent page reload

    document.getElementById("deal-table").remove(); //remove previous
    var results = document.createElement("table");  // makes the containing form
    results.id = "deal-table";

    // header row
    var header = document.createElement("tr");
    var headerCells = new Array("Name", "Sale", "Standard", "Savings", "Rating", "Deal Date", "Store");
    headerCells.forEach(function(string) {
        var cell = document.createElement("th");
        cell.innerHTML = string;
        header.append(cell);
    });
    results.append(header);

    // rows for each deal
    deals.forEach(function(dealObj) {
        var row = document.createElement("tr");
        row.id = "row-" + dealObj.index;
        row.addEventListener("click", function(){

            var mainpage = document.getElementById("mainpage");
            var tableContainer = document.getElementById("table-container");
            var popupContainer = document.createElement("div");
            popupContainer.id="popupContainer";

            var newPopup = document.createElement("div");
            newPopup.id = "popup";

            //creates x symbol to exit the popup
            var exitPopup = document.createElement("button");
            exitPopup.id="exitPopup";
            exitPopup.innerHTML = '<i class="fas fa-times"></i>';
            exitPopup.onclick = function(){
                newPopup.style.display = "none";
            };
            //this simply moves the x symbol to the right side of the box
            var exitPopupContainer= document.createElement("div")
            exitPopupContainer.id = "exitPopupContainer";
            exitPopupContainer.append(exitPopup);
            newPopup.append(exitPopupContainer);

            var gameThumbnail = document.createElement("img");
            gameThumbnail.id="popup-thumbnail";
            gameThumbnail.src=dealObj.deal.thumb;
            newPopup.append(gameThumbnail);

            var popupName = document.createElement("p");
            popupName.id = "popup-title";
            popupName.innerHTML = dealObj.deal.title;
            newPopup.append(popupName);

            var popupPrice = document.createElement("p");
            popupPrice.className = "popup-details";
            popupPrice.innerHTML = "Price: $" + dealObj.deal.salePrice;
            newPopup.append(popupPrice);

            var popupSavings = document.createElement("p");
            popupSavings.className = "popup-details";
            popupSavings.innerHTML = "Savings: " + Math.round(dealObj.deal.savings) + "%";
            newPopup.append(popupSavings);

            var popupLinkBtn = document.createElement("button");
            popupLinkBtn.id = "popup-button";
            popupLinkBtn.innerHTML = "View Site for Deal Details";
            var storePic = document.createElement("img");
            storePic.src = "https://cheapshark.com" + idToStoreName.get(storeFilter).images.icon;
            storePic.alt = idToStoreName.get(storeFilter).name;
            storePic.title = idToStoreName.get(storeFilter).name;
            storePic.style.paddingRight="10px";
            popupLinkBtn.prepend(storePic);
            newPopup.append(popupLinkBtn);
            popupLinkBtn.onclick = function(){
                window.open("https://www.cheapshark.com/redirect?dealID=" + dealObj.deal.dealID);
            };    
            document.addEventListener('mouseup', function(event){
                var isClickInside = popupContainer.contains(event.target);
                if (!isClickInside){
                newPopup.style.backgroundColor = "green";
                newPopup.style.display = "none";
                }
            });
            popupContainer.append(newPopup);
            mainpage.insertBefore(popupContainer, tableContainer);
        }, false);

        var name = document.createElement("td");
        name.id = "name_id";
        name.innerHTML = dealObj.deal.title;
        row.append(name);

        var price = document.createElement("td");
        price.innerHTML = "$" + dealObj.deal.salePrice;
        row.append(price);

        var normal = document.createElement("td");
        normal.innerHTML = "$" + dealObj.deal.normalPrice;
        row.append(normal);

        var savings = document.createElement("td");
        savings.innerHTML = Math.round(dealObj.deal.savings) + "%";
        row.append(savings);

        var rating = document.createElement("td");
        if (dealObj.deal.steamRatingPercent != 0) {
            rating.innerHTML = dealObj.deal.steamRatingPercent;
        }
        else {
            rating.innerHTML = "N/A";
        }
        row.append(rating);

        //https://stackoverflow.com/questions/10040291/converting-a-unix-timestamp-to-formatted-date-string
        var date = document.createElement("td");
        if (dealObj.deal.lastChange != 0) {
            var milliseconds = dealObj.deal.lastChange * 1000
            var dateObject = new Date(milliseconds)
            date.innerHTML = dateObject.toLocaleDateString() //2019-12-9 10:30:15
        }
        else {
            date.innerHTML = "N/A";
        }
        row.append(date);

        var store  = document.createElement("td");
        var storePic = document.createElement("img");
        storePic.src = "https://cheapshark.com" + idToStoreName.get(storeFilter).images.icon;
        storePic.alt = idToStoreName.get(storeFilter).name;
        storePic.title = idToStoreName.get(storeFilter).name;
        store.appendChild(storePic);
        store.style.textAlign = "center";
        row.append(store);

        results.append(row);
    });
    document.getElementById("table-container").append(results);
}