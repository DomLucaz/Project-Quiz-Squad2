// ======== Import      =============================
import { questoesHtml } from "./temaHtml.js";
import { questoesCSS } from "./temaCSS.js";
import { questoesJS } from "./temaJS.js";
import { pararCronometro } from "./cronometro.js";

//========= Declarações =============================

// Constantes e Variáveis
const home = [false, true, true];
const quiz = [true, false, true];
const resultado = [true, true, false];

// Coletando os botões
const btnIniciar = document.getElementById("btnIniciar");
const btnReiniciarQuiz = document.getElementById("reiniciar");
const btnConcluirQuiz = document.getElementById("timeStop");

const informacoesUser = [];

// Dark mode 
const chk = document.getElementById("chk");

chk.addEventListener("change", () => {
document.body.classList.toggle("dark") // Toggle -> mostra ou oculta um elemento de menu em um site
});

// Hidden
function mostrarTela(arr) {
    const idHome = document.getElementById("home");
    const idQuiz = document.getElementById("quiz");
    const idResult= document.getElementById("result");
    
    idHome.hidden = arr[0];
    idQuiz.hidden = arr[1];
    idResult.hidden = arr[2];
}

// Coletar dados form home
function coletarForm() {
    const nome = document.getElementById("nome").value; 
    const tema = document.getElementById("tema").value;
    const data = new Date().toLocaleDateString();
    const hora = new Date().toLocaleTimeString();

    const dadosForm = {
        nome: nome,
        tema: tema,
        data: data,
        hora: hora,
        pontuacao: null,
    };

    informacoesUser.push(dadosForm);
}

// Pegar Tema
function pegarTema() {
    let valorTema = informacoesUser[0].tema;
    let nomeQuestõesTema = "none";

    if (valorTema == "HTML") {
        nomeQuestõesTema = questoesHtml;

    } else if (valorTema == "CSS") {
        nomeQuestõesTema = questoesCSS;

    } else if (valorTema == "JavaScript") {
        nomeQuestõesTema = questoesJS;
    }

    return nomeQuestõesTema;
}

// Criar questões
function criarQuestoes() {
    const areasQuestoes = document.getElementById("questoes");
    let questoes = pegarTema();
    
    for(let questao of questoes) {
        areasQuestoes.innerHTML += `
            <fieldset>
                <legend>${questao.pergunta}</legend>
                <input type="radio" name="${questao.identificador}" value="alternativaA"><label for="alternativaA">${questao.alternativaA}</label><br>
                <input type="radio" name="${questao.identificador}" value="alternativaB"><label for="alternativaB">${questao.alternativaB}</label><br>
                <input type="radio" name="${questao.identificador}" value="alternativaC"><label for="alternativaC">${questao.alternativaC}</label><br>
                <input type="radio" name="${questao.identificador}" value="alternativaD"><label for="alternativaD">${questao.alternativaD}</label><br>
            </fieldset>
        `;
    }
}

// Destruir questões
function destruirQuestoes() {
    const areasQuestoes = document.getElementById("questoes");
    
    areasQuestoes.innerHTML = '';
}

// Retirar apagar informações do usuário pq ele reiniciou
function deletarInformacao () {
    informacoesUser.pop();
}

// Mudar título do QUIZ
function mudarTitulo () {
    const tituloQuiz = document.getElementById("quizTema");
    tituloQuiz.innerHTML = informacoesUser[0].tema;
}

// Botão Iniciar
btnIniciar.addEventListener("click", () => {
    mostrarTela(quiz);
    coletarForm();
    criarQuestoes();
    mudarTitulo();
});

// Botão Reiniciar QUIZ
btnReiniciarQuiz.addEventListener("click", ()=> {
    mostrarTela(home);
    deletarInformacao();
    destruirQuestoes();
    
});

//Validação das questões
function validarRespostas() {
    let questoes = pegarTema(); // var que armazena o retorno de pegarTema que é o vetor de objetos do tema que o usuario selecionou na home
    let pontuacao = 0; // var para pontuacao, inicia zerada
    
    for(let questao of questoes) { //iteração em cada objeto do vetor "objetos"
        let selecionada = document.querySelector(`input[name="${questao.identificador}"]:checked`); // (querySelector pega todas as alternativas com mesmo name, ou seja, da mesma questão, porém só a que estiver checked (selecionada pelo usuário))
        if (!selecionada) { // caso a questao estiver sem resposta, "selecionada" tem valor "null"
            alert("Por favor, responda todas as questões antes de continuar.");
            return; // este return indica que a função não executa as linhas abaixo
        }
        let resposta = selecionada.value; // var que armazena o valor do input (alternativaA, alternativaB...)
        if(resposta === questao.correta) { // se a resposta for igual a questao correta ("correta" é uma proprieda do objeto de cada questão em cada tema),
            pontuacao += 1; //a postuação é soma com mais 1
        }
    }
    pararCronometro();
    return pontuacao; // função retorna um inteiro, que é a quantidade de questões corretas que o usuário acertou
}
//lembrar de utilizar o retorno da função validarRespostas para desenvolver o resultado
// Botão concluir QUIZ
btnConcluirQuiz.addEventListener("click", ()=> {
    validarRespostas();
    console.log(validarRespostas());
});

//========= Main =============================

mostrarTela(home)

//========= Trilha Sonora =====================

// achando os elementos no HTML

const audio = document.getElementById("audio");
const btnAudio = document.getElementById("btn-audio");
let audioSvg;
let stopped = true;

// função para dar play no som
function playAudio() {
    audio.play();
    //atribui o ícone de "tocando" quando a função for chamada
    audioSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-volume-up-fill" viewBox="0 0 16 16">
    <path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z"/>
    <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z"/>
    <path d="M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z"/>
    </svg>`;
}

//função para pausar o som
function pauseAudio() {
    audio.pause();
    //atribui o ícone de "sem som" quando a função for chamada
    audioSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-volume-mute-fill" viewBox="0 0 16 16">
    <path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zm7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z"/>
    </svg>`;
}
// stopped inicia como verdade então o primeiro clique vai entrar no if, dentro do if o valor de stopped vai mudar e no segundo clique ele vai entrar no else, e assim sucessivamente.
btnAudio.onclick = () => {
    if(stopped) {
        console.log("teste if", stopped)
        playAudio();
        stopped = false;
    }
    else {
        console.log("teste else", stopped)
        pauseAudio();
        stopped = true;
    }
    // troca o ícone toda vez que clicamos no botão seguindo as funções play/pause
    btnAudio.innerHTML = audioSvg;  
}
