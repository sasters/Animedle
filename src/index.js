import { characters } from './char.js';

var real = characters[Math.floor(Math.random() * characters.length)];
var attemps = 0;
console.log("----->",real.nom);

function HandleGuess(guess) {
    document.getElementById('suggestions-list').style.display = 'none';
    document.getElementById('guess-input').value = '';

    attemps++;

    AddRow(guess);
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

function GetCharacterInfo(char) {

    var found = characters.find(function(characters) {
        return characters.nom.toLowerCase() === char.toLowerCase();
    });

    if(found) {
        return [
            found.imgpath,
            found.genre,
            found.espece,
            found.haki,
            found.fruit,
            found.arc,
            found.appartenance,
            found.grade
        ]
    }

    return null;
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
        var elementSuggestion = document.createElement('div');
        var imagePersonnage = document.createElement('img'); // Créez un élément img pour l'image du personnage
        imagePersonnage.src = '/home/marco/Documents/marco/dev/Animdle/Animedle/img/luffy.png'; // Remplacez par le chemin correct vers l'image du personnage
        imagePersonnage.alt = character; // Utilisez le nom du personnage comme texte alternatif de l'image
        elementSuggestion.appendChild(imagePersonnage); // Ajoutez l'image à l'élément de suggestion
        elementSuggestion.textContent = character; // Ajoutez le nom du personnage à l'élément de suggestion
        sugg.appendChild(elementSuggestion); // Ajoutez l'élément de suggestion à la liste de suggestions
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
        var charFiltered = FilterCharacters(guess);
        ShowSuggestions(charFiltered);

        if(document.querySelectorAll('.suggestions-list div').length <= 0) { sugg.style.display = 'none'; }
        else {sugg.style.display = 'block';}

        
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
    if (event.target && event.target.nodeName === 'DIV') { // Vérifiez si l'élément cliqué est un des éléments de suggestion
        document.getElementById('guess-input').value = event.target.textContent;
        this.style.display = 'none';
    }
});

// Click sur soumettre QUE s'il y a 1 seul proposition
document.getElementById('submit-guess').addEventListener('click', function() {
    if (document.querySelectorAll('.suggestions-list div').length === 1) {

        HandleGuess(document.querySelector('.suggestions-list div:last-child').textContent);
    }
});


// Gestionnaire d'événements pour le clic sur le bouton de soumission
function AddRow(guess) {
    var grid = document.querySelector('.grid');
    var char = GetCharacterInfo(guess)
    var charInfo = GetCharacter(guess)
    var corr = GetCorrection(charInfo)
    const anim_time = 500; // ms

    if (guess !== '') {

        for (let i = 0; i < 8; i++) {

            setTimeout(() => {
                var newCase = document.createElement('div');
                newCase.classList.add("box");

                var newSpan = document.createElement('span');
                
                if (Array.isArray(char[i])) { newSpan.textContent = char[i].join(' '); } 
                else { newSpan.textContent = char[i]; }

                if(i!==0) newCase.classList.add(corr[i-1]);
                
                newCase.appendChild(newSpan)
                grid.appendChild(newCase);

                setTimeout(() => {
                    newCase.classList.add('appear');
                }, 50);

            }, ((i+1)*anim_time) / 2);


        }


        var index = characters.findIndex(function(personnage) {
            return personnage.alias.includes(guess);
        });
        if (index !== -1) {
            characters.splice(index, 1);
        }

        var isAllCorrect = corr.every(element => element === "correct");

        setTimeout(() => {
            if(isAllCorrect) { alert(`Vous avez trouvé: ${real.nom} en ${attemps} tentative(s) !`) }
            if(attemps === 7) { alert(`Petit aide: ça commence par ${real.nom[0]}.`) }
        }, 5*anim_time);  
    } 
}

function GetCorrection(char) {
    var corr = []
    var index = 0;
    
    for(var cate in real) {
        if(cate !== 'nom' && cate !== 'alias' && cate !== 'imgpath') {

            if(Array.isArray(real[cate])) {

                if (arraysEqual(char[cate], real[cate])) {
                    corr[index] = 'correct';
                } else if (char[cate].some(val => real[cate].includes(val))) {
                    corr[index] = 'semi';
                } else {
                    corr[index] = 'wrong';
                }

            } else {
                if(real[cate] == char[cate]) { corr[index] = 'correct'; }
                else { corr[index] = 'wrong'; }
            }

            index++;

        }
        
    }

    return corr
}

function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (var i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}