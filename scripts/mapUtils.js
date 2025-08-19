let map;
let origemMarker = null;
let destinoMarker = null;
let droneMarker = null;
let route1Line = null;
let route2Line = null;

function initializeMap() {
    const leafletLink = document.createElement('link');
    leafletLink.rel = 'stylesheet';
    leafletLink.href = 'https://unpkg.com/leaflet/dist/leaflet.css';
    document.head.appendChild(leafletLink);

    const leafletScript = document.createElement('script');
    leafletScript.src = 'https://unpkg.com/leaflet/dist/leaflet.js';
    document.body.appendChild(leafletScript);

    leafletScript.onload = function() {
        map = L.map('map').setView([-25.4284, -49.2733], 12);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
    };
}

function updateMap(hospitaisData, dronesData) {
    const destino = hospitaisData.find(h => h.crm == $('#hospitaldestino').val());
    const origem = hospitaisData.find(h => h.crm == $('#hospitalorigem').val());
    const drone = dronesData.find(d => d.numeroSerie == $('#drone').val());
    let boundsArray = [];

    if (origemMarker) {
        map.removeLayer(origemMarker);
        origemMarker = null;
    }
    if (destinoMarker) {
        map.removeLayer(destinoMarker);
        destinoMarker = null;
    }
    if (droneMarker) {
        map.removeLayer(droneMarker);
        droneMarker = null;
    }
    if (route1Line) {
        map.removeLayer(route1Line);
        route1Line = null;
    }

    if (origem && origem.lat && origem.lng) {
        origemMarker = L.marker([origem.lat, origem.lng]).addTo(map)
            .bindPopup('Hospital de Origem').openPopup();
    }
    if (destino && destino.lat && destino.lng) {
        destinoMarker = L.marker([destino.lat, destino.lng]).addTo(map)
            .bindPopup('Hospital Destino').openPopup();
    }
    if (drone && drone.lat && drone.lng) {
        droneMarker = L.marker([drone.lat, drone.lng]).addTo(map)
            .bindPopup('Drone').openPopup();
    }

    if (hasLatitudeLongitude(origem) && hasLatitudeLongitude(destino)) {
        route1Line = L.polyline([
            [origem.lat, origem.lng],
            [destino.lat, destino.lng]
        ], { color: 'blue', weight: 4 }).addTo(map);
        boundsArray.push([origem.lat, origem.lng], [destino.lat, destino.lng]);
    }

    if (hasLatitudeLongitude(drone) && hasLatitudeLongitude(origem)) {
        route2Line = L.polyline([
            [drone.lat, drone.lng],
            [origem.lat, origem.lng]
        ], { color: 'orange', weight: 4 }).addTo(map);
        boundsArray.push([drone.lat, drone.lng], [origem.lat, origem.lng]);
    }

    if (boundsArray.length > 0) {
        map.fitBounds(boundsArray, { padding: [50, 50] });
    }
}

function hasLatitudeLongitude(entity) {
    return entity && entity.lat && entity.lng;
}
