const pantallaInicio = document.getElementById('pantalla-inicio');
const pantallaJuego = document.getElementById('pantalla-juego');
const btnComenzar = document.getElementById('btn-comenzar');
const inputNombre = document.getElementById('nombre-usuario');
const displayNombre = document.getElementById('display-nombre');
const puntuacionTxt = document.getElementById('puntuacion');
const mosquito = document.getElementById('mosquito');
const audioZumbido = document.getElementById('zumbido');
const recordDiv = document.getElementById('record-contenedor');

let puntos = 0;
let velocidad = 1500;
let intervaloMovimiento;
let nombreActual = "";

window.onload = () => {
    const savedUser = localStorage.getItem('mosquito_user');
    const savedScore = localStorage.getItem('mosquito_score');
    if (savedUser) {
        recordDiv.innerHTML = `Último record: <b>${savedUser}</b> con <b>${savedScore}</b> puntos`;
        inputNombre.value = savedUser;
    }
};

btnComenzar.addEventListener('click', () => {
    nombreActual = inputNombre.value.trim();
    if (nombreActual === "") {
        alert("Por favor, ingresa un nombre");
        return;
    }
    displayNombre.innerText = nombreActual;
    pantallaInicio.classList.add('oculto');
    pantallaJuego.classList.remove('oculto');
    
    audioZumbido.play();
    iniciarMovimiento();
});

function moverMosquito() {
    const maxX = window.innerWidth - mosquito.clientWidth;
    const maxY = window.innerHeight - mosquito.clientHeight;

    const randomX = Math.floor(Math.random() * (maxX > 0 ? maxX : 0));
    const randomY = Math.floor(Math.random() * (maxY > 0 ? maxY : 0));

    mosquito.style.left = `${randomX}px`;
    mosquito.style.top = `${randomY}px`;
}

function iniciarMovimiento() {
    clearInterval(intervaloMovimiento);
    intervaloMovimiento = setInterval(moverMosquito, velocidad);
}

// NUEVA LÓGICA DE CLIC
mosquito.addEventListener('click', (e) => {
    // Evita que el clic se propague si hubiera otros elementos
    e.stopPropagation();

    puntos++;
    puntuacionTxt.innerText = puntos;

    // 1. Guardar en LocalStorage
    localStorage.setItem('mosquito_user', nombreActual);
    localStorage.setItem('mosquito_score', puntos);

    // 2. DETENER SONIDO Y MOVIMIENTO
    audioZumbido.pause();
    audioZumbido.currentTime = 0; // Reinicia el audio para que el efecto sea claro
    clearInterval(intervaloMovimiento); 

    // 3. Aumentar dificultad
    if (velocidad > 200) {
        velocidad -= 100;
    }

    // 4. PEQUEÑA PAUSA DE SILENCIO (300ms) antes de retomar
    setTimeout(() => {
        moverMosquito();      // Lo mueve a nueva posición
        audioZumbido.play();  // Reinicia el zumbido
        iniciarMovimiento();  // Reinicia el ciclo de movimiento automático
    }, 300); 
});