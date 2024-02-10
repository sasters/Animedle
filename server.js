const express = require('express');
const app = express();

// Définissez le chemin vers votre dossier de fichiers statiques
app.use(express.static('src'));

// Démarrez le serveur sur le port 3000
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
