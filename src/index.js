var characters = [
    { nom: "Luffy", alias:['Luffy', 'Monkey D. Luffy', 'Mugiwara', 'Luffytaro'], genre: "Homme", espece: "Humain", haki:'Roi, Observation, Armement', arc: "Romance Down", fruit: "Zoan", appartenance: 'Pirate', grade: 'Capitaine', imgpath:''},
    { nom: "Zoro", alias:['Zoro', 'Roronoa Zoro'], genre: "Homme", espece: "Humain", arc: "Romance Down", haki:"Roi, Observation, Armement", fruit: "Aucun", appartenance:"Pirate", grade:'Second', imgpath:'' },
    
]

function HandleGuess(guess) {
    console.log(guess);

    document.getElementById('suggestions-list').style.display = 'none';
    document.getElementById('guess-input').value = '';

    Add(guess);
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

        sugg.style.display = 'block';
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
function Add(guess) {
    var grid = document.querySelector('.grid');
    var char = GetCharacterInfo(guess)

    if (guess !== '') {

        for (let i = 0; i < 8; i++) {
            console.log(char[i]);
            var newCase = document.createElement('div');
            newCase.classList.add('box');
            newCase.classList.add('span');
            newCase.textContent = char[i];
            grid.appendChild(newCase);
        }

    } 
}
