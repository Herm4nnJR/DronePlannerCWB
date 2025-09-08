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
                $('#piloto').append(new Option(opt.nome, opt.sarpas));
            });
            $('#piloto').trigger('change');
        });

    fetch(`${urlApi}/drones`)
        .then(response => response.json())
        .then(drones => {
            dronesData = drones;
            $('#drone').empty().append('<option value="">Selecione</option>');
            drones.forEach(opt => {
                $('#drone').append(new Option(`${opt.modelo.fabricante} ${opt.modelo.modelo}`, opt.numeroSerie)); 
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
        const modal = document.getElementById('detailsModal');
        
        const hospitalOrigemCrm = $('#hospitalorigem').val();
        const hospitalDestinoCrm = $('#hospitaldestino').val();
        const droneNumeroSerie = $('#drone').val();

        const hospitalOrigem = hospitaisData.find(h => h.crm == hospitalOrigemCrm) || {};
        const hospitalDestino = hospitaisData.find(h => h.crm == hospitalDestinoCrm) || {};
        const drone = dronesData.find(d => d.numeroSerie == droneNumeroSerie) || {};
        const cargaText = $('#cargo option:selected').text();

        $('#summaryHospitalOrigem').text(hospitalOrigem.nome || '-');
        $('#summaryHospitalOrigemEndereco').text(hospitalOrigem.endereco || '');
        $('#summaryHospitalDestino').text(hospitalDestino.nome || '-');
        $('#summaryHospitalDestinoEndereco').text(hospitalDestino.endereco || '');
        $('#summaryDrone').text(drone.modelo ? `${drone.modelo.fabricante} ${drone.modelo.modelo}` : '-');
        $('#summaryCarga').text(cargaText);
        const resumoRota = window.getResumoRota ? window.getResumoRota() : {};

        $('#summaryDistanciaTotal').text(resumoRota.distanciaTotal ?? '-');
        $('#summaryTempoTotal').text(resumoRota.tempoTotal_hora_min_seg ?? '-');
        $('#summaryDistanciaParcial1').text(resumoRota.distanciaParcial1 ?? '-');
        $('#summaryTempoParcial1').text(resumoRota.tempoParcial1_hora_min_seg ?? '-');
        $('#summaryDistanciaParcial2').text(resumoRota.distanciaParcial2 ?? '-');
        $('#summaryTempoParcial2').text(resumoRota.tempoParcial2_hora_min_seg ?? '-');

        modal.style.display = 'block';
    });

    const closeButton = document.querySelector('.close-button');
    closeButton.onclick = function() {
        const modal = document.getElementById('detailsModal');
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        const modal = document.getElementById('detailsModal');
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    const additionalDetailsForm = document.getElementById('additionalDetailsForm');
    additionalDetailsForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const cargo = $('#cargo').val();
        const hospitaldestino = $('#hospitaldestino').val();
        const hospitalorigem = $('#hospitalorigem').val();
        const piloto = $('#piloto').val();
        const drone = $('#drone').val();
        const inicioOperacao = document.getElementById('inicioOperacao').value;
        const nomeOperacao = document.getElementById('nomeOperacao').value;
        const perfilOperacao = document.getElementById('perfilOperacao').value;
        const observacoes = document.getElementById('observacoes').value;

        const data = { cargo, hospitaldestino, hospitalorigem, piloto, drone, inicioOperacao, nomeOperacao, perfilOperacao, observacoes };

        fetch(`${urlApi}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                document.getElementById('detailsModal').style.display = 'none';
                
                form.reset();
                additionalDetailsForm.reset();
                $('#cargo, #hospitaldestino, #hospitalorigem, #piloto, #drone').val(null).trigger('change');

                const successModal = document.getElementById('successModal');
                successModal.style.display = 'block';
            } else {
                console.error("Erro ao registrar:", result.error);
            }
        })
        .catch(error => {
            console.error("Erro ao enviar dados:", error);
        });

    });

    const successModal = document.getElementById('successModal');
    const successCloseButton = document.querySelector('.success-close-button');
    const closeSuccessModalBtn = document.getElementById('closeSuccessModalBtn');

    const closeSuccessModal = () => {
        successModal.style.display = 'none';
    };

    successCloseButton.onclick = closeSuccessModal;
    closeSuccessModalBtn.onclick = closeSuccessModal;

    window.addEventListener('click', function(event) {
        if (event.target == successModal) {
            closeSuccessModal();
        }
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
