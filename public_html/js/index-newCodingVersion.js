
function Gioco() {
    // utils contiene molte funzioni utili com addClass(), removeClass, ecc
    var utils = new MyUtils();

    // scacchiera sarà un'array 8*8 contenente tutte le celle della scacchiera
    var scacchiera = utils.nodeList2Matrix(document.querySelectorAll("#scacchiera td"));

    // variabile per tenere traccia del numero di pedine restanti per completare il gioco
    var pedineDaInserire = 18;

    // variabile per tenere traccia della casella cliccata nel momento in cui l'utente va a scegliere il colore da inserire
    var ultimaCellaCliccata;


    /* AGGIUNGI HANDLER
     =============================================================================================== */
    function aggiungiHandler() {
        aggiungiHandlerAreaDiGioco();
        aggiungiHandlerSceltaColori();
    }

    // scorre tutte le righe ( eccetto la prima e l'ultima poichè sono bordi )
    // per ogni riga scorre le colonne ( eccetto la prima e l'ultima poichè sono bordi )
    // ed aggiunge l'handler
    function aggiungiHandlerAreaDiGioco() {
        for (var riga = 1; riga < 7; riga++) {
            for (var colonna = 1; colonna < 7; colonna++) {
                scacchiera[riga][colonna].riga = riga; // assegno la proprietà riga in modo da averla sempre disponibile
                scacchiera[riga][colonna].colonna = colonna; // assegno la proprietà riga in modo da averla sempre disponibile
                scacchiera[riga][colonna].addEventListener("click", mostraScegliColore);
            }
        }
    }

    function mostraScegliColore(e) {
        ultimaCellaCliccata = e.target;
        utils.removeClass(document.querySelector("#scegli_colore_container"), "nascondi");
    }

    function haGia3Pedine(el) {
        var contRiga = 0;
        var contColonna = 0;
        for (var i = 1; i < 7; i++) {
            if (scacchiera[el.riga][i].colore) {
                contRiga++;
            }
            if (scacchiera[i][el.colonna].colore) {
                contColonna++;
            }
            if (contRiga === 3 || contColonna === 3) {
                return true;
            }
        }
        return false;
    }

    function aggiungiHandlerSceltaColori() {
        document.querySelector("#scelta_rosso").addEventListener("click", function (e) {
            // controlla che il colore che stiamo per inserire non sia un doppione
            // sulla riga o sulla colonna
            if (coloreDoppione(ultimaCellaCliccata, "rosso")) {
                segnalaErroreGioco("Oops! c'è già una pedina rossa in questa riga o in questa colonna");
                return;
            }
            // se la casella in cui ha cliccato l'utente non è colorata
            // verifica che la colonna o la riga non abbia già 3 pedine
            if (!ultimaCellaCliccata.colore && haGia3Pedine(ultimaCellaCliccata)) {
                segnalaErroreGioco("Oops! ci sono già 3 pedine in questa riga o in questa colonna");
                return;
            }
            // aggiungo la classe per colorare la cella di rosso
            // e rimuovo le altre due classi, nel caso quella casella fosse già colorata
            utils.addClass(ultimaCellaCliccata, "cella_rosso");
            utils.removeClass(ultimaCellaCliccata, "cella_verde");
            utils.removeClass(ultimaCellaCliccata, "cella_blu");
            utils.removeClass(ultimaCellaCliccata, "cella_X");
            ultimaCellaCliccata.colore = "rosso"; // creo l'attributo colore nel nodo ultimaCellaCliccata
            pedineDaInserire--;
            // se il gioco è terminato verifico la soluzione
            if (pedineDaInserire === 0) {
                verificaSoluzione();
            }
        });
        document.querySelector("#scelta_verde").addEventListener("click", function (e) {
            // controlla che il colore che stiamo per inserire non sia un doppione
            // sulla riga o sulla colonna
            if (coloreDoppione(ultimaCellaCliccata, "verde")) {
                segnalaErroreGioco("Oops! c'è già una pedina verde in questa riga o in questa colonna");
                return;
            }
            // se la casella in cui ha cliccato l'utente non è colorata
            // verifica che la colonna o la riga non abbia già 3 pedine
            if (!ultimaCellaCliccata.colore && haGia3Pedine(ultimaCellaCliccata)) {
                segnalaErroreGioco("Oops! ci sono già 3 pedine in questa riga o in questa colonna");
                return;
            }
            // aggiungo la classe per colorare la cella di verde
            // e rimuovo le altre due classi, nel caso quella casella fosse già colorata
            utils.addClass(ultimaCellaCliccata, "cella_verde");
            utils.removeClass(ultimaCellaCliccata, "cella_rosso");
            utils.removeClass(ultimaCellaCliccata, "cella_blu");
            utils.removeClass(ultimaCellaCliccata, "cella_X");
            ultimaCellaCliccata.colore = "verde";
            pedineDaInserire--;
            // se il gioco è terminato verifico la soluzione
            if (pedineDaInserire === 0) {
                verificaSoluzione();
            }
        });
        document.querySelector("#scelta_blu").addEventListener("click", function (e) {
            // controlla che il colore che stiamo per inserire non sia un doppione
            // sulla riga o sulla colonna
            if (coloreDoppione(ultimaCellaCliccata, "blu")) {
                segnalaErroreGioco("Oops! c'è già una pedina blu in questa riga o in questa colonna");
                return;
            }
            // se la casella in cui ha cliccato l'utente non è colorata
            // verifica che la colonna o la riga non abbia già 3 pedine
            if (!ultimaCellaCliccata.colore && haGia3Pedine(ultimaCellaCliccata)) {
                segnalaErroreGioco("Oops! ci sono già 3 pedine in questa riga o in questa colonna");
                return;
            }
            // aggiungo la classe per colorare la cella di blu
            // e rimuovo le altre due classi, nel caso quella casella fosse già colorata
            utils.addClass(ultimaCellaCliccata, "cella_blu");
            utils.removeClass(ultimaCellaCliccata, "cella_rosso");
            utils.removeClass(ultimaCellaCliccata, "cella_verde");
            utils.removeClass(ultimaCellaCliccata, "cella_X");
            ultimaCellaCliccata.colore = "blu";
            pedineDaInserire--;
            // se il gioco è terminato verifico la soluzione
            if (pedineDaInserire === 0) {
                verificaSoluzione();
            }
        });
        document.querySelector("#scelta_bianca").addEventListener("click", function (e) {
            // rimuovo le classi, nel caso quella casella fosse già colorata
            utils.removeClass(ultimaCellaCliccata, "cella_blu");
            utils.removeClass(ultimaCellaCliccata, "cella_rosso");
            utils.removeClass(ultimaCellaCliccata, "cella_verde");
            utils.removeClass(ultimaCellaCliccata, "cella_X");
            if (ultimaCellaCliccata.colore) {
                if (ultimaCellaCliccata.colore) {
                    pedineDaInserire++;
                    delete ultimaCellaCliccata.colore;
                }

            }
        });
        document.querySelector("#scelta_X").addEventListener("click", function (e) {
            // rimuovo le classi, nel caso quella casella fosse già colorata
            utils.addClass(ultimaCellaCliccata, "cella_X");
            utils.removeClass(ultimaCellaCliccata, "cella_blu");
            utils.removeClass(ultimaCellaCliccata, "cella_rosso");
            utils.removeClass(ultimaCellaCliccata, "cella_verde");
            if (ultimaCellaCliccata.colore) {
                pedineDaInserire++;
                delete ultimaCellaCliccata.colore;
            }
        });


        // handler che gestisce la chiusura della scelta dei colori
        document.querySelector("#scegli_colore_container").addEventListener("click", function (e) {
            utils.addClass(document.querySelector("#scegli_colore_container"), "nascondi");
        });
    }


    function coloreDoppione(el, colore) {
        for (var i = 1; i < 7; i++) {
            if (scacchiera[el.riga][i].colore === colore || scacchiera[i][el.colonna].colore === colore) {
                return true;
            }
        }
        return false;
    }

    /* VERIFICA SOLUZIONE
     =============================================================================================== */
    function verificaSoluzione() {
        if (verificaBordoSinistro() && verificaBordoDestro() && verificaBordoSuperiore() && verificaBordoInferiore()) {
            /* puzzle risolto! complimentarsi con l'utente xD */
            utils.removeClass(document.querySelector("#youWin"), "nascondi");
        }
    }

    function verificaBordoSinistro() {
        for (var riga = 1; riga < 7; riga++) {
            for (var colonna = 1; colonna < 7; colonna++) {
                /* se ho inserito l'attributo colore in quel nodo e i due colori non sono uguali */
                if (scacchiera[riga][colonna].colore && scacchiera[riga][colonna].colore !== scacchiera[riga][0].colore) {
                    segnalaErroreSoluzione(riga, colonna);
                    return false;
                }
            }
        }
        return true;
    }

    function verificaBordoDestro() {
        for (var riga = 1; riga < 7; riga++) {
            for (var colonna = 6; colonna > 0; colonna--) {
                if (scacchiera[riga][colonna].colore && scacchiera[riga][colonna].colore !== scacchiera[riga][7].colore) {
                    segnalaErroreSoluzione(riga, colonna);
                    return false;
                }
            }
        }
        return true;
    }

    function verificaBordoSuperiore() {
        for (var colonna = 1; colonna < 7; colonna++) {
            for (var riga = 1; riga < 7; riga++) {
                if (scacchiera[riga][colonna].colore && scacchiera[riga][colonna].colore !== scacchiera[0][colonna].colore) {
                    segnalaErroreSoluzione(riga, colonna);
                    return false;
                }
            }
        }
        return true;
    }

    function verificaBordoInferiore() {
        for (var colonna = 1; colonna < 7; colonna++) {
            for (var riga = 6; riga > 0; riga--) {
                if (scacchiera[riga][colonna].colore && scacchiera[riga][colonna].colore !== scacchiera[7][colonna].colore) {
                    segnalaErroreSoluzione(riga, colonna);
                    return false;
                }
            }
        }
        return true;
    }

    function segnalaErroreSoluzione(riga, colonna) {
        /* decidere come fare per segnalare l'errore all'utente */
        utils.removeClass(document.querySelector("#youLose"), "nascondi");
    }

    function segnalaErroreGioco(testo) {
        document.querySelector("#errore_gioco_testo").innerHTML = testo;
        utils.removeClass(document.querySelector("#errore_gioco_container"), "nascondi_errore_gioco");
        setTimeout(function () {
            utils.addClass(document.querySelector("#errore_gioco_container"), "nascondi_errore_gioco");
        }, 3000);
    }


    /* PULIZIA TABELLONE
     =============================================================================================== */
    function resettaTabellone() {
        resettaBordi();
        resettaAreaDiGioco();
    }

    function resettaBordi() {
        for (var i = 1; i < 7; i++) {
            delete scacchiera[0][i].colore;
            delete scacchiera[7][i].colore;
            delete scacchiera[i][0].colore;
            delete scacchiera[i][7].colore;
        }
    }

    function resettaAreaDiGioco() {
        for (var riga = 1; riga < 7; riga++) {
            for (var colonna = 1; colonna < 7; colonna++) {
                delete scacchiera[riga][colonna].colore;
            }
        }
    }



    /* GENERA SOLUZIONE RANDOM
     =============================================================================================== */
    function generaSoluzioneRandom() {
        var ok = generaSoluzione();
        generaBordiDaSoluzioneRandom();
        resettaAreaDiGioco(); // commentare se si vuole avere la soluzione scritta nei nodi del DOM
    }

    function generaSoluzione() {

        var numeroRandomPerColore;
        var numeroRandomPerPosizione;
        var coloriDaInserire;
        var posizioniLibere;
        var colore;
        var posizione;
        var riga;
        var rigaDaControllare;

        for (riga = 1; riga < 7; riga++) {
            coloriDaInserire = ["rosso", "verde", "blu"];
            /* finchè non ho inserito tutti i colori */
            while (coloriDaInserire.length > 0) {
                posizioniLibere = [1, 2, 3, 4, 5, 6];
                numeroRandomPerColore = Math.floor((Math.random() * 1000) % coloriDaInserire.length);
                colore = coloriDaInserire[numeroRandomPerColore];
                coloriDaInserire.splice(numeroRandomPerColore, 1); /* elimino dall'array il colore scelto */
                do {
                    /* <PURTROPPO QUESTO ALGORITMO NON GENERA SEMPRE UNA SOLUZIONE CORRETTA> 
                     * <QUANDO CIO' AVVIENE, L'ARRAY DELLE POSIZIONI SARA' VUOTO E QUINDI POSIZIONE>
                     * <SARA' undefined>
                     */
                    if (posizioniLibere.length === 0) {
                        resettaAreaDiGioco(); // prima di riprovare a generare una soluzione faccio piazza pulita 
                        generaSoluzione();
                        return;
                    }
                    rigaDaControllare = 0;
                    numeroRandomPerPosizione = Math.floor((Math.random() * 1000) % posizioniLibere.length);
                    posizione = posizioniLibere[numeroRandomPerPosizione];
                    posizioniLibere.splice(numeroRandomPerPosizione, 1); /* elimino dall'array la posizione scelta */
                    /*controllo che nella posizione scelta non sia già stato inserito un colore nei cicli precedenti*/
                    if (scacchiera[riga][posizione].colore) {
                        continue;
                    }
                    /* controllo se in quella colonna c'è già il colore scelto */
                    while (rigaDaControllare < riga) {
                        if (scacchiera[rigaDaControllare][posizione].colore && scacchiera[rigaDaControllare][posizione].colore === colore) {
                            break;
                        }
                        rigaDaControllare++;
                    }
                } while (rigaDaControllare !== riga);

                /* sono uscito dal while perché ho trovato dove posizionare il colore */
                /* inserisco il colore nella posizione trovata */
                /* e dico che ora quella cella è colorata */
                /* <COMMENTO QUESTA RIGA PERCHÈ NON SI DEVE MOSTRARE LA SOLUZIONE!!!> */
                /* <INOLTRE SE DECOMMENTASSI QUESTA RIGA E L'ALGORITMO PROVASSE A GENERARE UNA SECONDA> */
                /* <O UNA TERZA SOLUZIONE LE CELLE GIA' COLORATE RESTEREBBERO PERCHE' NELLA FUNZIONE> */
                /* <CHE RESETTA L'AREA DI GIOCO NON VIENE ELIMINATA LA CLASSE CHE IN QUESTA RIGA VIENE AGGIUNTA> */
                //utils.addClass(scacchiera[riga][posizione], "cella_" + colore);
                scacchiera[riga][posizione].colore = colore;
            }
        }
    }

    function generaBordiDaSoluzioneRandom() {
        generaBordoSinistro();
        generaBordoDestro();
        generaBordoSuperiore();
        generaBordoInferiore();
    }

    function generaBordoSinistro() {
        for (var riga = 1; riga < 7; riga++) {
            for (var colonna = 1; colonna < 7; colonna++) {
                if (scacchiera[riga][colonna].colore) {
                    scacchiera[riga][0].colore = scacchiera[riga][colonna].colore;
                    utils.addClass(scacchiera[riga][0], "bordo_" + scacchiera[riga][colonna].colore);
                    break;
                }
            }
        }
    }

    function generaBordoDestro() {
        for (var riga = 1; riga < 7; riga++) {
            for (var colonna = 6; colonna > 0; colonna--) {
                if (scacchiera[riga][colonna].colore) {
                    scacchiera[riga][7].colore = scacchiera[riga][colonna].colore;
                    utils.addClass(scacchiera[riga][7], "bordo_" + scacchiera[riga][colonna].colore);
                    break;
                }
            }
        }
    }

    function generaBordoSuperiore() {
        for (var colonna = 1; colonna < 7; colonna++) {
            for (var riga = 1; riga < 7; riga++) {
                if (scacchiera[riga][colonna].colore) {
                    scacchiera[0][colonna].colore = scacchiera[riga][colonna].colore;
                    utils.addClass(scacchiera[0][colonna], "bordo_" + scacchiera[riga][colonna].colore);
                    break;
                }
            }
        }
    }

    function generaBordoInferiore() {
        for (var colonna = 1; colonna < 7; colonna++) {
            for (var riga = 6; riga > 0; riga--) {
                if (scacchiera[riga][colonna].colore) {
                    scacchiera[7][colonna].colore = scacchiera[riga][colonna].colore;
                    utils.addClass(scacchiera[7][colonna], "bordo_" + scacchiera[riga][colonna].colore);
                    break;
                }
            }
        }
    }



    /* RETURN
     =============================================================================================== */

    return{
        avvia: function () {
            aggiungiHandler();
            generaSoluzioneRandom();
        }
    };

}


var gioco = new Gioco();
gioco.avvia();



