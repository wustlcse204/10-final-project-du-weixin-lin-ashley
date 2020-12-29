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
                    idToStoreName.set(store.storeID, store.storeName); 
                }
            });
        }
        else if (this.readyState == 4) {
            console.log(this.responseText);
        }
    };

    xhttp2.open("GET", url, true);
    xhttp2.send();
}
