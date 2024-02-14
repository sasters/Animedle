import { logos } from "./logo.js";

var nLogo = logos.filter(function(logo) {
    return logo.manga.includes('Naruto');
});

var bLogo = logos.filter(function(logo) {
    return logo.manga.includes('Boruto');
});

var urlParams = new URLSearchParams(window.location.search);
var switchValue = urlParams.get('switchValue');
var useOnlyNaruto = switchValue === 'true';
var real;
var attemps = 0;

if(useOnlyNaruto) { real = nLogo[Math.floor(Math.random() * nLogo.length)]; }
else { real = bLogo[Math.floor(Math.random() * bLogo.length)]; }

console.log('---->',real);

document.getElementById('logo').src = real.imgpath;

function HandleGuess(guess) {
    if(GetLogo(guess) === null) { console.log("No character:", guess); return; }

    document.getElementById('suggestions-list').style.display = 'none';
    document.getElementById('input-guess').value = '';

    attemps++;

    AddRow(guess);
}

/* Utilise que les perso de Naruto ou Boruto & Naruto */
function FilterCharactersByManga(text) {
    text = text.toLowerCase().trim();
    return logos.filter(function(logo) {
        if ((useOnlyNaruto && logo.manga.includes('Naruto')) || (!useOnlyNaruto && logo.manga.includes('Boruto'))) {
            if (logo.nom.toLowerCase().startsWith(text)) {
                return true;
            }
            for (var i = 0; i < logo.alias.length; i++) {
                if (logo.alias[i].toLowerCase().startsWith(text)) {
                    return true;
                }
            }
        }
        return false;
    }).map(function(logo) {
        return logo.nom;
    });
}

/* return info about a character by name in a dictionnary, null if not exists */
function GetLogo(name) {
    let logos = useOnlyNaruto ? nLogo : bLogo; // Sélectionne la liste appropriée en fonction de useOnlyNaruto

    for (let i = 0; i < logos.length; i++) {
        if (logos[i].alias.includes(name)) {
            return logos[i];
        }
    }

    return null; // Retourne null si aucun personnage n'est trouvé
}


/* Affiche les suggestions */
function ShowSuggestions(suggestions) {
    var sugg = document.querySelector('.suggestions-list');
    sugg.innerHTML = ''; // supprime ancien sugg

    // Affichez les nouvelles suggestions
    suggestions.forEach(function(character) {
        var newSugg = document.createElement('div');
        var newSpan = document.createElement("span");
        
        newSpan.textContent = character;

        newSugg.appendChild(newSpan);

        sugg.appendChild(newSugg); 
    });

    sugg.style.display = 'block'; // Afficher la liste de suggestions
}
function HandleInputEvent(event) {
    var guess = this.value.trim(); // Récupérer la valeur de la barre de recherche en supprimant les espaces vides au début et à la fin
    var sugg = document.getElementById('suggestions-list');

    if (guess === '') {
        sugg.innerHTML = '';
        sugg.style.display = 'none';
    } else {
        var charFiltered = FilterCharactersByManga(guess);
        console.log(charFiltered);
        ShowSuggestions(charFiltered);

        if(document.querySelectorAll('.suggestions-list div').length <= 0) { sugg.style.display = 'none'; }
        else { sugg.style.display = 'block'; }   
    }
}function HandleKeyDownEvent(event) {
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
document.getElementById('input-guess').addEventListener('input', HandleInputEvent);
document.getElementById('input-guess').addEventListener('keydown', HandleKeyDownEvent);

// Écouteur d'événement pour les clics sur la liste des suggestions
document.getElementById('suggestions-list').addEventListener('click', function(event) {
    if(event.target && (event.target.nodeName === 'DIV' || event.target.nodeName === 'SPAN')) {
        document.getElementById('input-guess').value = event.target.textContent;
        this.style.display = 'none';
    } else if(event.target && event.target.nodeName === 'IMG') {
        document.getElementById('input-guess').value = event.target.alt;
        this.style.display = 'none';
    }
});

// Click sur soumettre QUE s'il y a 1 seul proposition
document.getElementById('submit-guess').addEventListener('click', function() {
    if (document.querySelectorAll('.suggestions-list div').length === 1) {
        HandleGuess(document.querySelector('.suggestions-list div:last-child').textContent);
    } else {
        HandleGuess(document.getElementById('input-guess').value)
    }
});


// Gestionnaire d'événements pour le clic sur le bouton de soumission
function AddRow(guess) {
    var grid = document.querySelector('.grid');
    var l = GetLogo(guess)
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
            grid.appendChild(newCase);
        }, anim_time/2);

        var index = logos.findIndex(function(logo) {
            return logo.alias.includes(guess);
        });
        if (index !== -1) {
            logos.splice(index, 1);
        }


        setTimeout(() => {
            if(right) { alert(`Vous avez trouvé: ${real.nom} en ${attemps} tentative(s) !`) }
            else if(attemps === 7) { alert(`Petit aide: ça commence par ${real.nom[0]}.`) }
        }, anim_time);  
    } 
}