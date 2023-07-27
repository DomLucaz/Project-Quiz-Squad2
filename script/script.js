// ======== Import      =============================
import { questoesHtml } from "./temaHtml.js";
import { questoesCSS } from "./temaCSS.js";
import { questoesJS } from "./temaJS.js";

//========= Declarações =============================

// Constantes e Variáveis
const home = [false, true, true];
const quiz = [true, false, true];
const resultado = [true, true, false];

const btnIniciar = document.getElementById("btnIniciar");
const btnReiniciarQuiz = document.getElementById("reiniciar");

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
                <input type="radio" name="${questao.identificador}">${questao.alternativaA}<br>
                <input type="radio" name="${questao.identificador}">${questao.alternativaB}<br>
                <input type="radio" name="${questao.identificador}">${questao.alternativaC}<br>
                <input type="radio" name="${questao.identificador}">${questao.alternativaD}<br>
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
    const x = document.getElementById("quizTema");
    x.innerHTML = informacoesUser[0].tema;
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

//========= Main =============================

mostrarTela(home)

