let cronometro = 0; //valor inicial do cronômetro em segundos
let idCronometro; // id do cronômetro para parar o setInterval

//Atualizar cronômetro
function atualizaCronometro() {
    cronometro++; //vai atulaizar 1seg ao cronômetro
    let minutos = Math.floor(cronometro / 60);
    let horas = "00";

    // Se minutos for maior que 60 vamos ter que adicionar a hora
    if(minutos > 60) {
        horas = Math.floor(minutos / 60);
        minutos = minutos % 60;

        if(horas < 10) { // adiciona o zero na frente de o numero for menor que 10
            horas = "0" + horas;
        }
        if(minutos < 10) { // adiciona o zero na frente de o numero for menor que 10
            minutos = "0" + minutos
        }
    }
    else if(minutos < 10) {
        minutos = "0" + minutos;
    }
    // Divide o cronômetro por 60 para pegar os segundos e pega o resto da divisão
    let segundos = cronometro % 60;

    // Se os segundos forem menores que 10, adiciona um 0 na frente
    if (segundos < 10) {
    segundos = "0" + segundos;
    }

    // Formata o cronômetro para o formato HH:MM:SS
    const cronometroFormatado = horas + ":" + minutos + ":" + segundos;

    // Pegando o elemento do cronômetro pelo ID
    const cronometroHTML = document.getElementById("cronometro");

    // Atualizando o cronômetro no HTML
    cronometroHTML.innerHTML = cronometroFormatado;
    }

    // Função para iniciar o cronômetro
    function iniciarCronometro() {
    console.log("Iniciando o cronômetro...");

    // Reseta o cronômetro
    cronometro = 0;

    // A cada 1 segundo chamamos a função atualizaCronometro
    idCronometro = setInterval(atualizaCronometro, 1000); // 1000 milisegundos = 1 segundo
    }

    // Função para parar o cronômetro
    function pararCronometro() {
    console.log("Parando o cronômetro...");

    // Parando o cronômetro
    clearInterval(idCronometro);

    // Retornando o valor do cronômetro
    return cronometro;
    }

    const timeStart = document.querySelectorAll(".timeStart");
    const timeStop = document.getElementById("timeStop");

    for (let start of timeStart) {
        start.addEventListener("click", (evento) => {
            clearInterval(idCronometro);
            iniciarCronometro();
        });
    }

    timeStop.onclick = () => {
        pararCronometro()
    }
