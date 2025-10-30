// Espera o conteúdo da página carregar completamente
document.addEventListener('DOMContentLoaded', () => {

    // Seleciona o botão pelo ID que adicionamos
    const startButton = document.getElementById('startButton');

    // Evento para quando o mouse entra na área do botão
    startButton.addEventListener('mouseover', () => {
        startButton.style.backgroundColor = 'white';
        startButton.style.color = 'rgb(0, 68, 255)';
        startButton.style.border = '2px solid rgb(0, 68, 255)';
    });

    // Evento para quando o mouse sai da área do botão
    startButton.addEventListener('mouseout', () => {
        startButton.style.backgroundColor = 'rgb(0, 68, 255)';
        startButton.style.color = 'white';
        startButton.style.border = '2px solid transparent';
    });

    // Evento de clique para redirecionar para a página criar.html
    startButton.addEventListener('click', () => { 
        window.location.href ="simulador.html"
    });
});
