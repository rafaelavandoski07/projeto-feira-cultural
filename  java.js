
const texto = document.getElementById("texto");
const seletorVoz = document.getElementById("voz");
const velocidade = document.getElementById("velocidade");
const valorVelocidade = document.getElementById("valorVelocidade");
const status = document.getElementById("status");

let vozes = [];

function carregarVozes() {
    vozes = speechSynthesis.getVoices();

    seletorVoz.innerHTML = "";

    // Prioriza vozes em português do Brasil
    const vozesPortugues = vozes.filter(voz =>
        voz.lang.toLowerCase() === "pt-br"
    );

    if (vozesPortugues.length === 0) {
        const opcao = document.createElement("option");
        opcao.textContent = "Voz brasileira não encontrada";
        opcao.value = "";
        seletorVoz.appendChild(opcao);

        status.textContent =
            "Instale uma voz em português do Brasil no dispositivo.";
        return;
    }

    vozesPortugues.forEach((voz, index) => {
        const opcao = document.createElement("option");

        opcao.value = index;
        opcao.textContent = voz.name;

        seletorVoz.appendChild(opcao);
    });

    status.textContent = "Pronto para ler em português!";
}

speechSynthesis.onvoiceschanged = carregarVozes;
carregarVozes();

velocidade.addEventListener("input", function() {
    valorVelocidade.textContent = velocidade.value + "x";
});

function ouvirTexto() {
    const conteudo = texto.value.trim();

    if (conteudo === "") {
        status.textContent = "Digite um texto primeiro!";
        texto.focus();
        return;
    }

    speechSynthesis.cancel();

    const fala = new SpeechSynthesisUtterance(conteudo);

    fala.lang = "pt-BR";
    fala.rate = Number(velocidade.value);
    fala.pitch = 1;
    fala.volume = 1;

    const vozesPortugues = vozes.filter(voz =>
        voz.lang.toLowerCase() === "pt-br"
    );

    const vozSelecionada =
        vozesPortugues[Number(seletorVoz.value)];

    if (vozSelecionada) {
        fala.voice = vozSelecionada;
    }

    fala.onstart = function() {
        status.textContent = "🔊 Lendo em português...";
    };

    fala.onend = function() {
        status.textContent = "Leitura concluída!";
    };

    fala.onerror = function() {
        status.textContent = "Erro ao reproduzir a voz.";
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
