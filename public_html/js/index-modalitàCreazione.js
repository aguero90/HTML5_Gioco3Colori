

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
        aggiungiHandlerBordi();
        aggiungiHandlerSceltaColoriBordo();
        aggiungiHandlerAreaDiGioco();
        aggiungiHandlerSceltaColori();
    }

    function aggiungiHandlerBordi() {

        for (var i = 1; i < 7; i++) {
            scacchiera[i][0].addEventListener("click", mostraScegliColoreBordo);
            scacchiera[i][7].addEventListener("click", mostraScegliColoreBordo);
            scacchiera[0][i].addEventListener("click", mostraScegliColoreBordo);
            scacchiera[7][i].addEventListener("click", mostraScegliColoreBordo);
        }

    }

    function mostraScegliColoreBordo(e) {

        ultimaCellaCliccata = e.target;
        utils.removeClass(document.querySelector("#scegli_colore_bordo_container"), "nascondi");
    }

    function aggiungiHandlerSceltaColoriBordo() {
        document.querySelector("#scelta_bordo_rosso").addEventListener("click", function (e) {
            // aggiungo la classe per colorare la cella di rosso
            // e rimuovo le altre due classi, nel caso quella casella fosse già colorata
            utils.addClass(ultimaCellaCliccata, "bordo_rosso");
            utils.removeClass(ultimaCellaCliccata, "bordo_verde");
            utils.removeClass(ultimaCellaCliccata, "bordo_blu");
            ultimaCellaCliccata.colore = "rosso"; // creo l'attributo colore nel nodo ultimaCellaCliccata
        });

        document.querySelector("#scelta_bordo_verde").addEventListener("click", function (e) {
            // aggiungo la classe per colorare la cella di verde
            // e rimuovo le altre due classi, nel caso quella casella fosse già colorata
            utils.addClass(ultimaCellaCliccata, "bordo_verde");
            utils.removeClass(ultimaCellaCliccata, "bordo_rosso");
            utils.removeClass(ultimaCellaCliccata, "bordo_blu");
            ultimaCellaCliccata.colore = "verde";
        });

        document.querySelector("#scelta_bordo_blu").addEventListener("click", function (e) {
            // aggiungo la classe per colorare la cella di blu
            // e rimuovo le altre due classi, nel caso quella casella fosse già colorata
            utils.addClass(ultimaCellaCliccata, "bordo_blu");
            utils.removeClass(ultimaCellaCliccata, "bordo_rosso");
            utils.removeClass(ultimaCellaCliccata, "bordo_verde");
            ultimaCellaCliccata.colore = "blu";
        });

        document.querySelector("#scelta_no_bordo").addEventListener("click", function (e) {
            // aggiungo la classe per colorare la cella di blu
            // e rimuovo le altre due classi, nel caso quella casella fosse già colorata
            utils.removeClass(ultimaCellaCliccata, "bordo_blu");
            utils.removeClass(ultimaCellaCliccata, "bordo_rosso");
            utils.removeClass(ultimaCellaCliccata, "bordo_verde");
            delete ultimaCellaCliccata.colore;
        });

        // handler che gestisce la chiusura della scelta dei colori
        document.querySelector("#scegli_colore_bordo_container").addEventListener("click", function (e) {
            utils.addClass(document.querySelector("#scegli_colore_bordo_container"), "nascondi");
        });
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
        // se la casella in cui ha cliccato l'utente non è colorata
        // verifica che la colonna o la riga non abbia già 3 pedine
        if (!e.target.colore) {
            if (haGia3Pedine(e.target)) {
                segnalaErroreGioco("Oops! ci sono già 3 pedine in questa riga o in questa colonna")
                return;
            }
        }
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
            // aggiungo la classe per colorare la cella di rosso
            // e rimuovo le altre due classi, nel caso quella casella fosse già colorata
            utils.addClass(ultimaCellaCliccata, "cella_rosso");
            utils.removeClass(ultimaCellaCliccata, "cella_verde");
            utils.removeClass(ultimaCellaCliccata, "cella_blu");
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
            // aggiungo la classe per colorare la cella di verde
            // e rimuovo le altre due classi, nel caso quella casella fosse già colorata
            utils.addClass(ultimaCellaCliccata, "cella_verde");
            utils.removeClass(ultimaCellaCliccata, "cella_rosso");
            utils.removeClass(ultimaCellaCliccata, "cella_blu");
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
            // aggiungo la classe per colorare la cella di blu
            // e rimuovo le altre due classi, nel caso quella casella fosse già colorata
            utils.addClass(ultimaCellaCliccata, "cella_blu");
            utils.removeClass(ultimaCellaCliccata, "cella_rosso");
            utils.removeClass(ultimaCellaCliccata, "cella_verde");
            ultimaCellaCliccata.colore = "blu";
            pedineDaInserire--;
            // se il gioco è terminato verifico la soluzione
            if (pedineDaInserire === 0) {
                verificaSoluzione();
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
        }
    }

    function verificaBordoSinistro() {
        for (var riga = 1; riga < 7; riga++) {
            for (var colonna = 1; colonna < 7; colonna++) {
                /* se ho inserito l'attributo colore in quel nodo */
                if (scacchiera[riga][colonna].colore) {
                    /* se i due colori sono uguali */
                    if (scacchiera[riga][colonna].colore === scacchiera[riga][0].colore) {
                        return true;
                    }
                    else {
                        segnalaErroreSoluzione(riga, colonna);
                        return false;
                    }
                }
            }
        }
    }

    function verificaBordoDestro() {
        for (var riga = 1; riga < 7; riga++) {
            for (var colonna = 6; colonna > 0; colonna--) {
                if (scacchiera[riga][colonna].colore) {
                    if (scacchiera[riga][colonna].colore === scacchiera[riga][7].colore) {
                        return true;
                    }
                    else {
                        segnalaErroreSoluzione(riga, colonna);
                        return false;
                    }
                }
            }
        }
    }

    function verificaBordoSuperiore() {
        for (var colonna = 1; colonna < 7; colonna++) {
            for (var riga = 1; riga < 7; riga++) {
                if (scacchiera[riga][colonna].colore) {
                    if (scacchiera[riga][colonna].colore === scacchiera[0][colonna].colore) {
                        return true;
                    }
                    else {
                        segnalaErroreSoluzione(riga, colonna);
                        return false;
                    }
                }
            }
        }
    }

    function verificaBordoInferiore() {
        for (var colonna = 1; colonna < 7; colonna++) {
            for (var riga = 6; riga > 0; riga--) {
                if (scacchiera[riga][colonna].colore) {
                    if (scacchiera[riga][colonna].colore === scacchiera[7][colonna].colore) {
                        return true;
                    }
                    else {
                        segnalaErroreSoluzione(riga, colonna);
                        return false;
                    }
                }
            }
        }
    }

    function segnalaErroreSoluzione(riga, colonna) {
        /* decidere come fare per segnalare l'errore all'utente */
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







    return{
        avvia: function () {
            aggiungiHandler();
        }
    };

}


var gioco = new Gioco();
gioco.avvia();






