document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registerForm');
    const msg = document.getElementById('registerMsg');
    const etapa2FieldsDiv = document.getElementById('etapa2Fields');
    const etapa3FieldsDiv = document.getElementById('etapa3Fields');
    const urlApi = 'http://localhost:5000/api';

    let hospitaisData = [];
    let dronesData = [];

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
        $('#drone').select2({
            placeholder: "Selecione o drone",
            allowClear: true
        });
    });

    initializeMap();

    fetch(`${urlApi}/cargos`)
        .then(response => response.json())
        .then(cargos => {
            $('#cargo').empty().append('<option value="">Selecione</option>');
            cargos.forEach(opt => {
                $('#cargo').append(new Option(opt.descricao, opt.id));
            });
            $('#cargo').trigger('change');
        });

    fetch(`${urlApi}/hospitais`)
        .then(response => response.json())
        .then(hospitais => {
            hospitaisData = hospitais;
            $('#hospitaldestino').empty().append('<option value="">Selecione</option>');
            hospitais.forEach(opt => {
                $('#hospitaldestino').append(new Option(opt.nome, opt.crm));
            });
            $('#hospitaldestino').trigger('change');
        });

    fetch(`${urlApi}/pilots`)
        .then(response => response.json())
        .then(pilotos => {
            $('#piloto').empty().append('<option value="">Selecione</option>');
            pilotos.forEach(opt => {
                $('#piloto').append(new Option(opt.nome, opt.id));
            });
            $('#piloto').trigger('change');
        });

    fetch(`${urlApi}/drones`)
        .then(response => response.json())
        .then(drones => {
            dronesData = drones;
            $('#drone').empty().append('<option value="">Selecione</option>');
            drones.forEach(opt => {
                $('#drone').append(new Option(opt.numeroSerie, opt.modelo.id)); 
            });
            $('#drone').trigger('change');
        });

    function fetchHospitaisOrigem() {
        const hospitalDestinoCrm = $('#hospitaldestino').val();
        const cargaTransportadaId = $('#cargo').val();
        $('#hospitalorigem').empty();
        if (!hospitalDestinoCrm || !cargaTransportadaId) 
            return;
        fetch(`${urlApi}/hospitais-origem?hospitaldestino=${hospitalDestinoCrm}&carga=${cargaTransportadaId}`)
            .then(response => response.json())
            .then(hospitais => {
                $('#hospitalorigem').empty().append('<option value="">Selecione</option>');
                hospitais.forEach(opt => {
                    $('#hospitalorigem').append(new Option(opt.nome, opt.crm));
                });
            });
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

    function checkShowEtapa3Fields() {
        if ($('#cargo').val() && $('#hospitaldestino').val() && $('#hospitalorigem').val()) {
            etapa3FieldsDiv.style.display = 'block';
        } else {
            etapa3FieldsDiv.style.display = 'none';
        }
    }

    $('#hospitaldestino').on('change', function() {
        fetchHospitaisOrigem();
        checkShowEtapa2Fields();
        checkShowEtapa3Fields();
        updateMap(urlApi, hospitaisData, dronesData);
    });

    $('#cargo').on('change', function() {
        fetchHospitaisOrigem();
        checkShowEtapa2Fields();
        checkShowEtapa3Fields();
    });

    $('#hospitalorigem').on('change', function() {
        checkShowEtapa3Fields();
        updateMap(urlApi, hospitaisData, dronesData);
    });

    $('#drone').on('change', function() {
        updateMap(urlApi, hospitaisData, dronesData);
    });
});
