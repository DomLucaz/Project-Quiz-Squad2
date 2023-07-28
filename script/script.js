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

//Coletando os botões
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
                <input type="radio" name="${questao.identificador}" value="alternativaA">${questao.alternativaA}<br>
                <input type="radio" name="${questao.identificador}" value="alternativaB">${questao.alternativaB}<br>
                <input type="radio" name="${questao.identificador}" value="alternativaC">${questao.alternativaC}<br>
                <input type="radio" name="${questao.identificador}" value="alternativaD">${questao.alternativaD}<br>
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

