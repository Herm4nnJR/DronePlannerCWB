document.addEventListener('DOMContentLoaded', function() {
    const tableBody = document.querySelector('#occurrencesTable tbody');

    // Dados fixos para demonstração
    const mockOccurrences = [
        {
            id: 101,
            hospital_origem: 'Hospital Vita Batel',
            hospital_destino: 'CLÍNICA CARDIOLÓGICA CAMPOS',
            carga: '8x Bolsa de Sangue tipo AB- (Concentrado de Hemácias)',
            piloto: 'Fulano de Tal',
            status: 'Concluído',
            data: '25/08/2025 14:30'
        }
    ];

    // Limpa a tabela antes de adicionar os dados
    tableBody.innerHTML = '';

    if (mockOccurrences.length === 0) {
        const row = tableBody.insertRow();
        const cell = row.insertCell();
        cell.colSpan = 7; // Aumentado para 7 colunas
        cell.textContent = 'Nenhuma ocorrência encontrada.';
        cell.style.textAlign = 'center';
        return;
    }

    mockOccurrences.forEach(occ => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${occ.id}</td>
            <td>${occ.hospital_origem}</td>
            <td>${occ.hospital_destino}</td>
            <td>${occ.carga}</td>
            <td>${occ.piloto}</td>
            <td>${occ.status}</td>
            <td>${occ.data}</td>
        `;
    });
});
