import { characters } from "./char.js";

var nLogo = characters.filter(function(char) {
    return char.manga.includes('Naruto');
});

var bLogo = characters.filter(function(char) {
    return char.manga.includes('Boruto');
});

var urlParams = new URLSearchParams(window.location.search);
var switchValue = urlParams.get('switchValue');
var useOnlyNaruto = switchValue === 'true';
var real;
var attemps = 0;

if(useOnlyNaruto) { real = nLogo[Math.floor(Math.random() * nLogo.length)]; }
else { real = bLogo[Math.floor(Math.random() * bLogo.length)]; }

console.log("--->",useOnlyNaruto, real);

var image = document.getElementById("image-found");
image.src = real.imgpath

function HandleGuess(guess) {
    if(GetCharacter(guess) === null) { console.log("No character:", guess); return; }

    document.getElementById('suggestions-list').style.display = 'none';
    document.getElementById('guess-input').value = '';

    attemps++;

    var blur = 30 - attemps*5;
    if(blur < 10) { blur = 10; }
    image.style.filter = `blur(${blur}px)`;

    AddRow(guess);
}

function GetCharacter(name) {
    var index = 0;
    for (let i = 0; i < characters.length; i++) {
        if(characters[i].alias.includes(name)) {
            break;
        }
        index++;
    }

    return characters[index];
}

function ShowSuggestions(suggestions) {
    var sugg = document.querySelector('.suggestions-list');
    sugg.innerHTML = ''; // supprime ancien sugg

    // Affichez les nouvelles suggestions
    suggestions.forEach(function(character) {
        var charInfo = GetCharacter(character)

        if(!charInfo) console.log(character);

        var newSugg = document.createElement('div');
        var newSpan = document.createElement("span");

        newSpan.textContent = character;

        newSugg.appendChild(newSpan);

        sugg.appendChild(newSugg); 
    });

    sugg.style.display = 'block'; // Afficher la liste de suggestions
}

function FilterCharacters(text) {
    text = text.toLowerCase().trim();
    return characters.filter(function(character) {
        if (character.nom.toLowerCase().startsWith(text)) {
            return true;
        }

        for (var i = 0; i < character.alias.length; i++) {
            if (character.alias[i].toLowerCase().startsWith(text)) {
                return true;
            }
        }
        return false;
    }).map(function(character) {
        return character.nom; 
    });
}

function HandleInputEvent(event) {
    var guess = this.value.trim(); // Récupérer la valeur de la barre de recherche en supprimant les espaces vides au début et à la fin
    var sugg = document.getElementById('suggestions-list');

    if (guess === '') {
        sugg.innerHTML = '';
        sugg.style.display = 'none';
    } else {
        var charFiltered = FilterCharacters(guess);
        ShowSuggestions(charFiltered);

        if(document.querySelectorAll('.suggestions-list div').length <= 0) { sugg.style.display = 'none'; }
        else { sugg.style.display = 'block'; }   
    }
}

function HandleKeyDownEvent(event) {
    var sugg = document.getElementById('suggestions-list');

    if (event.keyCode === 13 && sugg.style.display !== 'none') { // Enter + sugg existe
        var character = document.querySelector('.suggestions-list div');

        if (character) {
            HandleGuess(character.textContent)
            sugg.style.display = 'none';
        }
    }
}

// Ajouter des gestionnaires d'événements pour les événements "input" et "keydown" dans la barre de recherche
document.getElementById('guess-input').addEventListener('input', HandleInputEvent);
document.getElementById('guess-input').addEventListener('keydown', HandleKeyDownEvent);

// Écouteur d'événement pour les clics sur la liste des suggestions
document.getElementById('suggestions-list').addEventListener('click', function(event) {
    if(event.target && (event.target.nodeName === 'DIV' || event.target.nodeName === 'SPAN')) {
        document.getElementById('guess-input').value = event.target.textContent;
        this.style.display = 'none';
    } else if(event.target && event.target.nodeName === 'IMG') {
        document.getElementById('guess-input').value = event.target.alt;
        this.style.display = 'none';
    }
});

// Click sur soumettre QUE s'il y a 1 seul proposition
document.getElementById('submit-guess').addEventListener('click', function() {
    if (document.querySelectorAll('.suggestions-list div').length === 1) {
        HandleGuess(document.querySelector('.suggestions-list div:last-child').textContent);
    } else {
        HandleGuess(document.getElementById('guess-input').value)
    }
});

var lastElem = null;
function AddRow(guess) {
    var grid = document.querySelector('.grid');
    var l = GetCharacter(guess)
    const anim_time = 500; // ms

    var right = l.nom === real.nom
    console.log(right);

    if (guess !== '' && l) {

        setTimeout(() => {
            var newCase = document.createElement('div');
            var newSpan = document.createElement('span');
            var img = document.createElement('img');

            newCase.classList.add("box");
            img.classList.add("answer-image")

            newSpan.textContent = l.nom
            img.alt = l.nom;
            img.src = l.imgpath;

            if(right) { newCase.classList.add("correct"); }
            else { newCase.classList.add("wrong"); }

            newCase.appendChild(img)
            newCase.appendChild(newSpan)

            if(lastElem) { grid.insertBefore(newCase, lastElem); }
            else { grid.appendChild(newCase); }

            lastElem = newCase;
        }, anim_time/2);

        var index = characters.findIndex(function(char) {
            return char.alias.includes(guess);
        });
        if (index !== -1) {
            characters.splice(index, 1);
        }


        setTimeout(() => {
            if(right) { 
                alert(`Vous avez trouvé: ${real.nom} en ${attemps} tentative(s) !`); 
                image.style.filter = `blur(0px)`;
            } else if(attemps === 5) { alert(`Petit aide: ça commence par ${real.nom[0]}.`) }
        }, anim_time);  
    } 
}