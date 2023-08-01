const audio = document.getElementById("audio");
audio.volume = 0.1;
export const btnAudio = document.getElementById("btn-audio");
export let audioSvg;

// função para dar volume no som
export function comVolume() {
    audio.volume = 0.1;
    //atribui o ícone de "com audio" quando a função for chamada
    audioSvg = `<img src="assets/volume-up-fill.svg" width="22">`;
}

//função para deixar o som sem volume
export function semVolume() {
    audio.volume = 0;
    //atribui o ícone de "sem som" quando a função for chamada
    audioSvg = `<img src="assets/volume-mute.svg" width="22">`;
}
