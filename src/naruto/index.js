import { characters } from './char.js';

var real = characters[Math.floor(Math.random() * characters.length)];
var attemps = 0;
var arcOrder = ['Romance Dawn', "Ville d'Orange", "Village de Sirop", "Baratie", "Arlong Park", "Loguetown", "Reverse Mountain","Whiskey Peak","Little Garden", "Royaume de drum", "Alabasta", "Jaya","Skypia","Long Ring Long Land", "Water 7", "Enies Lobby","Thriller Bark","Sabaody","Amazon Lily","Impel Down","Marineford","Ile des Hommes-Poissons","Punk Hazard","Dressrosa","Zoo","Whole Cake Island","Pays de Wa","Egg Head"]

var arcNaruto = ["Introduction", "Pays des Vagues", "Examen Chunin", "Invasion de Konoha", "Recherche de Tsunade", "Fuite de Sasuke", "Sauvetage du Kazekage", "Hidan et Kakuzu", "Poursuite d'Itachi", "Invasion de Pain", "Sommet des 5 Kages", "Maitrise de Kyubi", "Quatrième Grande Guerre Ninja", "Combat contre Madara", "Combat contre Kaguya"]
var arcBoruto = ["Introduction", "Pays des Vagues", "Examen Chunin", "Invasion de Konoha", "Recherche de Tsunade", "Fuite de Sasuke", "Sauvetage du Kazekage", "Hidan et Kakuzu", "Poursuite d'Itachi", "Invasion de Pain", "Sommet des 5 Kages", "Maitrise de Kyubi", "Quatrième Grande Guerre Ninja", "Combat contre Madara", "Combat contre Kaguya", "Début à l'Académie Ninjas", "Ao", "Kawaki"]

var nChar = characters.filter(function(character) {
    return character.manga.includes('Naruto');
});

var bChar = characters.filter(function(character) {
    return character.manga.includes('Boruto');
});

var useOnlyNaruto = false;

console.log("----->",real.nom);

function HandleGuess(guess) {
    if(GetCharacterInfo(guess) === null) { console.log("No character:", guess); return; }

    document.getElementById('suggestions-list').style.display = 'none';
    document.getElementById('input-guess').value = '';

    attemps++;

    AddRow(guess);
}

/* Utilise que les perso de Naruto ou Boruto & Naruto */
function FilterCharactersByManga(text) {
    text = text.toLowerCase().trim();
    return characters.filter(function(character) {
        if ((useOnlyNaruto && character.manga.includes('Naruto')) || (!useOnlyNaruto && character.manga.includes('Boruto'))) {
            if (character.nom.toLowerCase().startsWith(text)) {
                return true;
            }
            for (var i = 0; i < character.alias.length; i++) {
                if (character.alias[i].toLowerCase().startsWith(text)) {
                    return true;
                }
            }
        }
        return false;
    }).map(function(character) {
        return character.nom;
    });
}

/* return info about a character by name in an array, null if not exists */
function GetCharacterInfo(char) {
    if(useOnlyNaruto) {
        var found = nChar.find(function(character) {
            return character.nom.toLowerCase() === char.toLowerCase();
        });
    } else {
        var found = bChar.find(function(character) {
            return character.nom.toLowerCase() === char.toLowerCase();
        });
    }

    if(found) {
        return [
            found.imgpath,
            found.genre,
            found.espece,
            found.nature,
            found.vivant,
            found.clan,
            found.pouvoir,
            found.affiliation,
            found.arc
        ]
    }

    return null;
}


/* return info about a character by name in a dictionnary, null if not exists */
function GetCharacter(name) {
    for (let i = 0; i < characters.length; i++) {
        if(characters[i].alias.includes(name)) {
            return characters[i];
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
        var charInfo = GetCharacter(character)

        if(!charInfo) { console.log("not for:", character, charInfo); }

        var newSugg = document.createElement('div');
        var charImg = document.createElement('img'); 
        var newSpan = document.createElement("span");

        charImg.classList.add("sugg-img")

        charImg.src = charInfo.imgpath  
        charImg.alt = character; 
        
        newSpan.textContent = character;

        newSugg.appendChild(charImg); 
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
document.getElementById('input-guess').addEventListener('input', HandleInputEvent);
document.getElementById('input-guess').addEventListener('keydown', HandleKeyDownEvent);

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
        HandleGuess(document.getElementById('input-guess').value)
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

        for (let i = 0; i < 9; i++) {

            setTimeout(() => {
                if(i === 0) {
                    var newCase = document.createElement('div');
                    newCase.classList.add("box");

                    var img = document.createElement('img');
                    img.classList.add("image")
                    img.alt = guess;
                    img.src = char[0];

                    newCase.appendChild(img)
                    grid.appendChild(newCase);
                } else {
                    var newCase = document.createElement('div');
                    newCase.classList.add("box");

                    var newSpan = document.createElement('span');
                    
                    if (Array.isArray(char[i])) { newSpan.textContent = char[i].join(' '); } 
                    else { newSpan.textContent = char[i]; }

                    newCase.classList.add(corr[i]);

                    newCase.appendChild(newSpan)
                    grid.appendChild(newCase);
                }
                
                
                

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
            else if(attemps === 7) { alert(`Petit aide: ça commence par ${real.nom[0]}.`) }
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
                if(cate === 'arc') {
                    if (char[cate] === real[cate]) {
                        corr[index] = 'correct';
                    } else if (useOnlyNaruto) {
                        if (arcNaruto.indexOf(char[cate]) < arcNaruto.indexOf(real[cate])) {
                            corr[index] = 'higher';
                        } else {
                            corr[index] = 'lower';
                        }
                    } else {
                        if (arcBoruto.indexOf(char[cate]) < arcBoruto.indexOf(real[cate])) {
                            corr[index] = 'higher';
                        } else {
                            corr[index] = 'lower';
                        }
                    }
                    
                } else {
                    if(real[cate] == char[cate]) { corr[index] = 'correct'; }
                    else { corr[index] = 'wrong'; }
                }
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

document.getElementById('settings').addEventListener('click', function() {
    document.getElementById('settings-popup').style.display = 'block';
});

document.getElementById('close-popup').addEventListener('click', function() {
    document.getElementById('settings-popup').style.display = 'none';
});

// Sélectionnez la popup et le bouton de fermeture
const popup = document.getElementById('settings-popup');
const closeButton = document.getElementById('close-popup');

// Ajoutez un écouteur d'événement au bouton de fermeture
closeButton.addEventListener('click', () => {
    closePopup();
});

// Fonction pour fermer la popup
function closePopup() {
    popup.style.display = 'none';
}

// Ajoutez un écouteur d'événement pour fermer la popup en cliquant en dehors d'elle
window.addEventListener('click', (event) => {
    if (event.target === popup) {
        closePopup();
    }
});

// Fonction pour ajuster la position de la barre de suggestions lors du défilement
function adjustSuggestionsPosition() {
    const distanceFromTop = window.scrollY;
    document.getElementById("suggestions-list").style.top = `calc(30% - ${distanceFromTop}px)`;
    document.getElementById("hint-popup").style.top = `calc(35% - ${distanceFromTop}px)`;
}

// Écoutez l'événement de défilement de la page et ajustez la position de la barre de suggestions
window.addEventListener('scroll', adjustSuggestionsPosition);

// Sélection du bouton et de la popup
const hintButton = document.getElementById('hint-button');
const hintPopup = document.getElementById('hint-popup');
const hintText = document.getElementById('hint-text')

// Fonction pour afficher la popup
function showPopup() {
    //if(attemps < 7) return;
    hintPopup.style.display = 'block';
    hintText.textContent = `Petit indice, la première lettre est : ${real.nom[0]}...`;
}

// Fonction pour masquer la popup
function hidePopup() {
    hintPopup.style.display = 'none';
}

// Ajout d'un écouteur d'événement au bouton pour afficher la popup
hintButton.addEventListener('click', showPopup);

// Ajout d'un écouteur d'événement au bouton de fermeture pour masquer la popup
document.getElementById('close-icon').addEventListener('click', hidePopup);

// Ajouter un gestionnaire d'événements pour le clic en dehors de la popup pour fermer la popup
window.addEventListener('click', function(event) {
    if (event.target === popup) {
        hintPopup.style.display = 'none';
    }
});



// ----------------------------------------------------------------------------


