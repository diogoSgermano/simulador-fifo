let numeroPagina=[1,2,3,4,5,6,7,8,9,10];
const tamanhoRam=10;
const bitRef = [0,1];

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



