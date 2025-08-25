let map;
let dynamicLayers;

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
        dynamicLayers = L.featureGroup().addTo(map);
    };
}

async function updateMap(urlApi, hospitaisData, dronesData) { 
    dynamicLayers.clearLayers();

    const destino = hospitaisData.find(h => h.crm == $('#hospitaldestino').val());
    const origem = hospitaisData.find(h => h.crm == $('#hospitalorigem').val());
    const drone = dronesData.find(d => d.modelo.id == $('#drone').val());

    let points = []
    if (hasLatitudeLongitude(drone)){
        droneMarker = L.marker([drone.lat, drone.lng])
            .bindPopup('Drone').openPopup();
        dynamicLayers.addLayer(droneMarker);
        points.push([drone.lat, drone.lng]);
    }
    if (hasLatitudeLongitude(origem)){
        origemMarker = L.marker([origem.lat, origem.lng])
            .bindPopup('Hospital Origem').openPopup();
        dynamicLayers.addLayer(origemMarker);
        points.push([origem.lat, origem.lng]);
    }
    if (hasLatitudeLongitude(destino)){
        destinoMarker = L.marker([destino.lat, destino.lng])
            .bindPopup('Hospital Destino').openPopup();
        dynamicLayers.addLayer(destinoMarker);
        points.push([destino.lat, destino.lng]);
    }

    await calcularRota(urlApi, points);

    await mapzoom(dynamicLayers);
}

function hasLatitudeLongitude(entity) {
    return entity && entity.lat != null && entity.lng != null;
}

async function calcularRota(urlApi, points) {
    if (points.length < 2)
        return;

    try {
        const params = new URLSearchParams();
        points.forEach(p => params.append('point', p));
        
        const response = await fetch(`${urlApi}/map_route?${params.toString()}`);
        if (!response.ok) 
            throw new Error(`Erro na API: ${response.statusText}`);
    
        const map_route = await response.json();
        if (map_route.paths && map_route.paths.length > 0) {
            const RouteCoordinates = polyline.decode(map_route.paths[0].points);
            route1Line = L.polyline(RouteCoordinates, { color: 'blue', weight: 4 });
            dynamicLayers.addLayer(route1Line);
        }
    } catch (error) {
        console.error(error);
    }
}

async function mapzoom(layerGroup) {
    if (layerGroup && layerGroup.getLayers().length > 0) {
        const bounds = layerGroup.getBounds();
        map.fitBounds(bounds, { padding: [50, 50] });
    }
}