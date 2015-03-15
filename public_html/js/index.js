/* per rendere disponibile la funzione contains anche su chrome */
if (!('contains' in String.prototype)) {
    String.prototype.contains = function(str, startIndex) {
        return -1 !== String.prototype.indexOf.call(this, str, startIndex);
    };
}




/* GESTIONE SELEZIONE COLORE
 =============================================================================================== */
/* aggiungo handler ad ogni casella dell'area di gioco */
var areaDiGioco = document.querySelectorAll(".area_di_gioco");
for (var i = 0; i < areaDiGioco.length; i++) {
    areaDiGioco[i].addEventListener("click", mostraScegliColore);
}

var casellaCliccata;
var pedineDaInserire = 18;

function mostraScegliColore(e) {
    /* controllo se sulla riga e/o colonna cliccata dall'utente ci sono già 3 pedine */
    var rigaDellaCasellaCliccata = e.target.getAttribute("class").split(" ")[0]; /* prendo la classe riga_x */
    var colonnaDellaCasellaCliccata = e.target.getAttribute("class").split(" ")[1]; /* prendo la classe colonna_x */
    if (haGiaTrePedine(rigaDellaCasellaCliccata) || haGiaTrePedine(colonnaDellaCasellaCliccata)) {
        alert("non puoi inserire altre pedine in questa riga o colonna");
        return;
    }
    document.querySelector("#scegli_colore_container").removeAttribute("class");
    casellaCliccata = e.target;
}



function haGiaTrePedine(rigaOColonnaDellaCasellaCliccata) {
    var rc = document.querySelectorAll("." + rigaOColonnaDellaCasellaCliccata);
    var cont = 0;
    for (var i = 1; i < rc.length - 1; i++) { /* escludo dal ciclo i bordi */
        if (rc[i].getAttribute("class").contains("icon_circle-slelected")) {
            cont++;
        }
    }
    if (cont === 3) {
        return true;
    }
    return false;
}

/* handler per i colori da scegliere */
document.querySelector("#scelta_rossa").addEventListener("click", colora("red"));
document.querySelector("#scelta_verde").addEventListener("click", colora("green"));
document.querySelector("#scelta_blu").addEventListener("click", colora("blue"));

function colora(colore) {
    return function() {

        /* controllo se sulla riga e/o colonna cliccata dall'utente c'è già una pedina dello stesso colore */
        var rigaDellaCasellaCliccata = casellaCliccata.getAttribute("class").split(" ")[0]; /* prendo la classe riga_x */
        var colonnaDellaCasellaCliccata = casellaCliccata.getAttribute("class").split(" ")[1]; /* prendo la classe colonna_x */
        if (haGiaPedinaDiQuestoColore(rigaDellaCasellaCliccata, colore) || haGiaPedinaDiQuestoColore(colonnaDellaCasellaCliccata, colore)) {
            alert("su questa riga/colonna c'è già una pedina di questo colore");
            return;
        }

        casellaCliccata.setAttribute("class", casellaCliccata.getAttribute("class") + " icon_circle-slelected");
        casellaCliccata.setAttribute("style", "color: " + colore + ";");
        pedineDaInserire--;
        if (pedineDaInserire === 0) {
            controllaSoluzione();
        }
    };
}

function haGiaPedinaDiQuestoColore(rigaOColonnaDellaCasellaCliccata, colore) {
    var rc = document.querySelectorAll("." + rigaOColonnaDellaCasellaCliccata);
    for (var i = 1; i < rc.length - 1; i++) { /* escludo dal ciclo i bordi */
        if (rc[i].hasAttribute("style") && rc[i].getAttribute("style") === ("color: " + colore + ";")) {
            return true;
        }
    }
    return false;
}


/* quando è visibile la scelta dei colori un qualsiasi click sulla pagina la fa sparire */
document.querySelector("#scegli_colore_container").addEventListener("click", function(e) {
    document.querySelector("#scegli_colore_container").setAttribute("class", "nascondi");
});


function controllaSoluzione() {

    var scacchiera = document.querySelectorAll("#scacchiera td");
    var riga;
    var colonna;
    var coloreBordo;

    /* coloro bordo sinistro */
    for (riga = 1; riga * 8 < scacchiera.length - 8; riga++) {
        coloreBordo = scacchiera[riga * 8].getAttribute("style");
        for (colonna = 1; colonna < 7; colonna++) {
            if (scacchiera[(riga * 8) + colonna].hasAttribute("style")) {
                if (scacchiera[(riga * 8) + colonna].getAttribute("style") === coloreBordo) {
                    break; /* esco dal ciclo e non controllo più questa riga */
                }
                else {
                    /* la prima pedina non è dello stesso colore del bordo */
                    segnalaErrore(scacchiera[(riga * 8) + colonna]);
                    return; /* se vogliamo controllare e segnalare TUTTI gli errori togliere questo return */
                }
            }
        }
    }

    /* coloro bordo destro */
    for (riga = 1; riga * 8 < scacchiera.length - 8; riga++) {
        coloreBordo = scacchiera[(riga * 8) + 7].getAttribute("style");
        for (colonna = 6; colonna > 0; colonna--) {
            if (scacchiera[(riga * 8) + colonna].hasAttribute("style")) {
                if (scacchiera[(riga * 8) + colonna].getAttribute("style") === coloreBordo) {
                    break; /* esco dal ciclo e non controllo più questa riga */
                }
                else {
                    /* la prima pedina non è dello stesso colore del bordo */
                    segnalaErrore(scacchiera[(riga * 8) + colonna]);
                    return; /* se vogliamo controllare e segnalare TUTTI gli errori togliere questo return */
                }
            }
        }
    }

    /* colore bordo superiore */
    for (colonna = 1; colonna < 7; colonna++) {
        coloreBordo = scacchiera[colonna];
        for (riga = 1; riga < scacchiera.length - 8; riga++) {
            if (scacchiera[(riga * 8) + colonna].hasAttribute("style")) {
                if (scacchiera[(riga * 8) + colonna].getAttribute("style") === coloreBordo) {
                    break; /* esco dal ciclo e non controllo più questa riga */
                }
                else {
                    /* la prima pedina non è dello stesso colore del bordo */
                    segnalaErrore(scacchiera[(riga * 8) + colonna]);
                    return; /* se vogliamo controllare e segnalare TUTTI gli errori togliere questo return */
                }
            }
        }
    }

    /* colore bordo inferiore */
    for (colonna = 1; colonna < 7; colonna++) {
        coloreBordo = scacchiera[56 + colonna];
        for (riga = 6; riga > 0; riga--) {
            if (scacchiera[(riga * 8) + colonna].hasAttribute("style")) {
                if (scacchiera[(riga * 8) + colonna].getAttribute("style") === coloreBordo) {
                    break; /* esco dal ciclo e non controllo più questa riga */
                }
                else {
                    /* la prima pedina non è dello stesso colore del bordo */
                    segnalaErrore(scacchiera[(riga * 8) + colonna]);
                    return; /* se vogliamo controllare e segnalare TUTTI gli errori togliere questo return */
                }
            }
        }
    }
}

function segnalaErrore(casellaDiErrore) {
    casellaDiErrore.setAttribute("class", casellaDiErrore.getAttribute("class") + " errore");
}



/* FUNZIONE CHE RESETTA IL TABELLONE
 =============================================================================================== */
function resettaTabellone() {
    resettaBordi();
    resettaAreaDiGioco();
}

function resettaBordi() {
    var elementiBordi = document.querySelectorAll(".bordo_colorabile");
    for (var i = 0; i < elementiBordi.length; i++) {
        if (elementiBordi[i].hasAttribute("style")) {
            elementiBordi[i].removeAttribute("style");
        }
    }
}

function resettaAreaDiGioco() {
    var scacchiera = document.querySelectorAll("#scacchiera td");
    for (var riga = 1; riga < 7; riga++) {
        for (var colonna = 1; colonna < 7; colonna++) {
            if (scacchiera[(riga * 8) + colonna].hasAttribute("style")) {
                scacchiera[(riga * 8) + colonna].removeAttribute("style");
                scacchiera[(riga * 8) + colonna].setAttribute("class", scacchiera[(riga * 8) + colonna].getAttribute("class").replace(" icon_circle-slelected", ""));
            }
        }
    }
}






/* GENERA SOLUZIONE RANDOM
 =============================================================================================== */
var bottoneGeneraSoluzioneRandom = document.querySelector("#genera_soluzione_random");
bottoneGeneraSoluzioneRandom.addEventListener("click", generaSoluzioneRandom);

function generaSoluzioneRandom() {
    resettaTabellone();

    /* la variabile scacchiera conterra:
     *          • 00-07: riga1 ( da non considerare -> bordo superiore )
     *          • 08-15: riga2 ( 08: bordo sinistro - 15: bordo destro )
     *          • 16-23: riga3 ( 16: bordo sinistro - 23: bordo destro )
     *          • 24-31: riga4 ( 24: bordo sinistro - 31: bordo destro )
     *          • 32-39: riga5 ( 32: bordo sinistro - 39: bordo destro )
     *          • 40-47: riga6 ( 40: bordo sinistro - 47: bordo destro )
     *          • 48-55: riga7 ( 48: bordo sinistro - 55: bordo destro )
     *          • 56-63: riga8 ( da non considerare -> bordo inferiore )
     **/
    var scacchiera = document.querySelectorAll("#scacchiera td");
    var numeroRandomPerColore;
    var numeroRandomPerPosizione;
    var coloriDaInserire;
    var posizioniLibere;
    var colore;
    var posizione;
    var riga;
    var rigaDaControllare;


    /* <NOTA:> riga deve partire da 1 perché le celle da 00 a 07 sono il bordo superiore
     * <NOTA:> riga deve arrivare a scacchiera.lenght-8 perché le celle da 56 a 63 sono il bordo inferiore
     *   */
    for (riga = 1; riga * 8 < (scacchiera.length - 8); riga++) {
        coloriDaInserire = ["color: red;", "color: green;", "color: blue;"];

        /* finchè non ho inserito tutti i colori */
        while (coloriDaInserire.length > 0) {
            posizioniLibere = [1, 2, 3, 4, 5, 6];

            numeroRandomPerColore = Math.floor((Math.random() * 1000) % coloriDaInserire.length);
            colore = coloriDaInserire[numeroRandomPerColore];
            coloriDaInserire.splice(numeroRandomPerColore, 1); /* elimino dall'array il colore scelto */

            do {
                rigaDaControllare = 0;
                numeroRandomPerPosizione = Math.floor((Math.random() * 1000) % posizioniLibere.length);
                posizione = posizioniLibere[numeroRandomPerPosizione];
                /* <PURTROPPO QUESTO ALGORITMO NON GENERA SEMPRE UNA SOLUZIONE CORRETTA> 
                 * <QUANDO CIO' AVVIENE, L'ARRAY DELLE POSIZIONI SARA' VUOTO E QUINDI POSIZIONE>
                 * <SARA' undefined>
                 */
                if (posizione === undefined) {
                    generaSoluzioneRandom();
                    return;
                }
                posizioniLibere.splice(numeroRandomPerPosizione, 1); /* elimino dall'array la posizione scelta */
                /*controllo che nella posizione scelta non sia già stato inserito un colore nei cicli precedenti*/
                if (scacchiera[(riga * 8) + posizione].hasAttribute("style")) {
                    continue;
                }
                /* controllo se in quella colonna c'è già il colore scelto */
                while (rigaDaControllare < riga) {
                    if (scacchiera[(rigaDaControllare * 8) + posizione].hasAttribute("style") &&
                            scacchiera[(rigaDaControllare * 8) + posizione].getAttribute("style") === colore) {
                        break;
                    }
                    rigaDaControllare++;
                }
            } while (rigaDaControllare !== riga);

            /* sono uscito dal while perché ho trovato dove posizionare il colore */
            /* inserisco il colore nella posizione trovata */
            scacchiera[(riga * 8) + posizione].setAttribute("style", colore);
            /* inserisco anche l'immagine del pallino xD */
            /* commento così ho la soluzione salvata ma l'utente non la vede xD */
            // scacchiera[(riga * 8) + posizione].setAttribute("class", scacchiera[(riga * 8) + posizione].getAttribute("class") + " icon_circle-slelected");
        }
    }
    generaBordiDaSoluzioneRandom(scacchiera);
}

function generaBordiDaSoluzioneRandom(scacchiera) {

    var riga;
    var colonna;

    /* coloro bordo sinistro */
    for (riga = 1; riga * 8 < scacchiera.length - 8; riga++) {
        for (colonna = 1; colonna < 7; colonna++) {
            if (scacchiera[(riga * 8) + colonna].hasAttribute("style")) {
                scacchiera[riga * 8].setAttribute("style", scacchiera[(riga * 8) + colonna].getAttribute("style"));
                break; /* primo colore partendo da sinistra trovato -> non c'è più bisogno di scorrere la riga */
            }
        }
    }

    /* coloro bordo destro */
    for (riga = 1; riga * 8 < scacchiera.length - 8; riga++) {
        for (colonna = 6; colonna > 0; colonna--) {
            if (scacchiera[(riga * 8) + colonna].hasAttribute("style")) {
                scacchiera[riga * 8 + 7].setAttribute("style", scacchiera[(riga * 8) + colonna].getAttribute("style"));
                break; /* primo colore partendo da destra trovato -> non c'è più bisogno di scorrere la riga */
            }
        }
    }

    /* colore bordo superiore */
    for (colonna = 1; colonna < 7; colonna++) {
        for (riga = 1; riga < scacchiera.length - 8; riga++) {
            if (scacchiera[(riga * 8) + colonna].hasAttribute("style")) {
                scacchiera[colonna].setAttribute("style", scacchiera[(riga * 8) + colonna].getAttribute("style"));
                break; /* primo colore partendo dall'alto trovato -> non c'è più bisogno di scorrere la colonna*/
            }
        }
    }

    /* colore bordo inferiore */
    for (colonna = 1; colonna < 7; colonna++) {
        for (riga = 6; riga > 0; riga--) {
            if (scacchiera[(riga * 8) + colonna].hasAttribute("style")) {
                scacchiera[56 + colonna].setAttribute("style", scacchiera[(riga * 8) + colonna].getAttribute("style"));
                break; /* primo colore partendo dall'alto trovato -> non c'è più bisogno di scorrere la colonna*/
            }
        }
    }


    /* una volta creato il tabellone resetto l'area di gioco, in questo modo è libera e si può iniziare tranquillamente la partita */
    resettaAreaDiGioco();

}




