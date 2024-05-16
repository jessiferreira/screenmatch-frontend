import getDados from "./getDados.js";

const params = new URLSearchParams(window.location.search);
const serieId = params.get('id');
const listaTemporadas = document.getElementById('temporadas-select');
const fichaSerie = document.getElementById('temporadas-episodios');
const fichaDescricao = document.getElementById('ficha-descricao');

// Função para carregar temporadas
function carregarTemporadas() {
    getDados(`/series/${serieId}/temporadas/todas`)
        .then(data => {
            const temporadasUnicas = [...new Set(data.map(temporada => temporada.temporada))];
            listaTemporadas.innerHTML = ''; // Limpa as opções existentes

            const optionDefault = document.createElement('option');
            optionDefault.value = '';
            optionDefault.textContent = 'Selecione a temporada'
            listaTemporadas.appendChild(optionDefault);

            temporadasUnicas.forEach(temporada => {
                const option = document.createElement('option');
                option.value = temporada;
                option.textContent = temporada;
                listaTemporadas.appendChild(option);
            });

            const optionTodos = document.createElement('option');
            optionTodos.value = 'todas';
            optionTodos.textContent = 'Todas as temporadas'
            listaTemporadas.appendChild(optionTodos);

            const optionTop = document.createElement('option');
            optionTop.value = 'top';
            optionTop.textContent = 'Top 5 episódios'
            listaTemporadas.appendChild(optionTop);
        })
        .catch(error => {
            console.error('Erro ao obter temporadas:', error);
        });
}

// Função para carregar episódios de uma temporada
function carregarEpisodios() {
    getDados(`/series/${serieId}/temporadas/${listaTemporadas.value}`)
        .then(data => {
            const temporadasUnicas = [...new Set(data.map(temporada => temporada.temporada))];
            fichaSerie.innerHTML = '';
            temporadasUnicas.forEach(temporada => {
                const ul = document.createElement('ul');
                ul.className = 'episodios-lista';

                const episodiosTemporadaAtual = data.filter(serie => serie.temporada === temporada);

                const listaHTML = episodiosTemporadaAtual.map(serie => `
                    <li>
                        ${serie.numeroEpisodio} - ${serie.titulo}
                    </li>
                `).join('');
                ul.innerHTML = listaHTML;

                const paragrafo = document.createElement('p');
                const linha = document.createElement('br');
                paragrafo.textContent = `Temporada ${temporada}`;
                fichaSerie.appendChild(paragrafo);
                fichaSerie.appendChild(linha);
                fichaSerie.appendChild(ul);
            });
        })
        .catch(error => {
            console.error('Erro ao obter episódios:', error);
        });
}

// Função para carregar top episódios da série
function carregarTopEpisodios() {
    getDados(`/series/${serieId}/temporadas/top`)
        .then(data => {
            fichaSerie.innerHTML = '';
            const ul = document.createElement('ul');
            ul.className = 'episodios-lista';

            const listaHTML = data.map(serie => `
                <li>
                    Episódio ${serie.numeroEpisodio} - Temporada ${serie.temporada} - ${serie.titulo}
                </li>
            `).join('');
            ul.innerHTML = listaHTML;

            const paragrafo = document.createElement('p');
            const linha = document.createElement('br');
            fichaSerie.appendChild(paragrafo);
            fichaSerie.appendChild(linha);
            fichaSerie.appendChild(ul);

        })
        .catch(error => {
            console.error('Erro ao obter episódios:', error);
        });
}

// Função para carregar informações da série
function carregarInfoSerie() {
    getDados(`/series/${serieId}`)
        .then(data => {
            fichaDescricao.innerHTML = `
                <img src="${data.poster}" alt="${data.titulo}" />
                <div>
                    <h2>${data.titulo}</h2>
                    <div class="descricao-texto">
                        <p><b>Média de avaliações:</b> ${data.avaliacao}</p>
                        <p>${data.sinopse}</p>
                        <p><b>Estrelando:</b> ${data.atores}</p>
                    </div>
                </div>
            `;
        })
        .catch(error => {
            console.error('Erro ao obter informações da série:', error);
        });

    // Função para adicionar a opção de Top 5 Episódios na barra de rolagem
    function adicionarOpcaoTop5() {
        const optionTop5 = document.createElement('option');
        optionTop5.value = 'top5';
        optionTop5.textContent = 'Top 5 Episódios';
        listaTemporadas.appendChild(optionTop5);

        // Função para carregar o Top 5 Episódios de uma série
        function carregarTop5Episodios() {
            getDados(`/series/${serieId}/episodios/top5`)
                .then(data => {
                    console.log(data); // Adicione esta linha para verificar os dados recebidos
                    if (!Array.isArray(data)) {
                        throw new Error('A resposta recebida não é um array');
                    }

                    const ul = document.createElement('ul');
                    ul.className = 'episodios-lista';

                    const listaHTML = data.map(episodio => `
                <li>
                    ${episodio.numeroEpisodio} - ${episodio.titulo}
                </li>
            `).join('');
                    ul.innerHTML = listaHTML;

                    fichaSerie.innerHTML = '';
                    fichaSerie.appendChild(ul);
                })
                .catch(error => {
                    console.error('Erro ao obter o Top 5 Episódios:', error);
                    fichaSerie.textContent = 'Não foi possível carregar o Top 5 Episódios.';
                });
        }


        // Adiciona ouvinte de evento para o elemento select
        listaTemporadas.addEventListener('change', carregarEpisodios);

        // Adiciona ouvinte de evento para o elemento select
        listaTemporadas.addEventListener('change', function () {
            const temporadaSelecionada = listaTemporadas.value;
            if (temporadaSelecionada === 'top5') {
                carregarTop5Episodios(); // Chama a função para carregar os Top 5 Episódios
            } else {
                carregarEpisodios(temporadaSelecionada); // Chama a função para carregar episódios da temporada selecionada
            }
        });

    }

    // Adiciona ouvinte de evento para o elemento select
    listaTemporadas.addEventListener('change', carregarEpisodios);
    listaTemporadas.addEventListener('change', carregarTopEpisodios);

}
// Carrega as informações da série e as temporadas quando a página carrega
carregarInfoSerie();
carregarTemporadas();
carregarTop5Episodios();