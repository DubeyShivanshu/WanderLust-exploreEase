const map = new maplibregl.Map({
    container: 'map', // div ID
    style: 'https://api.maptiler.com/maps/streets-v4/style.json?key=ydhkQQdvsR8LwghzIza7',
    center: [77.2090, 28.6139],    
    zoom: 10
});

const listingCoordinates = ["<%= listing.coordinates.lng %>, <%= listing.coordinates.lat %>"];

new maplibregl.Marker()
    .setLngLat(listingCoordinates)
    .setPopup(new maplibregl.Popup().setText("<%= listing.title %>"))
    .addTo(map);
        
