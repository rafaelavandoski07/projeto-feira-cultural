
const texto = document.getElementById("texto");
const seletorVoz = document.getElementById("voz");
const velocidade = document.getElementById("velocidade");
const valorVelocidade = document.getElementById("valorVelocidade");
const status = document.getElementById("status");

let vozes = [];

function carregarVozes() {
    vozes = speechSynthesis.getVoices();

    seletorVoz.innerHTML = "";

    const vozesPortugues = vozes.filter(voz =>
        voz.lang.toLowerCase().startsWith("pt")
    );

    if (vozesPortugues.length === 0) {
        seletorVoz.innerHTML =
            '<option value="">Nenhuma voz em português encontrada</option>';
        return;
    }

    vozesPortugues.forEach((voz, index) => {
        const opcao = document.createElement("option");

        opcao.value = index;
        opcao.textContent = voz.name + " (" + voz.lang + ")";

        seletorVoz.appendChild(opcao);
    });
}

speechSynthesis.onvoiceschanged = carregarVozes;
carregarVozes();

velocidade.addEventListener("input", function() {
    valorVelocidade.textContent = velocidade.value + "x";
});

function ouvirTexto() {
    const conteudo = texto.value.trim();

    if (conteudo === "") {
        status.textContent = "Por favor, digite um texto primeiro!";
        texto.focus();
        return;
    }

    speechSynthesis.cancel();

    const fala = new SpeechSynthesisUtterance(conteudo);

    fala.lang = "pt-BR";
    fala.rate = Number(velocidade.value);
    fala.pitch = 1;
    fala.volume = 1;

    const vozSelecionada = vozes.filter(voz =>
        voz.lang.toLowerCase().startsWith("pt")
    )[Number(seletorVoz.value)];

    if (vozSelecionada) {
        fala.voice = vozSelecionada;
    }

    fala.onstart = function() {
        status.textContent = "🔊 Lendo seu texto...";
    };

    fala.onend = function() {
        status.textContent = "Leitura concluída!";
    };

    fala.onerror = function() {
        status.textContent = "Não foi possível reproduzir o áudio.";
    };

    speechSynthesis.speak(fala);
}

function pausarTexto() {
    if (speechSynthesis.speaking) {
        speechSynthesis.pause();
        status.textContent = "Leitura pausada.";
    }
}

function continuarTexto() {
    if (speechSynthesis.paused) {
        speechSynthesis.resume();
        status.textContent = "Continuando a leitura...";
    }
}

function pararTexto() {
    speechSynthesis.cancel();
    status.textContent = "Leitura interrompida.";
}
