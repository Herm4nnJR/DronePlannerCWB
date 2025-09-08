let map;
let dynamicLayers;
let distanciaTotal = null;
let tempoTotal = null;
let distanciaParcial1 = null;
let tempoParcial1 = null;
let distanciaParcial2 = null;
let tempoParcial2 = null;

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
    const drone = dronesData.find(d => d.numeroSerie == $('#drone').val());

    if (hasLatitudeLongitude(drone)){
        droneMarker = L.marker([drone.lat, drone.lng])
            .bindPopup('Drone').openPopup();
        dynamicLayers.addLayer(droneMarker);
    }
    if (hasLatitudeLongitude(origem)){
        origemMarker = L.marker([origem.lat, origem.lng])
            .bindPopup('Hospital Origem').openPopup();
        dynamicLayers.addLayer(origemMarker);
    }
    if (hasLatitudeLongitude(destino)){
        destinoMarker = L.marker([destino.lat, destino.lng])
            .bindPopup('Hospital Destino').openPopup();
        dynamicLayers.addLayer(destinoMarker);
    }

    const parcial1 = await calcularRota(urlApi, drone, origem, drone, 'blue');
    const parcial2 = await calcularRota(urlApi, origem, destino, drone, 'red');
    const total = await calcularTotal(parcial1, parcial2);

    setResumoRota({
        totalDist: total?.distancia,
        totalTime: total?.tempo,
        totalTime_hora_min_seg: total?.tempo_hora_min_seg,
        parcial1Dist: parcial1?.distancia,
        parcial1Time: parcial1?.tempo,
        parcial1Time_hora_min_seg: parcial1?.tempo_hora_min_seg,
        parcial2Dist: parcial2?.distancia,
        parcial2Time: parcial2?.tempo,
        parcial2Time_hora_min_seg: parcial2?.tempo_hora_min_seg
    });

    await mapzoom(dynamicLayers);
}

function hasLatitudeLongitude(entity) {
    return entity && entity.lat != null && entity.lng != null;
}

async function calcularRota(urlApi, origem, destino, droneUtilizado, cor) {
    if (!origem || !destino)
        return;

    try {
        const params = new URLSearchParams();
        params.append('point', [origem.lat, origem.lng]);
        params.append('point', [destino.lat, destino.lng]);
        if (droneUtilizado)
            params.append('droneUtilizado', droneUtilizado.modelo.id);

        const response = await fetch(`${urlApi}/map_route?${params.toString()}`);
        if (!response.ok) 
            throw new Error(`Erro na API: ${response.statusText}`);
    
        const map_route = await response.json();
        if (map_route.route) {
            const RouteCoordinates = polyline.decode(map_route.route);
            route1Line = L.polyline(RouteCoordinates, { color: cor, weight: 4 });
            dynamicLayers.addLayer(route1Line);
        }
        return {
            distancia: map_route.distancia,
            tempo: map_route.tempo
        };
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

async function calcularTotal(parcial1, parcial2) {
    if (!parcial1 && !parcial2)
        return;
    try {
        const params = new URLSearchParams();
        params.append('tempo1', parcial1?.tempo);
        params.append('tempo2', parcial2?.tempo);
        params.append('distancia1', parcial1?.distancia);
        params.append('distancia2', parcial2?.distancia);

        const response = await fetch(`${urlApi}/tempo_distancia_total/tempos?${params.toString()}`);
        if (!response.ok) 
            throw new Error(`Erro na API: ${response.statusText}`);

        total = await response.json();
        return{
            distancia: total.distancia,
            tempo: total.tempo,
            tempo_hora_min_seg: total.tempo_hora_min_seg
        }
    } catch (error) {
        console.error(error);
    }
}

function setResumoRota({ totalDist, totalTime, TotalTime_hora_min_seg, parcial1Dist, parcial1Time, parcial1Time_hora_min_seg, parcial2Dist, parcial2Time, parcial2Time_hora_min_seg }) {
    distanciaTotal = totalDist;
    tempoTotal = totalTime;
    tempoTotal_hora_min_seg = TotalTime_hora_min_seg;
    distanciaParcial1 = parcial1Dist;
    tempoParcial1 = parcial1Time;
    tempoParcial1_hora_min_seg = parcial1Time_hora_min_seg;
    distanciaParcial2 = parcial2Dist;
    tempoParcial2 = parcial2Time;
    tempoParcial2_hora_min_seg = parcial2Time_hora_min_seg;
}


function getResumoRota() {
    return {
        distanciaTotal,
        tempoTotal,
        tempoTotal_hora_min_seg,
        distanciaParcial1,
        tempoParcial1,
        tempoParcial1_hora_min_seg,
        distanciaParcial2,
        tempoParcial2,
        tempoParcial2_hora_min_seg
    };
}

window.setResumoRota = setResumoRota;
window.getResumoRota = getResumoRota;