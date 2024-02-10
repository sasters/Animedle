import csv
import json

# Chemin vers le fichier CSV
csv_file = 'PATH.csv'

# Liste pour stocker les personnages
characters = []

# Lire le fichier CSV et ajouter les personnages à la liste
with open(csv_file, newline='', encoding='utf-8') as file:
    reader = csv.DictReader(file)
    for row in reader:
        # Créer un dictionnaire pour chaque personnage
        character = {
            'nom': row['Nom'],
            'alias': row['Alias'].split(', '),
            'genre': row['Genre'],
            'espece': row['Espece'],
            'haki': row['Type d\'haki'].split(', '),
            'fruit': row['Type de fruit du démon'],
            'arc': row['Arc d\'apparition'],
            'appartenance': row['Appartenance'],
            'grade': row['Grade / Métier']
        }
        characters.append(character)

# Écrire les personnages dans un fichier JSON
with open('characters.json', 'w') as json_file:
    json.dump(characters, json_file, indent=4)

# Générer le code JavaScript
js_code = "var characters = " + json.dumps(characters, indent=4) + ";"

# Écrire le code JavaScript dans un fichier
with open('characters.js', 'w') as js_file:
    js_file.write(js_code)
