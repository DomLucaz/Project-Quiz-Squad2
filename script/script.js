import { questoesHtml                              } from "./questoes/temaHtml.js";
import { questoesCSS                               } from "./questoes/temaCSS.js";
import { questoesJS                                } from "./questoes/temaJS.js";
import { pararCronometro, iniciarCronometro        } from "./acessorios/cronometro.js";
import { pauseAudio, playAudio, btnAudio, audioSvg } from "./acessorios/trilhaSonora.js";
import { quizResults                               } from "./populate.JS";


const home      = [false, true, true];
const quiz      = [true, false, true];
const resultado = [true, true, false];

const btnIniciar         = document.getElementById("btnIniciar"); 
const btnReiniciarQuiz   = document.getElementById("reiniciar");
const btnConcluirQuiz    = document.getElementById("concluir");
const btnContinuarQuiz   = document.getElementById("continuar");
const btnReiniciarResult = document.getElementById("inicio");
const btnDarkMode = document.getElementById("chk");

const idHome     = document.getElementById("home"); 
const idQuiz     = document.getElementById("quiz");
const idResult   = document.getElementById("result");
const idNomeForm = document.getElementById("nome");
const idTemaForm = document.getElementById("tema");

const areasQuestoes = document.getElementById("questoes");

const darkModeTheme = JSON.parse(localStorage.getItem("darkMode"));

let informacoesUser = [];



// ========================

function mostrarTela(arrTela) {
    idHome.hidden   = arrTela[0];
    idQuiz.hidden   = arrTela[1];
    idResult.hidden = arrTela[2];
}

function hiddenButtons(boolean) {
    if(!(idQuiz.hidden)) {
        btnConcluirQuiz.hidden  = boolean;
        btnReiniciarQuiz.hidden = boolean;
    }
}

function ocultarBtnContinue(boolean) {
    btnContinuarQuiz.hidden = boolean;
}

function coletarForm() {
    const idCronometro = document.getElementById("cronometro");

    let nome  = idNomeForm.value;
    let tema  = idTemaForm.value;
    let tempo = idCronometro.innerText;
    let data  = new Date().toLocaleDateString();
    let hora  = new Date().toLocaleTimeString();

    let dadosForm = {
        nome: nome,
        tema: tema,
        data: data,
        hora: hora,
        pontuacao: null,
        tempo: tempo,
    };

    informacoesUser.push(dadosForm);
}

function pegarTema() {
    let numElementoUser  = informacoesUser.length-1; 
    let valorTema        = informacoesUser[numElementoUser].tema;
    let nomeQuestõesTema = "none";

    switch (valorTema) {
        case "HTML":
            nomeQuestõesTema = questoesHtml;
            break;
        
        case "CSS":
            nomeQuestõesTema = questoesCSS;
            break;
        
        case "JavaScript":
            nomeQuestõesTema = questoesJS;
            break;
        
        default:
            break;
    }

    return nomeQuestõesTema;
}

function criarQuestoes() {
    const questoes = pegarTema();
    
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

function destruirQuestoes() {
    areasQuestoes.innerHTML = '';
}

function deletarInformacao () {
    informacoesUser.pop();
}

function mudarTitulo () {
    const tituloQuiz = document.getElementById("quizTema");
    let ultimoElemento = informacoesUser.length-1;

    tituloQuiz.innerHTML = informacoesUser[ultimoElemento].tema;
}

function validarHome() {
    let numUser = informacoesUser.length-1;
    let tema    = informacoesUser[numUser].tema;
    let nome    = informacoesUser[numUser].nome;

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

function validarRespostas() {
    let questoes = pegarTema();
    let pontuacao = 0; 

    for(let questao of questoes) {
        let selecionada = document.querySelector(`input[name="${questao.identificador}"]:checked`); 
        if (!selecionada) { 
            alert("Por favor, responda todas as questões antes de continuar.");
            return; 
        }
    }

    let i = 0;
    for(let questao of questoes) { 
        let selecionada = document.querySelector(`input[name="${questao.identificador}"]:checked`); 
        let resposta = selecionada.value; 

        if(resposta === questao.correta) {
            pontuacao += 1; 
            document.getElementById(`f${i+1}`).style.background = 'rgba(0, 255, 42, 0.2)';
        }
        else {
            document.getElementById(`f${i+1}`).style.background = 'rgba(255, 0, 0, 0.2)';
        }
        i++;
    }
    pararCronometro();
    hiddenButtons(true);
    ocultarBtnContinue(false);

    informacoesUser[informacoesUser.length-1].pontuacao = pontuacao; 
    return pontuacao; 
}

function esvaziarCamposHome() {
    const campoNome = document.getElementById("nome");
    const campoTema = document.getElementById("tema");

    campoNome.value = '';
    campoTema[0].selected = true;
}

function insertTableResults() {
    const tabelaResultado = document.querySelector(".tabelaResultado tbody");
    const dadosUsuario    = informacoesUser[informacoesUser.length-1];
    const newRow          = tabelaResultado.insertRow(0);

    newRow.innerHTML = `
        <td>${dadosUsuario.nome}</td>
        <td>${dadosUsuario.tema}</td>
        <td>${pararCronometro()}</td>
        <td>${dadosUsuario.data} ${dadosUsuario.hora}</td>
        <td>${dadosUsuario.pontuacao}/10</td>
    `;
}

function popularTabela() {
    const tabelaResultado = document.querySelector(".tabelaResultado tbody");
    
    for (let index = 0; index < quizResults.length; index++) {
        const dadosUsuario = quizResults[index];
        const newRow = tabelaResultado.insertRow();
    
        newRow.innerHTML = `
            <td>${dadosUsuario.nome}</td>
            <td>${dadosUsuario.tema}</td>
            <td>${dadosUsuario.tempo}</td>
            <td>${dadosUsuario.dataQuiz}</td>
            <td>${dadosUsuario.pontuacao}/10</td>
        `;
    }
}

function limitarTabelaResultato() {
    const arrLinhas = document.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
    
    if (arrLinhas.length > 5) {
        for (let index = arrLinhas.length; index != 5; index--) {
            arrLinhas[arrLinhas.length-1].remove();
        }   
    }
}

function insightsAcertos() {
    let pontuacoesHTML = 0, contHTML = 0;
    let pontuacoesCSS  = 0, contCSS  = 0;
    let pontuacoesJS   = 0, contJS   = 0;

    let tagMediaHTML = document.getElementById("media-acertos-html");
    let tagMediaCSS  = document.getElementById("media-acertos-css");
    let tagMediaJS   = document.getElementById("media-acertos-js");

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
        let ltdaHTML = mediaHTML.toFixed(2);
        percentHTML = Math.round(Number(ltdaHTML) * 100);
        tagMediaHTML.innerHTML = `${percentHTML}%`;
    }
    else {
        tagMediaHTML.innerHTML = ``;
    }

    //tag média CSS
    if(pontuacoesCSS > 0) {
        let mediaCSS = pontuacoesCSS / contCSS;
        mediaCSS /= 10;
        let ltdaCSS = mediaCSS.toFixed(2);
        percentCSS = Math.round(Number(ltdaCSS) * 100);
        tagMediaCSS.innerHTML = `${percentCSS}%`;
    }
    else {
        tagMediaCSS.innerHTML = ``;
    }    

    //tag média JS
    if(pontuacoesJS > 0) {
        let mediaJS = pontuacoesJS / contJS;
        mediaJS /= 10;
        let ltdaJS = mediaJS.toFixed(2);
        percentJS = Math.round(Number(ltdaJS) * 100);
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
    let acertos      = insightsAcertos();
    let tagErrosHTML = document.getElementById("media-erros-html");
    let tagErrosCSS  = document.getElementById("media-erros-css");
    let tagErrosJS   = document.getElementById("media-erros-js");

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

function ranking() {
    let listaHTML = document.getElementById("tema-html");
    let listaCSS = document.getElementById("tema-css");
    let listaJS = document.getElementById("tema-js");

    let pontuacaoHTML = {};
    let pontuacaoCSS = {};
    let pontuacaoJS = {};

    for(let i = 0; i < informacoesUser.length; i++) {
        if(informacoesUser[i].tema == 'HTML') {
            pontuacaoHTML[informacoesUser[i].nome] = informacoesUser[i].pontuacao;
        } else if(informacoesUser[i].tema == 'CSS') {
            pontuacaoCSS[informacoesUser[i].nome] = informacoesUser[i].pontuacao;
        } else {
            pontuacaoJS[informacoesUser[i].nome] = informacoesUser[i].pontuacao;
        }
    }

    function gerarListasHTML(arrayPontos) {
        let top5 = arrayPontos.slice(0, 5);
        let html = '';
        for(let [nome, pontos] of top5) {
            html += `<li>${nome} - ${pontos}/10</li>\n`;
        }
        return html;
    }

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

    listaHTML.innerHTML = gerarListasHTML(arrayPontuacaoHTML);
    listaCSS.innerHTML = gerarListasHTML(arrayPontuacaoCSS);
    listaJS.innerHTML = gerarListasHTML(arrayPontuacaoJS);
}

function populateRanking(rankPopulate) {
    for (let index = 0; index < rankPopulate.length; index++) {
        informacoesUser.push(rankPopulate[index]);
    }
}

btnIniciar.addEventListener("click", () => {
    coletarForm();
    validarHome();
    hiddenButtons(false);
});

btnReiniciarQuiz.addEventListener("click", ()=> {
    mostrarTela(home);
    deletarInformacao();
    destruirQuestoes();
    pararCronometro();
});

btnConcluirQuiz.addEventListener("click", ()=> {
    validarRespostas();
});

btnContinuarQuiz.addEventListener("click", () => {
    mostrarTela(resultado);
    insertTableResults();
    ocultarBtnContinue(true);
    insightsAcertos();
    insightsErros();
    ranking();
    limitarTabelaResultato();
});

btnReiniciarResult.addEventListener ("click", () => {
    mostrarTela(home);
    destruirQuestoes();
    esvaziarCamposHome();
});

let stopped = true;

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

btnDarkMode.addEventListener("change", () => {
    document.body.classList.toggle("dark");
    const darkModeTheme = document.body.classList.contains("dark");
    localStorage.setItem("darkMode", JSON.stringify(darkModeTheme));
});

mostrarTela(home);
popularTabela();
populateRanking(quizResults);


if (darkModeTheme) {
    document.body.classList.add("dark");
    btnDarkMode.cheked = true;
}