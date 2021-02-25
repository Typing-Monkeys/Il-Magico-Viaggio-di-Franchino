// questa funzione serve per ordinare l'array che ritorna la 
// chiamata AJAX all'API di GitHub.
// Ordina i record in modo crescente in base al numero del giorno
// Ogni elemento ha l'attributo nome fatto come segue:
//  Giorno 23.md
function compare(a, b) {
    // prendo il numero del giorno del primo operando
    var nome_a = a['name']
    nome_a = nome_a.substring(7, nome_a.lastIndexOf('.'));
    
    // prendo il numero del giorno del secondo operando
    var nome_b = b['name'];
    nome_b = nome_b.substring(7, nome_b.lastIndexOf('.'));
    
    // li converto ad intero per il confronto
    var intA = parseInt(nome_a);
    var intB = parseInt(nome_b);

    //console.log('a ' + nome_a);
    //console.log('b ' + nome_b);

    // viene eseguito il confronto
    if (intA < intB) {
        return -1;
    }

    if (intA > intB) {
        return 1;
    }

    return 0;
}

// sostituisce il nome dell'emoji con la rispettiva emoji
function renderEmoji(text) {
    var result;

    result = text.replace(/:wolf:/g, "&#128058")    // lupo
                .replace(/:heart:/g, "&#x1F9E1;")   // cuore
                .replace(/:dragon:/g, "&#128009")   // drago
                .replace(/:skull_and_crossbones:/g, "&#128128;")   // teschio e spade
                .replace(/:evergreen_tree:/g, "&#127794;")   // sempreverde
                .replace(/:astonished:/g, "&#128562")   // sbalordito
    ;

    return result;
}

// converte il Markdown in HTML e lo aggiunge al corpo
function writeMarkdown(text) {
    // crea l'oggetto per il rendering e converte il Markdown
    var md = window.markdownit();
    var result = md.render(text);
    
    // elimina l'escaping dei br
    result = result.replace(/&lt;br&gt;/g, "<br>");
    
    // renderizza le emoki
    result = renderEmoji(result);

    // aggiunge un nuovo div con il contenuto
    var tmp = document.createElement('div');
    tmp.innerHTML = result;

    document.getElementById("box").appendChild(tmp);
    document.getElementById("box").appendChild(document.createElement('hr'));

}

// prende il contenuto del file che gli viene passato
// e chiama la funzione per scriverlo in MD
function getMdFromUrl(url) {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // scrive il contenuto nel body convertendolo da MD ad HTML
            writeMarkdown(this.responseText);
        }
    };

    xhttp.open("GET", url, false);  // questa chiamata non e' asincrona perche'
    xhttp.send();                   // potrebbe rovinare l'ordine di visualizzazione
}

// converte la stringa JSON contenente tutti i file della cartella
// in un array e avvia la procedura lettura del file e parsing
function parseResponse(risposta) {
    // decodifica il JSON
    var parsedData = JSON.parse(risposta);

    // ordina l'array in base al nome del file
    parsedData.sort(compare);

    //console.log(parsedData);
    
    // avvia la procedura di parsing per ogni elemento
    parsedData.forEach(element => {
        //console.log(element['name']);
        //console.log(element['download_url']);

        getMdFromUrl(element['download_url']);
    });

    

}

// prende il contenuto della cartella pagine della repo di GitHub
// ed avvia la procedura di conversione e parsing MD
function callGitHubAPI() {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // converte la stringa JSON in array e converte ed effettua il parsing da MD ad HTML
            // per ogni file
            parseResponse(this.responseText);
        }
    };

    xhttp.open("GET", "https://api.github.com/repos/Typing-Monkeys/Il-Magico-Viaggio-di-Franchino/contents/pagine?ref=main", true);
    xhttp.send();
}

// funzione per avviare tutta la procedura
var populate = function() {callGitHubAPI()};


// wolf face &#128058