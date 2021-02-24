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

// converte il Markdown in HTML e lo aggiunge al corpo
function writeMarkdown(text) {
    // crea l'oggetto per il rendering e converte il Markdown
    var md = window.markdownit();
    var result = md.render(text);
    
    //console.log(result.replace(/&lt;br&gt;/g, "<br>"));

    // elimina l'escaping dei br
    result = result.replace(/&lt;br&gt;/g, "<br>");
    
    // aggiunge un nuovo div con il contenuto
    var tmp = document.createElement('div');
    tmp.innerHTML = result;
    document.body.appendChild(tmp);
    document.body.appendChild(document.createElement('hr'));

}

function getMdFromUrl(url) {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // QUI VA CHIAMATA LA FUNZIONE CHE DEVE AVVIARSI ALL'AVVENUTA RISPOSTA
            writeMarkdown(this.responseText);
        }
    };

    xhttp.open("GET", url, false);
    xhttp.send();
}

function parseResponse(risposta) {
    var parsedData = JSON.parse(risposta);

    parsedData.sort(compare);

    console.log(parsedData);
    
    parsedData.forEach(element => {
        console.log(element['name']);
        console.log(element['download_url']);

        getMdFromUrl(element['download_url']);
    });

    

}

function callGitHubAPI() {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // QUI VA CHIAMATA LA FUNZIONE CHE DEVE AVVIARSI ALL'AVVENUTA RISPOSTA
            parseResponse(this.responseText);
        }
    };

    xhttp.open("GET", "https://api.github.com/repos/Typing-Monkeys/Il-Magico-Viaggio-di-Franchino/contents/pagine?ref=main", true);
    xhttp.send();
}


var populate = function() {callGitHubAPI()};
