document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registerForm');
    const msg = document.getElementById('registerMsg');
    const cargoSelect = document.getElementById('cargo');
    const hospitalDestinoSelect = document.getElementById('hospitaldestino');
    const hospitalOrigemSelect = document.getElementById('hospitalorigem');
    const pilotoSelect = document.getElementById('piloto');
    const etapa2FieldsDiv = document.getElementById('etapa2Fields');
    const urlApi = 'http://localhost:5000/api';

    $(document).ready(function() {
        $('#cargo').select2({
            placeholder: "Selecione a carga",
            allowClear: true
        });
        $('#hospitaldestino').select2({
            placeholder: "Selecione o hospital destino",
            allowClear: true
        });
        $('#hospitalorigem').select2({
            placeholder: "Selecione o hospital de origem",
            allowClear: true
        });
        $('#piloto').select2({
            placeholder: "Selecione o piloto",
            allowClear: true
        });
    });

    // Carregar opções de cargos
    fetch(`${urlApi}/cargos`)
        .then(response => response.json())
        .then(cargos => {
            $('#cargo').empty().append('<option value="">Selecione</option>');
            cargos.forEach(opt => {
                $('#cargo').append(new Option(opt.nome, opt.id));
            });
            $('#cargo').trigger('change');
        });

    let hospitaisData = [];
    const mapDiv = document.getElementById('map');
    let map;

    // Carregar opções de hospitais
    fetch(`${urlApi}/hospitais`)
        .then(response => response.json())
        .then(hospitais => {
            hospitaisData = hospitais;
            $('#hospitaldestino').empty().append('<option value="">Selecione</option>');
            hospitais.forEach(opt => {
                $('#hospitaldestino').append(new Option(opt.nome, opt.id));
            });
            $('#hospitaldestino').trigger('change');
        });

    // Carregar opções de pilotos
    fetch(`${urlApi}/pilots`)
        .then(response => response.json())
        .then(pilotos => {
            $('#piloto').empty().append('<option value="">Selecione</option>');
            pilotos.forEach(opt => {
                $('#piloto').append(new Option(opt.nome, opt.id));
            });
            $('#piloto').trigger('change');
        });

    // Carregar hospitais de origem com base no hospital de destino selecionado
    function fetchHospitaisOrigem() {
        const hospitalDestinoId = $('#hospitaldestino').val();
        fetch(`${urlApi}/hospitais-origem?hospitaldestino=${hospitalDestinoId}`)
            .then(response => response.json())
            .then(hospitais => {
                $('#hospitalorigem').empty().append('<option value="">Selecione</option>');
                hospitais.forEach(opt => {
                    $('#hospitalorigem').append(new Option(opt.nome, opt.id));
                });
                $('#hospitalorigem').trigger('change');
            });
    }
    // Adiciona o Leaflet ao carregar a página
    const leafletLink = document.createElement('link');
    leafletLink.rel = 'stylesheet';
    leafletLink.href = 'https://unpkg.com/leaflet/dist/leaflet.css';
    document.head.appendChild(leafletLink);
    const leafletScript = document.createElement('script');
    leafletScript.src = 'https://unpkg.com/leaflet/dist/leaflet.js';
    document.body.appendChild(leafletScript);

    // Inicializa o mapa ao carregar a página
    leafletScript.onload = function() {
        map = L.map('map').setView([-25.4284, -49.2733], 12);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
    };

    $('#hospitaldestino').on('change', function() {
        fetchHospitaisOrigem();
        updateMap();
        // if (selected && window.L) {
        //     if (!map) {
        //         map = L.map('map').setView([selected.lat, selected.lng], 15);
        //         marker = L.marker([selected.lat, selected.lng]).addTo(map);
        //         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        //             attribution: '© OpenStreetMap contributors'
        //         }).addTo(map);
        //     } else {
        //         map.setView([selected.lat, selected.lng], 15);
        //         marker.setLatLng([selected.lat, selected.lng]);
        //     }
        // } else if (window.L && map) {
        //     map.setView([-25.4284, -49.2733], 12); // Centraliza em um ponto padrão
        //     marker.setLatLng([-25.4284, -49.2733]);
        // }
    });

    $('#hospitalorigem').on('change', function() {
        updateMap();
    });

    let origemMarker = null;
    let destinoMarker = null;
    let routeLine = null;

    function updateMap() {
        const destino = hospitaisData.find(h => h.id == $('#hospitaldestino').val());
        const origem = hospitaisData.find(h => h.id == $('#hospitalorigem').val());

        // Remove marcadores e linha antigos, se existirem
        if (origemMarker) {
            map.removeLayer(origemMarker);
            origemMarker = null;
        }
        if (destinoMarker) {
            map.removeLayer(destinoMarker);
            destinoMarker = null;
        }
        if (routeLine) {
            map.removeLayer(routeLine);
            routeLine = null;
        }

        // Adiciona marcadores se as coordenadas estiverem disponíveis
        if (origem && origem.lat && origem.lng) {
            origemMarker = L.marker([origem.lat, origem.lng]).addTo(map)
                .bindPopup('Hospital de Origem').openPopup();
        }
        if (destino && destino.lat && destino.lng) {
            destinoMarker = L.marker([destino.lat, destino.lng]).addTo(map)
                .bindPopup('Hospital Destino').openPopup();
        }

        // Traça uma linha entre origem e destino se ambos existirem
        if (origem && destino && origem.lat && origem.lng && destino.lat && destino.lng) {
            routeLine = L.polyline([
                [origem.lat, origem.lng],
                [destino.lat, destino.lng]
            ], { color: 'blue', weight: 4 }).addTo(map);
            // Ajusta o zoom do mapa para mostrar ambos os pontos
            map.fitBounds([
                [origem.lat, origem.lng],
                [destino.lat, destino.lng]
            ], { padding: [50, 50] });
        }
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const cargo = $('#cargo').val();
        const hospitaldestino = $('#hospitaldestino').val();
        const hospitalorigem = $('#hospitalorigem').val();
        const piloto = $('#piloto').val();

        fetch(`${urlApi}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cargo, hospitaldestino, hospitalorigem, piloto })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                msg.style.display = 'block';
                form.reset();
            } else {
                msg.style.display = 'none';
                alert('Erro ao registrar ocorrência.');
            }
        })
        .catch(() => {
            msg.style.display = 'none';
            alert('Erro ao conectar com o servidor.');
        });
    });

    function checkShowEtapa2Fields() {
        if ($('#cargo').val() && $('#hospitaldestino').val()) {
            etapa2FieldsDiv.style.display = 'block';
        } else {
            etapa2FieldsDiv.style.display = 'none';
        }
    }
    $('#cargo').on('change', checkShowEtapa2Fields);
    $('#hospitaldestino').on('change', checkShowEtapa2Fields);
});
