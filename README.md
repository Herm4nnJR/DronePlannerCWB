# Sistema de Registro de Ocorrências - TCC

Este projeto é um sistema web para registro e visualização de ocorrências, desenvolvido como parte do Trabalho de Conclusão de Curso (TCC) do curso de Sistemas de Informação.

## Funcionalidades
- Login de usuário
- Registro de ocorrências com seleção de carga, hospital de destino, hospital de origem e piloto
- Visualização de mapa com rotas entre hospitais
- Dropdowns inteligentes com busca (Select2)
- Backend modular em Flask

## Como usar

1. Instale as dependências do backend (Flask, Flask-CORS, etc)
2. Execute o backend: `python main.py`
3. Abra o arquivo `html/index.html` ou `html/registerOcurrence.html` no navegador para acessar o sistema

## Estrutura
- `html/`: Páginas HTML do sistema
- `style/main.css`: Estilos CSS
- `img/`: Imagens
- `scripts/`: Scripts JS (incluindo integração com Select2 e Leaflet)
- `backend/` ou arquivos Python: API Flask modular

## Observações
- O sistema utiliza Select2 para dropdowns com busca
- O mapa é exibido usando Leaflet e OpenStreetMap
- O backend está pronto para integração com banco de dados

## Autor
- Luis Carlos Hermann Jr
- Orientação: Prof. Dr. Nádia Puchalski Kozievitch
