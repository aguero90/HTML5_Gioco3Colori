
function MyUtils() {

    /* per rendere disponibile la funzione contains anche su chrome */
    if (!('contains' in String.prototype)) {
        String.prototype.contains = function (str, startIndex) {
            return -1 !== String.prototype.indexOf.call(this, str, startIndex);
        };
    }

    Array.prototype.remove = function (el) {
        if (this.indexOf(el) !== -1) {
            this.splice(this.indexOf(el), 1);
        }
    };

    /* ciò che verrà visto al momento della creazione */
    return{
        /**
         * Aggiunge una classe ad un elemento del DOM
         * @param {Element} elemento l'elemento del DOM a cui aggiungere la classe
         * @param {String} classe classe da aggiungere a <code>elemento</code>
         */
        addClass: function (elemento, classe) {
            elemento.setAttribute("class", elemento.getAttribute("class") + " " + classe);
        },
        /**
         * Rimuove una classe da un elemento del DOM
         * @param {Element} elemento l'elemento del DOM a cui rimuovere la classe
         * @param {String} classe classe da rimuovere <code>elemento</code>
         */
        removeClass: function (elemento, classe) {
            elemento.setAttribute("class", elemento.getAttribute("class").replace(classe, ""));
        },
        /**
         * Controlla se un elemento ha una classe o meno
         * @param {Element} elemento l'elemento del DOM su cui controllare la presenza della classe
         * @param {String} classe la classe da controllare 
         * @returns {boolean} true se <code>elemento</code> ha la classe <code>classe</classe>, false altrimenti
         */
        haveClass: function (elemento, classe) {
            return elemento.getAttribute("class").contains(classe);
        },
        /**
         * Se un elemento ha la classe <code>classe</code> questa viene rimossa dall'elemento, altrimenti viene aggiunta
         * @param {Element} elemento l'elemento da cui rimuovere/aggiungere la classe
         * @param {type} classe la classe da rimuovere/aggiungere all'elemento
         */
        toggleClass: function (elemento, classe) {
            if (this.haveClass(elemento, classe)) {
                this.removeClass(elemento, classe);
            }
            else {
                this.addClass(elemento, classe);
            }
        },
        /* <DA QUI INIZIANO AD ESSERCI METODI NON GENERICI MA MIRATI AL GIOCO DEI 3 COLORI > */
        /**
         * Trasforma una lista di 64 nodi in un'array bidimensionale 8*8 così da simulare meglio una scacchiera
         * @param {type} listaDiNodi lista di nodi del DOM che formano la scacchiera
         * @returns {Array} 
         */
        nodeList2Matrix: function (listaDiNodi) {
            var result = new Array(8);
            var cont = 0;
            for (var riga = 0; riga < 8; riga++) {
                result[riga] = new Array(8);
                for (var colonna = 0; colonna < 8; colonna++) {
                    result[riga][colonna] = listaDiNodi[cont];
                    cont++;
                }
            }
            return result;
        }
    };
}




