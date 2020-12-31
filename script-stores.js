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
        }
        else if (this.readyState == 4) {
            console.log(this.responseText);
        }
    };

    xhttp2.open("GET", url, true);
    xhttp2.send();
}

// works backwards, gets store ID based on name
function getByValue(map, name) {
    for ([key, value] of map.entries()) {
      if (value.name == name){
        return key;
      }
    }
  }