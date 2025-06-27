// Constantes para configuração
const BUTTON_MARGIN = 20;
const ANIMATION_DURATION = 500;
const FIREWORK_PARTICLES = 80; // Aumenta o número de partículas por fogo
const FIREWORK_BURSTS = 20; // Número de "explosões" de fogos (usado como base para frequência)
const FIREWORKS_TOTAL_DURATION = 20 * 1000; // 20 segundos em milissegundos

// Elementos do DOM
const naoButton = document.getElementById('nao');
const simButton = document.getElementById('sim');
const respostaDiv = document.getElementById('resposta');
const backgroundMusic = document.getElementById('backgroundMusic');
const toggleMusic = document.getElementById('toggleMusic');
const volumeControl = document.getElementById('volumeControl');
const heartsContainer = document.querySelector('.hearts-container');
const petalsContainer = document.querySelector('.petals-container');


document.addEventListener('DOMContentLoaded', function () {
    const botaoSim = document.getElementById('sim');
    const resposta = document.getElementById('resposta');
    const audioAmor = document.getElementById('audioAmor');

    botaoSim.addEventListener('click', function () {
        resposta.classList.remove('hidden');
        audioAmor.play();
    });
});

// Verificação de elementos
if (!naoButton || !simButton || !respostaDiv) {
    console.error('Elementos necessários não encontrados!');
    throw new Error('Elementos necessários não encontrados!');
}

// Função para gerar posição aleatória dentro dos limites da tela
function getRandomPosition() {
    const naoRect = naoButton.getBoundingClientRect();

    // Calcula os limites para a posição aleatória DENTRO da janela visível
    const maxX = window.innerWidth - naoRect.width - BUTTON_MARGIN;
    const maxY = window.innerHeight - naoRect.height - BUTTON_MARGIN;
    
    // Gera posições aleatórias garantindo que o botão fique dentro da janela
    const randomX = Math.min(Math.max(BUTTON_MARGIN, Math.random() * maxX), maxX);
    const randomY = Math.min(Math.max(BUTTON_MARGIN, Math.random() * maxY), maxY);

    return { x: randomX, y: randomY };
}


//cronometro 

const inicioNamoro = new Date("2025-06-26T23:00:00");

function atualizarContagem() {
    const agora = new Date();
    const diferenca = agora - inicioNamoro;

    const segundosTotais = Math.floor(diferenca / 1000);

    const dias = Math.floor(segundosTotais / (3600 * 24));
    const horas = Math.floor((segundosTotais % (3600 * 24)) / 3600);
    const minutos = Math.floor((segundosTotais % 3600) / 60);
    const segundos = segundosTotais % 60;

    document.getElementById("dias").textContent = dias;
    document.getElementById("horas").textContent = horas;
    document.getElementById("minutos").textContent = minutos;
    document.getElementById("segundos").textContent = segundos;
}

setInterval(atualizarContagem, 1000);
atualizarContagem(); // Chama logo de início


//tela cheia

document.getElementById('sim').addEventListener('click', () => {
    const element = document.documentElement; // pega o <html>

    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) { // Safari
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { // IE11
        element.msRequestFullscreen();
    }
});



// Função para mover o botão com animação suave usando left/top
function moveButton() {
    const position = getRandomPosition();
    
    // Aplica a nova posição usando left e top
    naoButton.style.transition = `left ${ANIMATION_DURATION}ms ease, top ${ANIMATION_DURATION}ms ease`;
    naoButton.style.left = position.x + 'px';
    naoButton.style.top = position.y + 'px';
    naoButton.style.position = 'fixed'; // Garante que a posição seja fixa
}

document.getElementById("sim").addEventListener("click", function () {
    // Remove o título e os botões
    const titulo = document.querySelector("h1");
    const botoes = document.querySelector(".buttons");

    titulo.remove();
    botoes.remove();

    // Mostra a resposta
    document.getElementById("resposta").classList.remove("hidden");
});



// Função para criar uma única partícula de fogo
function createFireworkParticle(startX, startY, endX, endY, color) {
    const particle = document.createElement('div');
    particle.className = 'firework-particle';
    particle.style.left = `${startX}px`;
    particle.style.top = `${startY}px`;
    particle.style.backgroundColor = color;
    particle.style.setProperty('--end-x', `${endX}px`);
    particle.style.setProperty('--end-y', `${endY}px`);
    document.body.appendChild(particle);

    // Remove o elemento após a animação (8 segundos) - Ajuste conforme necessário
    setTimeout(() => {
        particle.remove();
    }, 8000);
}

// Função para criar uma "explosão" de fogo de artifício em uma posição
function createFireworkBurst(x, y) {
    const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    for (let i = 0; i < FIREWORK_PARTICLES; i++) {
        const angle = Math.random() * Math.PI * 2; // Ângulo aleatório completo
        const distance = Math.random() * 150; // Distância aleatória da explosão
        const endX = distance * Math.cos(angle);
        const endY = distance * Math.sin(angle);
        createFireworkParticle(x, y, endX, endY, color);
    }
}

// Função para iniciar a geração contínua de fogos de artifício por um tempo
function startFireworks() {
    const startTime = Date.now();

    function generateBurst() {
        if (Date.now() - startTime < FIREWORKS_TOTAL_DURATION) {
            const randomX = Math.random() * window.innerWidth;
            const randomY = Math.random() * window.innerHeight * 0.8; // Fica mais na parte superior
            createFireworkBurst(randomX, randomY);
            // Gera próxima explosão com um pequeno atraso aleatório
            setTimeout(generateBurst, Math.random() * 300 + 100); // Atraso entre 100ms e 400ms
        }
    }

    generateBurst(); // Inicia a primeira explosão e o loop
}

// Eventos para o botão "Não"
naoButton.addEventListener('mouseover', moveButton);
naoButton.addEventListener('touchstart', (e) => {
    e.preventDefault();
    moveButton();
});

// Evento para o botão "Sim"
simButton.addEventListener('click', () => {
    try {
        respostaDiv.classList.remove('hidden');
        respostaDiv.classList.add('visible');
        startFireworks(); // Inicia a geração contínua de fogos
    } catch (error) {
        console.error('Erro ao mostrar resposta:', error);
    }
});

// Ajusta a posição do botão "Não" quando a janela é redimensionada
window.addEventListener('resize', () => {
    // Reseta a transição para a posição inicial no fluxo normal
    naoButton.style.transition = 'none';
    naoButton.style.transform = 'none'; // Remover transform, usar left/top
    // Move o botão para uma nova posição aleatória dentro dos novos limites da janela
    // Pequeno delay para garantir que o layout seja atualizado antes de mover
    setTimeout(moveButton, 50);
});

// Configuração inicial da música
backgroundMusic.volume = volumeControl.value / 100;
let isMusicPlaying = false;

// Controle de música
toggleMusic.addEventListener('click', () => {
    if (isMusicPlaying) {
        backgroundMusic.pause();
        toggleMusic.innerHTML = '<span class="material-icons">music_off</span>';
    } else {
        backgroundMusic.play();
        toggleMusic.innerHTML = '<span class="material-icons">music_note</span>';
    }
    isMusicPlaying = !isMusicPlaying;
});

// Controle de volume
volumeControl.addEventListener('input', (e) => {
    backgroundMusic.volume = e.target.value / 100;
});

// Criar corações flutuantes
function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = (Math.random() * 3 + 3) + 's';
    heartsContainer.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 6000);
}

// Criar pétalas
function createPetal() {
    const petal = document.createElement('div');
    petal.className = 'petal';
    petal.style.left = Math.random() * 100 + 'vw';
    petal.style.animationDuration = (Math.random() * 5 + 5) + 's';
    petalsContainer.appendChild(petal);

    setTimeout(() => {
        petal.remove();
    }, 10000);
}

// Iniciar efeitos visuais
setInterval(createHeart, 300);
setInterval(createPetal, 200);

// Efeito de confete melhorado
function createConfetti() {
    const confettiSettings = {
        target: 'confetti-canvas',
        max: 150,
        size: 1.5,
        animate: true,
        props: ['circle', 'square', 'triangle', 'line'],
        colors: [[255, 0, 0], [255, 215, 0], [255, 192, 203]],
        clock: 25,
        rotate: true,
        start_from_edge: true,
        respawn: false
    };

    const confetti = new ConfettiGenerator(confettiSettings);
    confetti.render();
}

// Manipulador do botão Sim
simButton.addEventListener('click', () => {
    respostaDiv.classList.remove('hidden');
    respostaDiv.classList.add('visible');
    createConfetti();
    if (!isMusicPlaying) {
        backgroundMusic.play();
        isMusicPlaying = true;
        toggleMusic.innerHTML = '<span class="material-icons">music_note</span>';
    }
});

// Manipulador do botão Não
let naoCount = 0;
naoButton.addEventListener('mouseover', () => {
    naoCount++;
    const maxX = window.innerWidth - naoButton.offsetWidth;
    const maxY = window.innerHeight - naoButton.offsetHeight;
    
    naoButton.style.position = 'fixed';
    naoButton.style.left = Math.random() * maxX + 'px';
    naoButton.style.top = Math.random() * maxY + 'px';
    
    if (naoCount >= 5) {
        naoButton.style.transform = 'scale(0.8)';
    }
});