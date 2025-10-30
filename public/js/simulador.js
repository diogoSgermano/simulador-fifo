let numeroPagina=[1,2,3,4,5,6,7,8,9,10];
const tamanhoRam=10;
const bitRef = [0,1];
let espacoRam = [null,null,null,null,null,null,null,null,null,null];
let filaAguard = [null,null,null,null];
/**
 * Escolhe um item aleatório de uma lista (array).
 * @param {Array} lista O array do qual escolher um item.
 * @returns {*} Um item aleatório da lista, ou undefined se a lista estiver vazia.
 */
function escolherItemAleatorio(lista) {
    // Retorna undefined se a lista for nula ou vazia para evitar erros.
    if (!lista || lista.length === 0) {
      return undefined;
    }
    const indiceAleatorio = Math.floor(Math.random() * lista.length);
    return lista[indiceAleatorio];
}

/**
 * Inicia a simulação de alocação de páginas na RAM.
 * Move uma página para um espaço da RAM a cada 2 segundos.
 */
function iniciarSimulacao() {
    // Seleciona todos os elementos de página e de espaço na RAM
    const paginas = document.querySelectorAll('.pagina');
    const espacosRAM = document.querySelectorAll('.espaco');
    const filaAguardando = document.getElementById('filaAguardando');
    let paginaAtualIndex = 0;

    // Define um intervalo para executar a alocação a cada 2 segundos
    const intervalo = setInterval(() => {
        // Verifica se ainda há páginas para alocar e espaços disponíveis
        if (paginaAtualIndex < paginas.length && paginaAtualIndex < espacosRAM.length) {
            const paginaAtual = paginas[paginaAtualIndex];
            const espacoDestino = espacosRAM[paginaAtualIndex];

            // Copia todo o conteúdo HTML da página para o espaço na RAM
            espacoDestino.innerHTML = paginaAtual.innerHTML;
            // Copia a cor de fundo da página para o espaço
            espacoDestino.style.backgroundColor = window.getComputedStyle(paginaAtual).backgroundColor;

            // Limpa a página original para indicar que ela foi movida
            paginaAtual.innerHTML = '';
            paginaAtual.style.backgroundColor = 'transparent'; // Deixa o fundo transparente
            paginaAtual.style.border = '1px dashed #ccc'; // Adiciona uma borda para marcar o local vazio

            // Incrementa o índice para a próxima página
            paginaAtualIndex++;
        } else {
            // Para o intervalo quando todas as páginas forem movidas ou não houver mais espaço
            clearInterval(intervalo);

            // Limpa a fila de espera antes de adicionar as páginas
            filaAguardando.innerHTML = '';

            // Move as páginas restantes para a fila de espera
            for (let i = paginaAtualIndex; i < paginas.length; i++) {
                filaAguardando.appendChild(paginas[i]);
            }

            // Inicia a fase de troca de páginas após um pequeno atraso
            setTimeout(iniciarTrocaDePaginas, 2000);
        }
    }, 2000); // 2000ms = 2 segundos
}

/**
 * Inicia a simulação de troca de páginas (algoritmo da Segunda Chance/Relógio).
 */
function iniciarTrocaDePaginas() {
    const espacosRAM = document.querySelectorAll('.espaco');
    const filaAguardando = document.getElementById('filaAguardando');
    let ponteiroRAM = 0; // Simula o ponteiro do relógio

    const intervaloTroca = setInterval(() => {
        // Se não houver páginas na fila de espera, para a simulação
        if (filaAguardando.children.length === 0) {
            clearInterval(intervaloTroca);
            console.log("Simulação de troca de páginas concluída.");
            return;
        }

        const espacoAtual = espacosRAM[ponteiroRAM];
        const bitRefElement = espacoAtual.querySelector('[id^="pg"]');
        const bit = bitRefElement.textContent.trim().slice(-1);

        if (bit === '0') {
            // Encontrou uma página para substituir (Bit de referência é 0)
            console.log(`Substituindo página no Espaço ${ponteiroRAM + 1} (Bit 0)`);

            const paginaEntrando = filaAguardando.firstElementChild;
            
            // Guarda as informações da página que vai sair da RAM (antes de sobrescrever)
            const conteudoSaindo = espacoAtual.firstElementChild.cloneNode(true);
            const corSaindo = window.getComputedStyle(espacoAtual).backgroundColor;

            // Troca: A página da fila entra na RAM
            espacoAtual.innerHTML = paginaEntrando.innerHTML;
            espacoAtual.style.backgroundColor = window.getComputedStyle(paginaEntrando).backgroundColor;

            // A página que saiu da RAM volta para o final da fila de espera
            paginaEntrando.innerHTML = ''; // Limpa o conteúdo do container da página
            paginaEntrando.appendChild(conteudoSaindo); // Adiciona o conteúdo que saiu da RAM
            paginaEntrando.style.backgroundColor = corSaindo; // Aplica a cor correta
            filaAguardando.appendChild(paginaEntrando);

            // Avança o ponteiro para a próxima verificação
            ponteiroRAM = (ponteiroRAM + 1) % espacosRAM.length;

        } else {
            // Segunda chance (Bit de referência é 1)
            console.log(`Dando segunda chance para a página no Espaço ${ponteiroRAM + 1} (Bit 1 -> 0)`);
            // Zera o bit de referência
            bitRefElement.textContent = 'Bit de referência: 0';
            // Avança o ponteiro para verificar o próximo espaço no próximo ciclo
            ponteiroRAM = (ponteiroRAM + 1) % espacosRAM.length;
        }
        
        // Atualiza as linhas que conectam páginas ao disco de I/O
        atualizarLinhasIO();

    }, 3000); // A cada 3 segundos, tenta uma substituição
}

/**
 * Desenha ou apaga linhas pontilhadas entre as páginas na RAM com bit 1 e o disco.
 */
function atualizarLinhasIO() {
    const svg = document.getElementById('svg-canvas');
    const disco = document.getElementById('disco');
    const espacosRAM = document.querySelectorAll('.espaco');
    const containerRect = document.getElementById('leftContainer').getBoundingClientRect();

    // Limpa todas as linhas existentes
    svg.innerHTML = '';

    // Posição do destino (centro do disco)
    const discoRect = disco.getBoundingClientRect();
    const x2 = (discoRect.left - containerRect.left) + (discoRect.width / 2);
    const y2 = (discoRect.top - containerRect.top) + (discoRect.height / 2);

    espacosRAM.forEach(espaco => {
        const bitRefElement = espaco.querySelector('[id^="pg"]');
        // Se o espaço contém uma página e o bit de referência é 1
        if (bitRefElement && bitRefElement.textContent.trim().endsWith('1')) {
            // Posição da origem (centro do espaço da RAM)
            const espacoRect = espaco.getBoundingClientRect();
            const x1 = (espacoRect.left - containerRect.left) + (espacoRect.width / 2);
            const y1 = (espacoRect.top - containerRect.top) + (espacoRect.height / 2);

            // Cria o elemento <line> do SVG
            const linha = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            linha.setAttribute('x1', x1);
            linha.setAttribute('y1', y1);
            linha.setAttribute('x2', x2);
            linha.setAttribute('y2', y2);
            linha.setAttribute('stroke', 'black');
            linha.setAttribute('stroke-width', '2');
            linha.setAttribute('stroke-dasharray', '5,5'); // Cria o efeito pontilhado
            svg.appendChild(linha);
        }
    });
}

// Inicia a simulação assim que a página for totalmente carregada
document.addEventListener('DOMContentLoaded', () => {
    // Inicia a simulação principal
    iniciarSimulacao();

    // Adiciona o evento de clique para o botão de reset
    const resetButton = document.getElementById('resetButton');
    resetButton.addEventListener('click', () => {
        window.location.reload();
    });
});
