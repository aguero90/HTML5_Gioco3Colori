
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
        // se la casella in cui ha cliccato l'utente non è colorata
        // verifica che la colonna o la riga non abbia già 3 pedine
        if (!e.target.colore) {
            if (haGia3Pedine(e.target)) {
                segnalaErroreGioco("Oops! ci sono già 3 pedine in questa riga o in questa colonna");
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



    /* GENERA BORDI RANDOM
     =============================================================================================== */
    function generaBordiRandom() {
        generaBordoSinistro();
        generaBordoDestro();
        riempiBordoSinistro();
        riempiBordoDestro();

        do {
            for (var i = 2; i < 6; i++) {
                if (scacchiera[0][i].colore) {
                    delete scacchiera[0][i].colore;
                }
                if (scacchiera[7][i].colore) {
                    delete scacchiera[7][i].colore;
                }
            }
            generaBordoSuperiore();

        } while (!generaBordoInferiore())

        riempiBordoSuperiore();
        riempiBordoInferiore();
        coloraBordi();

    }

    function generaBordoSinistro() {
        var coloriDisponibili = ["rosso", "verde", "blu"];
        var posizioniDisponibili = [1, 2, 3, 4, 5, 6];
        var coloreSelezionato;
        var posizioneSelezionata;
        while (coloriDisponibili.length > 0 && posizioniDisponibili.length > 0) {

            // seleziona e rimuovi un colore random dai colori rimasti
            coloreSelezionato = coloriDisponibili.splice(Math.floor(Math.random() * 100000) % coloriDisponibili.length, 1)[0];
            // seleziona e rimuovi una posizione random dalle posizioni rimaste
            posizioneSelezionata = posizioniDisponibili.splice(Math.floor(Math.random() * 100000) % posizioniDisponibili.length, 1)[0];
            scacchiera[posizioneSelezionata][0].colore = coloreSelezionato;
        }

        if (posizioniDisponibili.length <= 0 && coloriDisponibili.length > 0) {
            console.log("generaBordoSinistro: posizioniDisponibili.length <= 0 && coloriDisponibili.length > 0");
        }

        // ora generiamo gli estremi
        generaEstremiColonna(0);
    }

    function generaBordoDestro() {
        var coloriDisponibili = ["rosso", "verde", "blu"];
        var posizioniDisponibili = [1, 2, 3, 4, 5, 6];
        var coloreSelezionato;
        var posizioneSelezionata;
        while (coloriDisponibili.length > 0 && posizioniDisponibili.length > 0) {

            // seleziona e rimuovi un colore random dai colori rimasti
            coloreSelezionato = coloriDisponibili.splice(Math.floor(Math.random() * 100000) % coloriDisponibili.length, 1)[0];
            // seleziona e rimuovi una posizione random dalle posizioni rimaste
            posizioneSelezionata = posizioniDisponibili.splice(Math.floor(Math.random() * 100000) % posizioniDisponibili.length, 1)[0];
            if (scacchiera[posizioneSelezionata][0].colore && scacchiera[posizioneSelezionata][0].colore === coloreSelezionato) {
                // se sto tentando di inserire lo stesso colore presente sul bordo opposto
                // rinuncio all'inserimento e reinserisco colore e posizione tra quelli disponibili
                coloriDisponibili.push(coloreSelezionato);
                posizioniDisponibili.push(posizioneSelezionata);
            } else {
                // altrimenti inserisci semplicemente
                scacchiera[posizioneSelezionata][7].colore = coloreSelezionato;
            }
        }

        if (posizioniDisponibili.length <= 0 && coloriDisponibili.length > 0) {
            console.log("generaBordoSinistro: posizioniDisponibili.length <= 0 && coloriDisponibili.length > 0");
        }

        // ora generiamo gli estremi
        generaEstremiColonna(7);
    }

    function generaEstremiColonna(colonna) {

        // scorro dall'alto verso il basso la colonna fino a quando non trovo un colore
        for (var i = 1; i < 7; i++) {
            if (scacchiera[i][colonna].colore) {
                colonna === 0 ? scacchiera[0][1].colore = scacchiera[i][colonna].colore : scacchiera[0][6].colore = scacchiera[i][colonna].colore;
                break;
            }
        }

        // scorro dal basso verso l'alto la colonna fino a quando non trovo un colore
        for (var i = 6; i > 0; i--) {
            if (scacchiera[i][colonna].colore) {
                colonna === 0 ? scacchiera[7][1].colore = scacchiera[i][colonna].colore : scacchiera[7][6].colore = scacchiera[i][colonna].colore;
                break;
            }
        }

    }

    function riempiBordoSinistro() {
        var colori = ["rosso", "verde", "blu"];
        var posizioniDisponibili = [1, 2, 3, 4, 5, 6];
        var coloreSelezionato;
        var posizioneSelezionata;
        // eliminiamo prima dalle posizioniDisponibili le posizioni in cui abbiamo già inserito i 3 colori della combinazione
        for (var i = 1; i < 7; i++) {
            if (scacchiera[i][0].colore) {
                posizioniDisponibili.remove(i);
            }
        }

        // ora riempiamo il bordo sinistro
        while (posizioniDisponibili.length > 0) {
            // seleziona un colore random dai colori
            coloreSelezionato = colori[Math.floor(Math.random() * 100000) % colori.length];
            // seleziona e rimuovi una posizione random dalle posizioni rimaste
            posizioneSelezionata = posizioniDisponibili.splice(Math.floor(Math.random() * 100000) % posizioniDisponibili.length, 1)[0];
            if (scacchiera[posizioneSelezionata][7].colore && scacchiera[posizioneSelezionata][7].colore === coloreSelezionato) {
                // se sto tentando di inserire lo stesso colore presente sul bordo opposto
                // rinuncio all'inserimento e reinserisco la posizione tra quelle disponibili
                posizioniDisponibili.push(posizioneSelezionata);
            } else {
                // altrimenti inserisci semplicemente
                scacchiera[posizioneSelezionata][0].colore = coloreSelezionato;
            }
        }

    }

    function riempiBordoDestro() {
        var colori = ["rosso", "verde", "blu"];
        var posizioniDisponibili = [1, 2, 3, 4, 5, 6];
        var coloreSelezionato;
        var posizioneSelezionata;
        // eliminiamo prima dalle posizioniDisponibili le posizioni in cui abbiamo già inserito i 3 colori della combinazione
        for (var i = 1; i < 7; i++) {
            if (scacchiera[i][7].colore) {
                posizioniDisponibili.remove(i);
            }
        }

        // ora riempiamo il bordo destro
        while (posizioniDisponibili.length > 0) {

            // seleziona un colore random dai colori
            coloreSelezionato = colori[Math.floor(Math.random() * 100000) % colori.length];
            // seleziona e rimuovi una posizione random dalle posizioni rimaste
            posizioneSelezionata = posizioniDisponibili.splice(Math.floor(Math.random() * 100000) % posizioniDisponibili.length, 1)[0];
            if (scacchiera[posizioneSelezionata][0].colore === coloreSelezionato) {
                // se sto tentando di inserire lo stesso colore presente sul bordo opposto
                // rinuncio all'inserimento e reinserisco la posizione tra quelle disponibili
                posizioniDisponibili.push(posizioneSelezionata);
            } else {
                // altrimenti inserisci semplicemente
                scacchiera[posizioneSelezionata][7].colore = coloreSelezionato;
            }
        }

    }

    function generaBordoSuperiore() {
        var colori = ["rosso", "verde", "blu"];
        var posizioneSelezionata;
        var estremoSinistroInserito = false;
        var coloreEstremoSinistro = scacchiera[1][0].colore;
        var coloreIntermedio;
        var coloreEstremoDestro = scacchiera[1][7].colore;
        for (var i in colori) {
            if (colori[i] !== coloreEstremoSinistro && colori[i] !== coloreEstremoDestro) {
                coloreIntermedio = colori[i];
                break;
            }
        }

        // controlliamo prima se gli angoli coincidono
        if (scacchiera[1][0].colore === scacchiera[0][1].colore) {
            // rimuoviamolo dai colori disponibili e diciamo che è stato inserito
            colori.remove(coloreEstremoSinistro);
            estremoSinistroInserito = true;
        }
        if (scacchiera[1][7].colore === scacchiera[0][6].colore) {
            // rimuoviamolo dai colori disponibili e diciamo che è stato inserito
            colori.remove(coloreEstremoDestro);
        }


        switch (colori.length) {
            // entrambi gli angoli coincidono e dobbiamo inserire solo il colore intermedio
            case 1:
                posizioneSelezionata = (Math.floor(Math.random() * 100000) % 4) + 2;
                scacchiera[0][posizioneSelezionata].colore = coloreIntermedio;
                break;
            case 2:
                // solo un angolo coincide e devo vedere quale dei due
                posizioneSelezionata = (Math.floor(Math.random() * 100000) % 3) + 2;
                scacchiera[0][posizioneSelezionata].colore = estremoSinistroInserito ? coloreIntermedio : coloreEstremoSinistro;
                // se posizione selezionata = 2 => scegli random tra 5-2 = 3 e poi sommaci posizioneSelezionata + 1
                // quindi se esce 0 => 3
                // se esce 1 => 4
                // se esce 2 => 5
                posizioneSelezionata = (Math.floor(Math.random() * 100000) % (5 - posizioneSelezionata)) + posizioneSelezionata + 1;
                scacchiera[0][posizioneSelezionata].colore = estremoSinistroInserito ? coloreEstremoDestro : coloreIntermedio;
                break;
            case 3:
                // allora nessun angolo coincide
                posizioneSelezionata = (Math.floor(Math.random() * 100000) % 2) + 2;
                scacchiera[0][posizioneSelezionata].colore = coloreEstremoSinistro;
                posizioneSelezionata = (Math.floor(Math.random() * 100000) % (4 - posizioneSelezionata)) + posizioneSelezionata + 1;
                scacchiera[0][posizioneSelezionata].colore = coloreIntermedio;
                posizioneSelezionata = (Math.floor(Math.random() * 100000) % (5 - posizioneSelezionata)) + posizioneSelezionata + 1;
                scacchiera[0][posizioneSelezionata].colore = coloreEstremoDestro;
                break;
            default:
                console.log("ERRORE: colori.length < 1 && > 3");
        }
    }

    function generaBordoInferiore() {
        var colori = ["rosso", "verde", "blu"];
        var posizioneSelezionata;
        var estremoSinistroInserito = false;
        var coloreEstremoSinistro = scacchiera[6][0].colore;
        var coloreIntermedio;
        var coloreEstremoDestro = scacchiera[6][7].colore;
        for (var i in colori) {
            if (colori[i] !== coloreEstremoSinistro && colori[i] !== coloreEstremoDestro) {
                coloreIntermedio = colori[i];
                break;
            }
        }

        // controlliamo prima se gli angoli coincidono
        if (scacchiera[6][0].colore === scacchiera[7][1].colore) {
            // rimuoviamolo dai colori disponibili e diciamo che è stato inserito
            colori.remove(coloreEstremoSinistro);
            estremoSinistroInserito = true;
        }
        if (scacchiera[6][7].colore === scacchiera[7][6].colore) {
            // rimuoviamolo dai colori disponibili e diciamo che è stato inserito
            colori.remove(coloreEstremoDestro);
        }

        switch (colori.length) {
            case 1:
                // entrambi gli angoli coincidono e dobbiamo inserire solo il colore intermedio
                var ok = false;

                while (!ok) {

                    // ripuliamo il bordo
                    for (var i = 2; i < 6; i++) {
                        if (scacchiera[7][i].colore) {
                            delete scacchiera[7][i].colore;
                        }
                    }

                    posizioneSelezionata = (Math.floor(Math.random() * 100000) % 4) + 2;

                    if (!scacchiera[0][posizioneSelezionata].colore || scacchiera[0][posizioneSelezionata].colore !== coloreIntermedio) {
                        scacchiera[7][posizioneSelezionata].colore = coloreIntermedio;
                        ok = true;
                    }
                }
                break;

            case 2:
                // solo un angolo coincide e devo vedere quale dei due
                var ok = false;

                while (!ok) {
                    ok = true;

                    // ripuliamo il bordo
                    for (var i = 2; i < 6; i++) {
                        if (scacchiera[7][i].colore) {
                            delete scacchiera[7][i].colore;
                        }
                    }

                    posizioneSelezionata = (Math.floor(Math.random() * 100000) % 3) + 2;
                    scacchiera[7][posizioneSelezionata].colore = estremoSinistroInserito ? coloreIntermedio : coloreEstremoSinistro;
                    // se posizione selezionata = 2 => scegli random tra 5-2 = 3 e poi sommaci posizioneSelezionata + 1
                    // quindi se esce 0 => 3
                    // se esce 1 => 4
                    // se esce 2 => 5
                    posizioneSelezionata = (Math.floor(Math.random() * 100000) % (5 - posizioneSelezionata)) + posizioneSelezionata + 1;
                    scacchiera[7][posizioneSelezionata].colore = estremoSinistroInserito ? coloreEstremoDestro : coloreIntermedio;

                    // controlliamo se la combinazione selezionata va bene
                    for (var i = 2; i < 6; i++) {
                        if (scacchiera[7][i].colore && scacchiera[0][i].colore && scacchiera[7][i].colore === scacchiera[0][i].colore) {
                            ok = false;
                            break;
                        }
                    }
                }
                break;

            case 3:
                // allora nessun angolo coincide
                posizioneSelezionata = (Math.floor(Math.random() * 100000) % 2) + 2;
                if (scacchiera[0][posizioneSelezionata].colore && scacchiera[0][posizioneSelezionata].colore === coloreEstremoSinistro) {
                    posizioneSelezionata = posizioneSelezionata === 2 ? 3 : 2;
                }
                scacchiera[7][posizioneSelezionata].colore = coloreEstremoSinistro;

                posizioneSelezionata = (Math.floor(Math.random() * 100000) % (4 - posizioneSelezionata)) + posizioneSelezionata + 1;
                if (scacchiera[0][posizioneSelezionata].colore && scacchiera[0][posizioneSelezionata].colore === coloreIntermedio) {
                    if (posizioneSelezionata === 4) {
                        if (scacchiera[7][3].colore) {
                            // su questa cella c'è già il colore dell'estremo sinistro
                            // non posso fare più nulla perchè
                            // la cella 3 è appunto occupata dal colore dell'estremo sinistro
                            // mentre la cella 4 ha come estremo opposto lo stesso colore di quello che sto tentando di inserire
                            // e le uniche celle disponibili per il colore intermedio sono le celle 3 e 4
                            return false;
                        } else {
                            posizioneSelezionata = 3;
                        }
                    } else {
                        // ho selezionato la posizione 3 => posso mettere nella posizione 4
                        posizioneSelezionata = 4;
                    }
                }
                scacchiera[7][posizioneSelezionata].colore = coloreIntermedio;

                posizioneSelezionata = (Math.floor(Math.random() * 100000) % (5 - posizioneSelezionata)) + posizioneSelezionata + 1;
                if (scacchiera[0][posizioneSelezionata].colore && scacchiera[0][posizioneSelezionata].colore === coloreEstremoDestro) {
                    if (posizioneSelezionata === 5) {
                        if (scacchiera[7][4].colore) {
                            // su questa cella c'è già il colore intermedio
                            // non posso fare più nulla perchè
                            // la cella 4 è appunto occupata dal colore intermedio
                            // mentre la cella 5 ha come estremo opposto lo stesso colore di quello che sto tentando di inserire
                            // e le uniche celle disponibili per il colore dell'estremo destro sono le celle 4 e 5
                            return false;
                        } else {
                            posizioneSelezionata = 4;
                        }
                    } else {
                        // ho selezionato la posizione 4 => posso mettere nella posizione 5
                        posizioneSelezionata = 5;
                    }
                }
                scacchiera[7][posizioneSelezionata].colore = coloreEstremoDestro;
                break;

            default:
                console.log("ERRORE: colori.length < 1 && > 3");
        }

        return true;
    }

    function riempiBordoSuperiore() {
        var colori = ["rosso", "verde", "blu"];
        var posizioniDisponibili = [2, 3, 4, 5];
        var coloreSelezionato;
        var posizioneSelezionata;
        // eliminiamo prima dalle posizioniDisponibili le posizioni in cui abbiamo già inserito i 3 colori della combinazione
        for (var i = 2; i < 6; i++) {
            if (scacchiera[0][i].colore) {
                posizioniDisponibili.remove(i);
            }
        }

        // ora riempiamo il bordo sinistro
        while (posizioniDisponibili.length > 0) {
            // seleziona un colore random dai colori
            coloreSelezionato = colori[Math.floor(Math.random() * 100000) % colori.length];
            // seleziona e rimuovi una posizione random dalle posizioni rimaste
            posizioneSelezionata = posizioniDisponibili.splice(Math.floor(Math.random() * 100000) % posizioniDisponibili.length, 1)[0];
            if (scacchiera[7][posizioneSelezionata].colore && scacchiera[7][posizioneSelezionata].colore === coloreSelezionato) {
                // se sto tentando di inserire lo stesso colore presente sul bordo opposto
                // rinuncio all'inserimento e reinserisco la posizione tra quelle disponibili
                posizioniDisponibili.push(posizioneSelezionata);
            } else {
                // altrimenti inserisci semplicemente
                scacchiera[0][posizioneSelezionata].colore = coloreSelezionato;
            }
        }

    }

    function riempiBordoInferiore() {
        var colori = ["rosso", "verde", "blu"];
        var posizioniDisponibili = [2, 3, 4, 5];
        var coloreSelezionato;
        var posizioneSelezionata;
        // eliminiamo prima dalle posizioniDisponibili le posizioni in cui abbiamo già inserito i 3 colori della combinazione
        for (var i = 2; i < 6; i++) {
            if (scacchiera[7][i].colore) {
                posizioniDisponibili.remove(i);
            }
        }

        // ora riempiamo il bordo destro
        while (posizioniDisponibili.length > 0) {

            // seleziona un colore random dai colori
            coloreSelezionato = colori[Math.floor(Math.random() * 100000) % colori.length];
            // seleziona e rimuovi una posizione random dalle posizioni rimaste
            posizioneSelezionata = posizioniDisponibili.splice(Math.floor(Math.random() * 100000) % posizioniDisponibili.length, 1)[0];
            if (scacchiera[0][posizioneSelezionata].colore === coloreSelezionato) {
                // se sto tentando di inserire lo stesso colore presente sul bordo opposto
                // rinuncio all'inserimento e reinserisco la posizione tra quelle disponibili
                posizioniDisponibili.push(posizioneSelezionata);
            } else {
                // altrimenti inserisci semplicemente
                scacchiera[7][posizioneSelezionata].colore = coloreSelezionato;
            }
        }

    }

    function coloraBordi() {
        coloraBordoSinistro();
        coloraBordoDestro();
        coloraBordoSuperiore();
        coloraBordoInferiore();
    }

    function coloraBordoSinistro() {
        for (var riga = 1; riga < 7; riga++) {
            utils.addClass(scacchiera[riga][0], "bordo_" + scacchiera[riga][0].colore);
        }
    }

    function coloraBordoDestro() {
        for (var riga = 1; riga < 7; riga++) {
            utils.addClass(scacchiera[riga][7], "bordo_" + scacchiera[riga][7].colore);
        }
    }

    function coloraBordoSuperiore() {
        for (var colonna = 1; colonna < 7; colonna++) {
            utils.addClass(scacchiera[0][colonna], "bordo_" + scacchiera[0][colonna].colore);
        }
    }

    function coloraBordoInferiore() {
        for (var colonna = 1; colonna < 7; colonna++) {
            utils.addClass(scacchiera[7][colonna], "bordo_" + scacchiera[7][colonna].colore);
        }
    }


    /* INSERISCI POSSIBILI COLORI
     =============================================================================================== */

    function inserisciPossibiliColori() {
        primaPassata();
        secondaPassata();
        terzaPassata();
        secondaPassata();

//        livelloInterno();

        coloraAreaDiGioco();
    }


    function primaPassata() {

        var coloriPossibili;
        var coloreEstremoSinistroRiga;
        var coloreIntermedioRiga;
        var coloreEstremoDestroRiga;
        var coloreEstremoSuperioreColonna;
        var coloreIntermedioColonna;
        var coloreEstremoInferioreColonna;

        for (var riga = 1; riga < 7; riga++) {
            coloreEstremoSinistroRiga = scacchiera[riga][0].colore;
            coloreEstremoDestroRiga = scacchiera[riga][7].colore;
            if (coloreEstremoSinistroRiga === "rosso") {
                coloreIntermedioRiga = coloreEstremoDestroRiga === "verde" ? "blu" : "verde";
            } else if (coloreEstremoSinistroRiga === "verde") {
                coloreIntermedioRiga = coloreEstremoDestroRiga === "rosso" ? "blu" : "rosso";
            } else if (coloreEstremoSinistroRiga === "blu") {
                coloreIntermedioRiga = coloreEstremoDestroRiga === "rosso" ? "verde" : "rosso";
            }

            for (var colonna = 1; colonna < 7; colonna++) {
                coloriPossibili = ["rosso", "verde", "blu"];
                coloreEstremoSuperioreColonna = scacchiera[0][colonna].colore;
                coloreEstremoInferioreColonna = scacchiera[7][colonna].colore;

                if (coloreEstremoSuperioreColonna === "rosso") {
                    coloreIntermedioColonna = coloreEstremoInferioreColonna === "verde" ? "blu" : "verde";
                } else if (coloreEstremoSuperioreColonna === "verde") {
                    coloreIntermedioColonna = coloreEstremoInferioreColonna === "rosso" ? "blu" : "rosso";
                } else if (coloreEstremoSuperioreColonna === "blu") {
                    coloreIntermedioColonna = coloreEstremoInferioreColonna === "rosso" ? "verde" : "rosso";
                }

                if (riga === 1) {
                    // se è la prima cella a partire dall'alto
                    // allora rimuovi dai colori possibili il colore del bordo inferiore della colonnna
                    // e del colore intermedio
                    coloriPossibili.remove(coloreEstremoInferioreColonna);
                    coloriPossibili.remove(coloreIntermedioColonna);
                } else if (riga === 2) {
                    // se è la seconda cella a partire dall'alto
                    // allora rimuovi il colore del bordo inferiore della colonna
                    coloriPossibili.remove(coloreEstremoInferioreColonna);
                } else if (riga === 5) {
                    // se è la penultima cella a partire dall'alto
                    // allora rimuovi il colore del bordo superiore della colonna
                    coloriPossibili.remove(coloreEstremoSuperioreColonna);
                } else if (riga === 6) {
                    // se è l'ultima cella a partire dall'alto
                    // allora rimuovi il colore del bordo superiore della colonna
                    // e il colore intermedio
                    coloriPossibili.remove(coloreEstremoSuperioreColonna);
                    coloriPossibili.remove(coloreIntermedioColonna);
                }


                if (colonna === 1) {
                    // se è la prima cella a partire da sinistra
                    // allora rimuovi dai colori possibili l'estremo destro della riga
                    // e il colore intermedio
                    coloriPossibili.remove(coloreEstremoDestroRiga);
                    coloriPossibili.remove(coloreIntermedioRiga);
                } else if (colonna === 2) {
                    // se è la seconda cella a partire da sinistra
                    // allora rimuovi dai colori possibili l'estremo destro della riga
                    coloriPossibili.remove(coloreEstremoDestroRiga);
                } else if (colonna === 5) {
                    // se è la penultima cella a partire da sinistra
                    // allora rimuovi dai colori possibili l'estremo sinistro della riga
                    coloriPossibili.remove(coloreEstremoSinistroRiga);
                } else if (colonna === 6) {
                    // se è l'ultima cella a partire da sinistra
                    // allora rimuovi dai colori possibili l'estremo sinistro della riga
                    // e il colore intermedio
                    coloriPossibili.remove(coloreEstremoSinistroRiga);
                    coloriPossibili.remove(coloreIntermedioRiga);
                }

                scacchiera[riga][colonna].coloriPossibili = coloriPossibili;
            }
        }
    }

    // si occupa di eliminare i possibili colori tali che
    //      - l'intermedio compare PRIMA del primo estremo sinistro o dopo l'ultimo estremo destro
    //      - l'estremo sinistro compare dopo l'ultimo intermedio e/o l'ultimo estremo destro
    //      - l'estremo destro compare prima del primo estremo sinistro e/o del primo intermedio
    function secondaPassata() {

        for (var riga = 1; riga < 7; riga++) {
            secondaPassataRiga(riga);
        }

        for (var colonna = 1; colonna < 7; colonna++) {
            secondaPassataColonna(colonna);
        }

//        secondaPassataRiga(1);
//        secondaPassataRiga(6);
//        secondaPassataColonna(1);
//        secondaPassataColonna(6);

    }

    function secondaPassataRiga(riga) {


        var coloreEstremoSinistro = scacchiera[riga][0].colore;
        var coloreIntermedio;
        var coloreEstremoDestro = scacchiera[riga][7].colore;

        if (coloreEstremoSinistro === "rosso") {
            coloreIntermedio = coloreEstremoDestro === "verde" ? "blu" : "verde";
        } else if (coloreEstremoSinistro === "verde") {
            coloreIntermedio = coloreEstremoDestro === "rosso" ? "blu" : "rosso";
        } else if (coloreEstremoSinistro === "blu") {
            coloreIntermedio = coloreEstremoDestro === "rosso" ? "verde" : "rosso";
        }

        var posizionePrimaOccorrenzaEstremoSinistro;
        var posizionePrimaOccorrenzaIntermedio;
        var posizioneUltimaOccorrenzaIntermedio;
        var posizioneUltimaOccorrenzaEstremoDestro;

        for (var colonna = 1; colonna < 7; colonna++) {
            if (!posizionePrimaOccorrenzaEstremoSinistro && scacchiera[riga][colonna].coloriPossibili.indexOf(coloreEstremoSinistro) !== -1) {
                posizionePrimaOccorrenzaEstremoSinistro = colonna;
            } else if (posizionePrimaOccorrenzaEstremoSinistro && !posizionePrimaOccorrenzaIntermedio
                    && scacchiera[riga][colonna].coloriPossibili.indexOf(coloreIntermedio) !== -1) {
                posizionePrimaOccorrenzaIntermedio = colonna;
            }
        }

        for (var colonna = 6; colonna > 1; colonna--) {
            if (!posizioneUltimaOccorrenzaEstremoDestro && scacchiera[riga][colonna].coloriPossibili.indexOf(coloreEstremoDestro) !== -1) {
                posizioneUltimaOccorrenzaEstremoDestro = colonna;
            } else if (posizioneUltimaOccorrenzaEstremoDestro && !posizioneUltimaOccorrenzaIntermedio
                    && scacchiera[riga][colonna].coloriPossibili.indexOf(coloreIntermedio) !== -1) {
                posizioneUltimaOccorrenzaIntermedio = colonna;
            }
        }

        // ora che abbiamo identificato le prime e le ultime occorrenze di quello che ci interessa
        // possiamo rimuovere i colori possibili in eccesso
        for (var colonna = 1; colonna < 7; colonna++) {

            // l'estremo sinistro compare dopo l'ultimo intermedio e/o l'ultimo estremo destro
            if (scacchiera[riga][colonna].coloriPossibili.indexOf(coloreEstremoSinistro) !== -1
                    && (colonna >= posizioneUltimaOccorrenzaIntermedio || colonna >= posizioneUltimaOccorrenzaEstremoDestro)) {
                scacchiera[riga][colonna].coloriPossibili.remove(coloreEstremoSinistro);
            }
            // l'estremo destro compare prima del primo estremo sinistro e/o del primo intermedio
            if (scacchiera[riga][colonna].coloriPossibili.indexOf(coloreEstremoDestro) !== -1
                    && (colonna <= posizionePrimaOccorrenzaIntermedio || colonna <= posizionePrimaOccorrenzaEstremoSinistro)) {
                scacchiera[riga][colonna].coloriPossibili.remove(coloreEstremoDestro);
            }
            // l'inermedio compare PRIMA del primo estremo sinistro o dopo l'ultimo estremo destro
            if (scacchiera[riga][colonna].coloriPossibili.indexOf(coloreIntermedio) !== -1
                    && (colonna <= posizionePrimaOccorrenzaEstremoSinistro || colonna >= posizioneUltimaOccorrenzaEstremoDestro)) {
                scacchiera[riga][colonna].coloriPossibili.remove(coloreIntermedio);
            }
        }

    }

    function secondaPassataColonna(colonna) {
        var coloreEstremoSuperiore = scacchiera[0][colonna].colore;
        var coloreIntermedio;
        var coloreEstremoInferiore = scacchiera[7][colonna].colore;

        if (coloreEstremoSuperiore === "rosso") {
            coloreIntermedio = coloreEstremoInferiore === "verde" ? "blu" : "verde";
        } else if (coloreEstremoSuperiore === "verde") {
            coloreIntermedio = coloreEstremoInferiore === "rosso" ? "blu" : "rosso";
        } else if (coloreEstremoSuperiore === "blu") {
            coloreIntermedio = coloreEstremoInferiore === "rosso" ? "verde" : "rosso";
        }

        var posizionePrimaOccorrenzaEstremoSuperiore;
        var posizionePrimaOccorrenzaIntermedio;
        var posizioneUltimaOccorrenzaIntermedio;
        var posizioneUltimaOccorrenzaEstremoInferiore;

        for (var riga = 1; riga < 7; riga++) {
            if (!posizionePrimaOccorrenzaEstremoSuperiore && scacchiera[riga][colonna].coloriPossibili.indexOf(coloreEstremoSuperiore) !== -1) {
                posizionePrimaOccorrenzaEstremoSuperiore = riga;
            } else if (posizionePrimaOccorrenzaEstremoSuperiore && !posizionePrimaOccorrenzaIntermedio
                    && scacchiera[riga][colonna].coloriPossibili.indexOf(coloreIntermedio) !== -1) {
                posizionePrimaOccorrenzaIntermedio = riga;
            }
        }

        for (var riga = 6; riga > 1; riga--) {
            if (!posizioneUltimaOccorrenzaEstremoInferiore && scacchiera[riga][colonna].coloriPossibili.indexOf(coloreEstremoInferiore) !== -1) {
                posizioneUltimaOccorrenzaEstremoInferiore = riga;
            } else if (posizioneUltimaOccorrenzaEstremoInferiore && !posizioneUltimaOccorrenzaIntermedio
                    && scacchiera[riga][colonna].coloriPossibili.indexOf(coloreIntermedio) !== -1) {
                posizioneUltimaOccorrenzaIntermedio = riga;
            }
        }

        // ora che abbiamo identificato le prime e le ultime occorrenze di quello che ci interessa
        // possiamo rimuovere i colori possibili in eccesso
        for (var riga = 1; riga < 7; riga++) {

            // l'estremo sinistro compare dopo l'ultimo intermedio e/o l'ultimo estremo destro
            if (scacchiera[riga][colonna].coloriPossibili.indexOf(coloreEstremoSuperiore) !== -1
                    && (riga >= posizioneUltimaOccorrenzaIntermedio || riga >= posizioneUltimaOccorrenzaEstremoInferiore)) {
                scacchiera[riga][colonna].coloriPossibili.remove(coloreEstremoSuperiore);
            }
            // l'estremo destro compare prima del primo estremo sinistro e/o del primo intermedio
            if (scacchiera[riga][colonna].coloriPossibili.indexOf(coloreEstremoInferiore) !== -1
                    && (riga <= posizionePrimaOccorrenzaIntermedio || riga <= posizionePrimaOccorrenzaEstremoSuperiore)) {
                scacchiera[riga][colonna].coloriPossibili.remove(coloreEstremoInferiore);
            }
            // l'inermedio compare PRIMA del primo estremo sinistro o dopo l'ultimo estremo destro
            if (scacchiera[riga][colonna].coloriPossibili.indexOf(coloreIntermedio) !== -1
                    && (riga <= posizionePrimaOccorrenzaEstremoSuperiore || riga >= posizioneUltimaOccorrenzaEstremoInferiore)) {
                scacchiera[riga][colonna].coloriPossibili.remove(coloreIntermedio);
            }
        }

    }

    // in tutte quelle righe/colonne che hanno una singola occorrenza di un colore
    // coloriamo la relativa cella ed eliminiamo dalla colonna/riga perpendicolare a quella che sto controllato
    // il colore dai possibili colori
    function terzaPassata() {
        terzaPassataRiga(1);
        terzaPassataRiga(6);
        terzaPassataColonna(1);
        terzaPassataColonna(6);

//        terzaPassataRiga(2);
//        terzaPassataRiga(5);
//        terzaPassataColonna(2);
//        terzaPassataColonna(5);
//
//        terzaPassataRiga(3);
//        terzaPassataRiga(4);
//        terzaPassataColonna(3);
//        terzaPassataColonna(4);
    }

    function terzaPassataRiga(riga) {
        var colori = ["rosso", "verde", "blu"];
        var posizioni;

        var coloreEstremoSinistro = scacchiera[riga][0].colore;
        var coloreIntermedio;
        var coloreEstremoDestro = scacchiera[riga][7].colore;

        if (coloreEstremoSinistro === "rosso") {
            coloreIntermedio = coloreEstremoDestro === "verde" ? "blu" : "verde";
        } else if (coloreEstremoSinistro === "verde") {
            coloreIntermedio = coloreEstremoDestro === "rosso" ? "blu" : "rosso";
        } else if (coloreEstremoSinistro === "blu") {
            coloreIntermedio = coloreEstremoDestro === "rosso" ? "verde" : "rosso";
        }

        for (var i = 0; i < colori.length; i++) {
            posizioni = [];

            for (var colonna = 1; colonna < 7; colonna++) {

                if (scacchiera[riga][colonna].coloriPossibili.indexOf(colori[i]) !== -1) {
                    posizioni.push(colonna);
                }
            }

            if (posizioni.length === 1) {
                // il colore compare una sola volta
                // allora coloro quella cella di quel colore
                scacchiera[riga][posizioni[0]].coloriPossibili = [];
                scacchiera[riga][posizioni[0]].colore = colori[i];

                // elimino dalla tutta la colonna il colore appena inserito
                for (var r = 1; r < 7; r++) {
                    scacchiera[r][posizioni[0]].coloriPossibili.remove(colori[i]);
                }
            }
        }
    }

    function terzaPassataColonna(colonna) {
        var colori = ["rosso", "verde", "blu"];
        var posizioni;

        var coloreEstremoSuperiore = scacchiera[0][colonna].colore;
        var coloreIntermedio;
        var coloreEstremoInferiore = scacchiera[7][colonna].colore;

        if (coloreEstremoSuperiore === "rosso") {
            coloreIntermedio = coloreEstremoInferiore === "verde" ? "blu" : "verde";
        } else if (coloreEstremoSuperiore === "verde") {
            coloreIntermedio = coloreEstremoInferiore === "rosso" ? "blu" : "rosso";
        } else if (coloreEstremoSuperiore === "blu") {
            coloreIntermedio = coloreEstremoInferiore === "rosso" ? "verde" : "rosso";
        }

        for (var i = 0; i < colori.length; i++) {
            posizioni = [];

            for (var riga = 1; riga < 7; riga++) {

                if (scacchiera[riga][colonna].coloriPossibili.indexOf(colori[i]) !== -1) {
                    posizioni.push(riga);
                }
            }

            if (posizioni.length === 1) {
                // il colore compare una sola volta
                // allora coloro quella cella di quel colore
                scacchiera[posizioni[0]][colonna].coloriPossibili = [];
                scacchiera[posizioni[0]][colonna].colore = colori[i];

                // elimino dalla tutta la colonna il colore appena inserito
                for (var c = 1; c < 7; c++) {
                    scacchiera[posizioni[0]][c].coloriPossibili.remove(colori[i]);
                }
            }
        }
    }

    function livelloInterno() {
        secondaPassataLivelloInterno();
        terzaPassataLivelloInterno();
    }

    function secondaPassataLivelloInterno() {

        secondaPassataLivelloInternoRiga(2);
        secondaPassataLivelloInternoRiga(5);
        secondaPassataLivelloInternoColonna(2);
        secondaPassataLivelloInternoColonna(5);

    }

    function secondaPassataLivelloInternoRiga(riga) {
        var coloreEstremoSinistro = scacchiera[riga][0].colore;
        var coloreIntermedio;
        var coloreEstremoDestro = scacchiera[riga][7].colore;

        if (coloreEstremoSinistro === "rosso") {
            coloreIntermedio = coloreEstremoDestro === "verde" ? "blu" : "verde";
        } else if (coloreEstremoSinistro === "verde") {
            coloreIntermedio = coloreEstremoDestro === "rosso" ? "blu" : "rosso";
        } else if (coloreEstremoSinistro === "blu") {
            coloreIntermedio = coloreEstremoDestro === "rosso" ? "verde" : "rosso";
        }

        var posizionePrimaOccorrenzaEstremoSinistro;
        var posizionePrimaOccorrenzaIntermedio;
        var posizioneUltimaOccorrenzaIntermedio;
        var posizioneUltimaOccorrenzaEstremoDestro;

        for (var colonna = 1; colonna < 7; colonna++) {
            if ((!posizionePrimaOccorrenzaEstremoSinistro && scacchiera[riga][colonna].coloriPossibili.indexOf(coloreEstremoSinistro) !== -1)
                    || (!posizionePrimaOccorrenzaEstremoSinistro && scacchiera[riga][colonna].colore && scacchiera[riga][colonna].colore === coloreEstremoSinistro)) {
                posizionePrimaOccorrenzaEstremoSinistro = colonna;
            } else if (posizionePrimaOccorrenzaEstremoSinistro && !posizionePrimaOccorrenzaIntermedio
                    && scacchiera[riga][colonna].coloriPossibili.indexOf(coloreIntermedio) !== -1) {
                posizionePrimaOccorrenzaIntermedio = colonna;
            }
        }

        for (var colonna = 6; colonna > 1; colonna--) {
            if (!posizioneUltimaOccorrenzaEstremoDestro && scacchiera[riga][colonna].coloriPossibili.indexOf(coloreEstremoDestro) !== -1
                    || (!posizioneUltimaOccorrenzaEstremoDestro && scacchiera[riga][colonna].colore && scacchiera[riga][colonna].colore === coloreEstremoDestro)) {
                posizioneUltimaOccorrenzaEstremoDestro = colonna;
            } else if (posizioneUltimaOccorrenzaEstremoDestro && !posizioneUltimaOccorrenzaIntermedio
                    && scacchiera[riga][colonna].coloriPossibili.indexOf(coloreIntermedio) !== -1) {
                posizioneUltimaOccorrenzaIntermedio = colonna;
            }
        }

        // ora che abbiamo identificato le prime e le ultime occorrenze di quello che ci interessa
        // possiamo rimuovere i colori possibili in eccesso
        for (var colonna = 2; colonna < 6; colonna++) {

            // l'estremo sinistro compare dopo l'ultimo intermedio e/o l'ultimo estremo destro
            if (scacchiera[riga][colonna].coloriPossibili.indexOf(coloreEstremoSinistro) !== -1
                    && (colonna >= posizioneUltimaOccorrenzaIntermedio || colonna >= posizioneUltimaOccorrenzaEstremoDestro)) {
                scacchiera[riga][colonna].coloriPossibili.remove(coloreEstremoSinistro);
            }
            // l'estremo destro compare prima del primo estremo sinistro e/o del primo intermedio
            if (scacchiera[riga][colonna].coloriPossibili.indexOf(coloreEstremoDestro) !== -1
                    && (colonna <= posizionePrimaOccorrenzaIntermedio || colonna <= posizionePrimaOccorrenzaEstremoSinistro)) {
                scacchiera[riga][colonna].coloriPossibili.remove(coloreEstremoDestro);
            }
            // l'inermedio compare PRIMA del primo estremo sinistro o dopo l'ultimo estremo destro
            if (scacchiera[riga][colonna].coloriPossibili.indexOf(coloreIntermedio) !== -1
                    && (colonna <= posizionePrimaOccorrenzaEstremoSinistro || colonna >= posizioneUltimaOccorrenzaEstremoDestro)) {
                scacchiera[riga][colonna].coloriPossibili.remove(coloreIntermedio);
            }
        }
    }

    function secondaPassataLivelloInternoColonna(colonna) {
        var coloreEstremoSuperiore = scacchiera[0][colonna].colore;
        var coloreIntermedio;
        var coloreEstremoInferiore = scacchiera[7][colonna].colore;

        if (coloreEstremoSuperiore === "rosso") {
            coloreIntermedio = coloreEstremoInferiore === "verde" ? "blu" : "verde";
        } else if (coloreEstremoSuperiore === "verde") {
            coloreIntermedio = coloreEstremoInferiore === "rosso" ? "blu" : "rosso";
        } else if (coloreEstremoSuperiore === "blu") {
            coloreIntermedio = coloreEstremoInferiore === "rosso" ? "verde" : "rosso";
        }

        var posizionePrimaOccorrenzaEstremoSuperiore;
        var posizionePrimaOccorrenzaIntermedio;
        var posizioneUltimaOccorrenzaIntermedio;
        var posizioneUltimaOccorrenzaEstremoInferiore;

        for (var riga = 1; riga < 7; riga++) {
            if ((!posizionePrimaOccorrenzaEstremoSuperiore && scacchiera[riga][colonna].coloriPossibili.indexOf(coloreEstremoSuperiore) !== -1)
                    || (!posizionePrimaOccorrenzaEstremoSuperiore && scacchiera[riga][colonna].colore && scacchiera[riga][colonna].colore === coloreEstremoSuperiore)) {
                posizionePrimaOccorrenzaEstremoSuperiore = riga;
            } else if (posizionePrimaOccorrenzaEstremoSuperiore && !posizionePrimaOccorrenzaIntermedio
                    && scacchiera[riga][colonna].coloriPossibili.indexOf(coloreIntermedio) !== -1) {
                posizionePrimaOccorrenzaIntermedio = riga;
            }
        }

        for (var riga = 6; riga > 1; riga--) {
            if (!posizioneUltimaOccorrenzaEstremoInferiore && scacchiera[riga][colonna].coloriPossibili.indexOf(coloreEstremoInferiore) !== -1
                    || (!posizioneUltimaOccorrenzaEstremoInferiore && scacchiera[riga][colonna].colore && scacchiera[riga][colonna].colore === coloreEstremoInferiore)) {
                posizioneUltimaOccorrenzaEstremoInferiore = riga;
            } else if (posizioneUltimaOccorrenzaEstremoInferiore && !posizioneUltimaOccorrenzaIntermedio
                    && scacchiera[riga][colonna].coloriPossibili.indexOf(coloreIntermedio) !== -1) {
                posizioneUltimaOccorrenzaIntermedio = riga;
            }
        }

        // ora che abbiamo identificato le prime e le ultime occorrenze di quello che ci interessa
        // possiamo rimuovere i colori possibili in eccesso
        for (var riga = 2; riga < 6; riga++) {

            // l'estremo sinistro compare dopo l'ultimo intermedio e/o l'ultimo estremo destro
            if (scacchiera[riga][colonna].coloriPossibili.indexOf(coloreEstremoSuperiore) !== -1
                    && (riga >= posizioneUltimaOccorrenzaIntermedio || riga >= posizioneUltimaOccorrenzaEstremoInferiore)) {
                scacchiera[riga][colonna].coloriPossibili.remove(coloreEstremoSuperiore);
            }
            // l'estremo destro compare prima del primo estremo sinistro e/o del primo intermedio
            if (scacchiera[riga][colonna].coloriPossibili.indexOf(coloreEstremoInferiore) !== -1
                    && (riga <= posizionePrimaOccorrenzaIntermedio || riga <= posizionePrimaOccorrenzaEstremoSuperiore)) {
                scacchiera[riga][colonna].coloriPossibili.remove(coloreEstremoInferiore);
            }
            // l'inermedio compare PRIMA del primo estremo sinistro o dopo l'ultimo estremo destro
            if (scacchiera[riga][colonna].coloriPossibili.indexOf(coloreIntermedio) !== -1
                    && (riga <= posizionePrimaOccorrenzaEstremoSuperiore || riga >= posizioneUltimaOccorrenzaEstremoInferiore)) {
                scacchiera[riga][colonna].coloriPossibili.remove(coloreIntermedio);
            }
        }

    }

    function terzaPassataLivelloInterno() {

        for (var i = 0; i < 4; i++) {
            terzaPassataLivelloInternoRiga(2);
            terzaPassataLivelloInternoRiga(5);
            terzaPassataLivelloInternoColonna(2);
            terzaPassataLivelloInternoColonna(5);
        }
    }

    function terzaPassataLivelloInternoRiga(riga) {
        var colori = ["rosso", "verde", "blu"];
        var posizioni;

        var coloreEstremoSinistro = scacchiera[riga][0].colore;
        var coloreIntermedio;
        var coloreEstremoDestro = scacchiera[riga][7].colore;

        if (coloreEstremoSinistro === "rosso") {
            coloreIntermedio = coloreEstremoDestro === "verde" ? "blu" : "verde";
        } else if (coloreEstremoSinistro === "verde") {
            coloreIntermedio = coloreEstremoDestro === "rosso" ? "blu" : "rosso";
        } else if (coloreEstremoSinistro === "blu") {
            coloreIntermedio = coloreEstremoDestro === "rosso" ? "verde" : "rosso";
        }

        for (var i = 0; i < colori.length; i++) {
            posizioni = [];

            for (var colonna = 1; colonna < 7; colonna++) {

                if (scacchiera[riga][colonna].coloriPossibili.indexOf(colori[i]) !== -1) {
                    posizioni.push(colonna);
                }
            }

            if (posizioni.length === 1) {
                // il colore compare una sola volta
                // allora coloro quella cella di quel colore
                scacchiera[riga][posizioni[0]].coloriPossibili = [];
                scacchiera[riga][posizioni[0]].colore = colori[i];

                // elimino dalla tutta la colonna il colore appena inserito
                for (var r = 1; r < 7; r++) {
                    scacchiera[r][posizioni[0]].coloriPossibili.remove(colori[i]);
                }
            }
        }
    }

    function terzaPassataLivelloInternoColonna(colonna) {
        var colori = ["rosso", "verde", "blu"];
        var posizioni;

        var coloreEstremoSuperiore = scacchiera[0][colonna].colore;
        var coloreIntermedio;
        var coloreEstremoInferiore = scacchiera[7][colonna].colore;

        if (coloreEstremoSuperiore === "rosso") {
            coloreIntermedio = coloreEstremoInferiore === "verde" ? "blu" : "verde";
        } else if (coloreEstremoSuperiore === "verde") {
            coloreIntermedio = coloreEstremoInferiore === "rosso" ? "blu" : "rosso";
        } else if (coloreEstremoSuperiore === "blu") {
            coloreIntermedio = coloreEstremoInferiore === "rosso" ? "verde" : "rosso";
        }

        for (var i = 0; i < colori.length; i++) {
            posizioni = [];

            for (var riga = 1; riga < 7; riga++) {

                if (scacchiera[riga][colonna].coloriPossibili.indexOf(colori[i]) !== -1) {
                    posizioni.push(riga);
                }
            }

            if (posizioni.length === 1) {
                // il colore compare una sola volta
                // allora coloro quella cella di quel colore
                scacchiera[posizioni[0]][colonna].coloriPossibili = [];
                scacchiera[posizioni[0]][colonna].colore = colori[i];

                // elimino dalla tutta la colonna il colore appena inserito
                for (var c = 1; c < 7; c++) {
                    scacchiera[posizioni[0]][c].coloriPossibili.remove(colori[i]);
                }
            }
        }
    }




    function coloraAreaDiGioco() {
        for (var riga = 1; riga < 7; riga++) {
            for (var colonna = 1; colonna < 7; colonna++) {

                if (scacchiera[riga][colonna].colore) {
                    utils.addClass(scacchiera[riga][colonna], "cella_" + scacchiera[riga][colonna].colore);
                } else {
                    if (scacchiera[riga][colonna].coloriPossibili.indexOf("rosso") !== -1) {
                        utils.addClass(scacchiera[riga][colonna], "r");
                    }
                    if (scacchiera[riga][colonna].coloriPossibili.indexOf("verde") !== -1) {
                        utils.addClass(scacchiera[riga][colonna], "g");
                    }
                    if (scacchiera[riga][colonna].coloriPossibili.indexOf("blu") !== -1) {
                        utils.addClass(scacchiera[riga][colonna], "b");
                    }
                }
            }
        }

    }





    return{
        avvia: function () {
            aggiungiHandler();
            generaBordiRandom();
            inserisciPossibiliColori();
        }
    };
}

var gioco = new Gioco();
gioco.avvia();






