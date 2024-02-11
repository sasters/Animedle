# Animedle
wordle like game on animes


# Setup

Le site nécessite l'utilisation de 'express' et donc de 'nodejs' pour simuler un server. 

- Installer express avec:
```bash
npm install express
```

- Lancer le server dans le dossier adequat avec:
```bash
node server.js
```

# Converter

Converter.py est un script qui permet de convertir un fichier csv en fichier js. Il faut ensuite le modifer pour pouvoir l'utiliser (Voir en dessous). 

## Initaliser les fichiers
Utiliser le converter pour généré le fichier char.js, lorsqu'il est généré, il faut le modifier en ajoutant:
```js
export const characters = [
    // code generated
]
```

Penser aussi a supprimer le 1er éléments.