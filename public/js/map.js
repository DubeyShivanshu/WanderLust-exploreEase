//59(D). For displaying & accessing map in show.ejs page(so, firstly require 'maptilerKey' of .env in show.ejs inside <head> & also "/js/map.js" in <body> so that use here) 
const map = new maplibregl.Map({
    container: 'map', // div ID
    style: 'https://api.maptiler.com/maps/streets-v4/style.json?key=ydhkQQdvsR8LwghzIza7', // <-- put your MapTiler API key
    center: [77.2090, 28.6139],     //[lng, lat] for New Delhi
    zoom: 10
});

//add a marker at listing's coordinates
const listingCoordinates = ["<%= listing.coordinates.lng %>, <%= listing.coordinates.lat %>"];

new maplibregl.Marker()
    .setLngLat(listingCoordinates)
    .setPopup(new maplibregl.Popup().setText("<%= listing.title %>"))
    .addTo(map);
        
