let cronometro = 0;
let idCronometro;
let cronometroFormatado;
const cronometroHTML = document.getElementById("cronometro");

function atualizaCronometro() {
    cronometro++;
    let minutos = Math.floor(cronometro / 60);
    let horas = "00";

    if (minutos > 60) {
        horas = Math.floor(minutos / 60);
        minutos = minutos % 60;

        if (horas < 10) {
            horas = "0" + horas;
        }

        if (minutos < 10) {
            minutos = "0" + minutos;
        }
    } else if (minutos < 10) {
        minutos = "0" + minutos;
    }

    let segundos = cronometro % 60;

    if (segundos < 10) {
        segundos = "0" + segundos;
    }

    cronometroFormatado = horas + ":" + minutos + ":" + segundos;

    // Atualizando o cronômetro no HTML
    cronometroHTML.innerHTML = cronometroFormatado;
}

export function iniciarCronometro() {
    console.log("Iniciando o cronômetro...");

    cronometro = 0;
    cronometroHTML.innerHTML = "00:00:00";

    idCronometro = setInterval(atualizaCronometro, 1000);
    cronometroHTML.hidden = false;
}

export function pararCronometro() {
    console.log("Parando o cronômetro...");

    // Parando o cronômetro
    clearInterval(idCronometro);

    cronometroHTML.hidden = true;

    return cronometroFormatado;
}
