import csv
import json

# Chemin vers le fichier CSV
csv_file = 'OPdle.csv'

# Liste pour stocker les personnages
characters = []

# Lire le fichier CSV et ajouter les personnages à la liste
with open(csv_file, newline='', encoding='utf-8') as file:
    reader = csv.DictReader(file)
    for row in reader:
        if row['Nom'] not in row['Alias']:
            print(f"Erreur: check les alias de '{row['Nom']}'")
            continue

        # Créer un dictionnaire pour chaque personnage
        character = {
            'nom': row['Nom'].strip(),
            'alias': row['Alias'].split(', '),
            'genre': row['Genre'].strip(),
            'espece': row['Espece'].strip(),
            'haki': row['Type d\'haki'].split(', '),
            'fruit': row['Type de fruit du démon'].strip(),
            'arc': row['Arc d\'apparition'].strip(),
            'appartenance': row['Appartenance'].strip(),
            'grade': row['Grade / Métier'].strip(),
            'imgpath': row['imgpath'].strip()
        }
        characters.append(character)



# Générer le code JavaScript
js_code = "export const characters = " + json.dumps(characters, indent=4) + ";"

# Écrire le code JavaScript dans un fichier
with open('./src/char.js', 'w') as js_file:
    js_file.write(js_code)
