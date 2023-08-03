// ======== Import      =============================
import { questoesHtml } from "./temaHtml.js";
import { questoesCSS } from "./temaCSS.js";
import { questoesJS } from "./temaJS.js";
import {pararCronometro, iniciarCronometro} from "./cronometro.js";
import { pauseAudio, playAudio, btnAudio, audioSvg } from "./trilhaSonora.js";

//========= Declarações =============================

// Constantes e Variáveis
const home = [false, true, true];
const quiz = [true, false, true];
const resultado = [true, true, false];

// Coletando os botões
const btnIniciar = document.getElementById("btnIniciar"); //id chamado de btn é redundante
const btnReiniciarQuiz = document.getElementById("reiniciar");
const btnConcluirQuiz = document.getElementById("concluir");
const btnContinuarQuiz = document.getElementById("continuar");
const btnReiniciarResult = document.getElementById("inicio");

const idHome = document.getElementById("home"); //nome da constante com "id" é reduntane
const idQuiz = document.getElementById("quiz");
const idResult= document.getElementById("result");
const idNomeForm = document.getElementById("nome");
const idTemaForm = document.getElementById("tema");

//vetor para os dados dos usuários
const informacoesUser = [];

const areasQuestoes = document.getElementById("questoes");

// Dark mode 
const chk = document.getElementById("chk");

chk.addEventListener("change", () => {
document.body.classList.toggle("dark") // Toggle -> mostra ou oculta um elemento de menu em um site
});

// Hidden
function mostrarTela(arr) {
    idHome.hidden = arr[0];
    idQuiz.hidden = arr[1];
    idResult.hidden = arr[2];
}

function hiddenButtons(boolean) {
    if(!(idQuiz.hidden)) {
        btnConcluirQuiz.hidden = boolean;
        btnReiniciarQuiz.hidden = boolean;
    }
}

function ocultarBtnContinue(boolean) {
    btnContinuarQuiz.hidden = boolean;
}

// Coletar dados form home
function coletarForm() {
    const nome = idNomeForm.value;
    const tema = idTemaForm.value;
    const data = new Date().toLocaleDateString();
    const hora = new Date().toLocaleTimeString();

    const idCronometro = document.getElementById("cronometro");

    const dadosForm = {
        nome: nome,
        tema: tema,
        data: data,
        hora: hora,
        pontuacao: null,
        tempo: idCronometro.innerText,
    };

    informacoesUser.push(dadosForm);
}


// Pegar Tema
function pegarTema() {
    let numElementoUser = informacoesUser.length-1; // Não dá para tirar esta linha
    let valorTema = informacoesUser[numElementoUser].tema;
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
    let questoes = pegarTema();
    
    let i = 1;
    for(let questao of questoes) {
        areasQuestoes.innerHTML += `
            <fieldset id="f${i}" class="campoQuiz">
                <legend class="identificador">${questao.identificador}</legend>
                <legend>${questao.pergunta}</legends><br>
                <input type="radio" name="${questao.identificador}" value="alternativaA"><label for="alternativaA">${questao.alternativaA}</label><br>
                <input type="radio" name="${questao.identificador}" value="alternativaB"><label for="alternativaB">${questao.alternativaB}</label><br>
                <input type="radio" name="${questao.identificador}" value="alternativaC"><label for="alternativaC">${questao.alternativaC}</label><br>
                <input type="radio" name="${questao.identificador}" value="alternativaD"><label for="alternativaD">${questao.alternativaD}</label><br>
            </fieldset>
        `;
        i++;
    }
}

// Destruir questões
function destruirQuestoes() {
    areasQuestoes.innerHTML = '';
}

// Retirar apagar informações do usuário pq ele reiniciou
function deletarInformacao () {
    informacoesUser.pop();
}

// Mudar título do QUIZ
function mudarTitulo () {
    const tituloQuiz = document.getElementById("quizTema");
    tituloQuiz.innerHTML = informacoesUser[informacoesUser.length-1].tema;
}

// Botão Iniciar
btnIniciar.addEventListener("click", () => {
    // CUIDADO A ORDEM PODE QUEBRAR O CÓDIGO
    coletarForm();
    validarHome();
    hiddenButtons(false);

});

// Botão Reiniciar QUIZ
btnReiniciarQuiz.addEventListener("click", ()=> {
    mostrarTela(home);
    deletarInformacao();
    destruirQuestoes();
    pararCronometro();
});

// validarHome tem função de required.
function validarHome() {
    let numUser = informacoesUser.length-1;
    let tema = informacoesUser[numUser].tema;
    let nome = informacoesUser[numUser].nome;

    if ( tema == "-- Selecione um Tema --" || nome == '') {
        alert('Selecione um tema ou Coloque o nome');
        deletarInformacao();
    } else {
        criarQuestoes();
        mostrarTela(quiz);
        iniciarCronometro();
        mudarTitulo();
    }
}

//Validação das questões
//Validação das questões
function validarRespostas() {
    const questoes = pegarTema();
    let pontuacao = 0;

    // Verifique se todas as perguntas foram respondidas
    for (let i = 0; i < questoes.length; i++) {
        const questao = questoes[i];
        const selecionada = document.querySelector(`input[name="${questao.identificador}"]:checked`);

        if (!selecionada) {
            alert("Por favor, responda todas as questões antes de continuar.");
            return;
        }

        const resposta = selecionada.value;

        if (resposta === questao.correta) {
            pontuacao += 1;
            document.getElementById(`f${i + 1}`).style.background = 'rgba(0, 255, 42, 0.2)';
        } else {
            document.getElementById(`f${i + 1}`).style.background = 'rgba(255, 0, 0, 0.2)';
        }
    }

    pararCronometro();
    hiddenButtons(true);
    ocultarBtnContinue(false);

    informacoesUser[informacoesUser.length - 1].pontuacao = pontuacao;
    return pontuacao;
}
//lembrar de utilizar o retorno da função validarRespostas para desenvolver o resultado

// Zerar form home
const campoNome = document.getElementById("nome");
const campoTema = document.getElementById("tema");

function esvaziarCamposHome() {
    campoNome.value = '';
    campoTema[0].selected = true;
}


// Botão concluir QUIZ
btnConcluirQuiz.addEventListener("click", ()=> {
    validarRespostas();
});

// Botão continuar QUIZ
btnContinuarQuiz.addEventListener("click", () => {
    mostrarTela(resultado);
    insertTableResults();
    ocultarBtnContinue(true);
    insightsAcertos();
    insightsErros();
    ranking();
});

//Botão para voltar a página inicial 
btnReiniciarResult.addEventListener ("click", () => {
    mostrarTela(home);
    destruirQuestoes();
    esvaziarCamposHome();
});

function insertTableResults() {
    const tabelaResultado = document.querySelector(".tabelaResultado tbody");
    const dadosUsuario = informacoesUser[informacoesUser.length-1];
    const newRow = tabelaResultado.insertRow();

    newRow.innerHTML = `
        <td>${dadosUsuario.nome}</td>
        <td>${dadosUsuario.tema}</td>
        <td>${pararCronometro()}</td>
        <td>${dadosUsuario.data} ${dadosUsuario.hora}</td>
        <td>${dadosUsuario.pontuacao}/10</td>
    `;
}

//Função para mostrar os insights (média por acertos)
function insightsAcertos() {
    let pontuacoesHTML = 0, contHTML = 0;
    let pontuacoesCSS = 0, contCSS = 0;
    let pontuacoesJS = 0, contJS = 0;

    let tagMediaHTML = document.getElementById("media-acertos-html");
    let tagMediaCSS = document.getElementById("media-acertos-css");
    let tagMediaJS = document.getElementById("media-acertos-js");

    for(let i = 0; i < informacoesUser.length; i++) {
        if(informacoesUser[i].tema == "HTML") {
            pontuacoesHTML += informacoesUser[i].pontuacao;
            contHTML++;
        }
        else if(informacoesUser[i].tema == "CSS") {
            pontuacoesCSS += informacoesUser[i].pontuacao;
            contCSS++;
        }
        else if(informacoesUser[i].tema == "JavaScript") {
            pontuacoesJS += informacoesUser[i].pontuacao;
            contJS++;
        }
    }

    let percentHTML = 0;
    let percentCSS = 0;
    let percentJS = 0;

    //tag média HTML
    if(pontuacoesHTML > 0) {
        let mediaHTML = pontuacoesHTML / contHTML;
        mediaHTML /= 10;
        let ltdaHTML = mediaHTML.toFixed(4);
        percentHTML = Number(ltdaHTML) * 100;
        tagMediaHTML.innerHTML = `${percentHTML}%`;
    }
    else {
        tagMediaHTML.innerHTML = ``;
    }

    //tag média CSS
    if(pontuacoesCSS > 0) {
        let mediaCSS = pontuacoesCSS / contCSS;
        mediaCSS /= 10;
        let ltdaCSS = mediaCSS.toFixed(4);
        percentCSS = Number(ltdaCSS) * 100;
        tagMediaCSS.innerHTML = `${percentCSS}%`;
    }
    else {
        tagMediaCSS.innerHTML = ``;
    }    

    //tag média JS
    if(pontuacoesJS > 0) {
        let mediaJS = pontuacoesJS / contJS;
        mediaJS /= 10;
        let ltdaJS = mediaJS.toFixed(4);
        percentJS = Number(ltdaJS) * 100;
        tagMediaJS.innerHTML = `${percentJS}%`;
    }
    else {
        tagMediaJS.innerHTML = ``;
    } 
    
    return {
        html: percentHTML,
        css: percentCSS,
        js: percentJS
    }
}

function insightsErros() {
    let acertos = insightsAcertos();
    let tagErrosHTML = document.getElementById("media-erros-html");
    let tagErrosCSS = document.getElementById("media-erros-css");
    let tagErrosJS = document.getElementById("media-erros-js");

    if(acertos.html > 0) {
        let mediaErrosHTML = 100 - acertos.html;
        tagErrosHTML.innerHTML = `${mediaErrosHTML}%`;
    }
    else {
        tagErrosHTML.innerHTML = ``;
    }
    
    if(acertos.css > 0) {
        let mediaErrosCSS = 100 - acertos.css;
        tagErrosCSS.innerHTML = `${mediaErrosCSS}%`;
    }    
    else {
        tagErrosCSS.innerHTML = ``;
    }

    if(acertos.js > 0) {
        let mediaErrosJS = 100 - acertos.js;
        tagErrosJS.innerHTML = `${mediaErrosJS}%`;
    }
    else {
        tagErrosJS.innerHTML = ``;
    }    
}

//Função para o Ranking (por tema)
function ranking() {
    let listaHTML = document.getElementById("tema-html");
    let listaCSS = document.getElementById("tema-css");
    let listaJS = document.getElementById("tema-js");

    // Inicializa objetos para armazenar a pontuação mais recente para cada usuário
    let pontuacaoHTML = {};
    let pontuacaoCSS = {};
    let pontuacaoJS = {};

    for(let i = 0; i < informacoesUser.length; i++) {// aqui dá para usar swittich??
        if(informacoesUser[i].tema == 'HTML') {
            pontuacaoHTML[informacoesUser[i].nome] = informacoesUser[i].pontuacao;
        } else if(informacoesUser[i].tema == 'CSS') {
            pontuacaoCSS[informacoesUser[i].nome] = informacoesUser[i].pontuacao;
        } else {
            pontuacaoJS[informacoesUser[i].nome] = informacoesUser[i].pontuacao;
        }
    }

    // Função para gerar o HTML da lista a partir de um objeto de pontuações
    function gerarListasHTML(arrayPontos) {
        let top5 = arrayPontos.slice(0, 5);
        let html = '';
        for(let [nome, pontos] of top5) {
            html += `<li>${nome} - ${pontos}/10</li>\n`;
        }
        return html;
    }

    //transformando os objetos em vetores
    let arrayPontuacaoHTML = Object.entries(pontuacaoHTML);
    let arrayPontuacaoCSS = Object.entries(pontuacaoCSS);
    let arrayPontuacaoJS = Object.entries(pontuacaoJS);

    //elaborando a ordenação
    function sortfunction(a, b){
        return b[1] - a[1]; //faz com que o array seja ordenado numericamente e de ordem decrescente.
    }
    arrayPontuacaoHTML.sort(sortfunction); 
    arrayPontuacaoCSS.sort(sortfunction); 
    arrayPontuacaoJS.sort(sortfunction); 

    // Atualiza o HTML das listas
    listaHTML.innerHTML = gerarListasHTML(arrayPontuacaoHTML);
    listaCSS.innerHTML = gerarListasHTML(arrayPontuacaoCSS);
    listaJS.innerHTML = gerarListasHTML(arrayPontuacaoJS);
}

//========= Main =============================

mostrarTela(home);

//========= Trilha Sonora =====================
let stopped = true;

// stopped inicia como verdade então o primeiro clique vai entrar no if, dentro do if o valor de stopped vai mudar e no segundo clique ele vai entrar no else, e assim sucessivamente.
btnAudio.onclick = () => {
    if(stopped) {
        playAudio();
        stopped = false;
    }
    else {
        pauseAudio();
        stopped = true;
    }
    // troca o ícone toda vez que clicamos no botão seguindo as funções comVolume/semVolume
    btnAudio.innerHTML = audioSvg;  
}

