import csv
import json

# Chemin vers le fichier CSV
csv_op = 'OPdle.csv'
csv_naruto = 'Narutodle.csv'

# Liste pour stocker les personnages
characters = []
n_characters = []

# Lire le fichier CSV et ajouter les personnages à la liste
with open(csv_op, newline='', encoding='utf-8') as file:
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

with open(csv_naruto, newline='', encoding='utf-8') as file:
    reader = csv.DictReader(file)
    for row in reader:
        if row['Nom'] not in row['Alias']:
            print(f"Erreur: check les alias de '{row['Nom']}'")
            continue
        
        # Divise les valeurs séparées par des virgules en listes
        manga = row['Manga'].split(',')
        nature_chakra = row['Nature de Chakra'].split(',')
        clan = row['Clan'].split(',')
        pouvoir = row['Pouvoir héréditaire'].split(',')
        affiliation = row['Affiliation'].split(',')
        g = row['Genre'].split(',')

        # Créer un dictionnaire pour chaque personnage de Naruto
        character = {
            'manga': manga,
            'nom': row['Nom'].strip(),
            'alias': row['Alias'].split(','),
            'genre': g,
            'espece': row['Espèce'].strip(),
            'nature': nature_chakra,
            'vivant': row['Vivant'].strip(),
            'clan': clan,
            'pouvoir': pouvoir,
            'affiliation': affiliation,
            'arc': row['Arc d\'Apparition'].strip(),
            'imgpath': row['imgpath'].strip()
        }
        n_characters.append(character)

# Générer le code JavaScript
js_code = "export const characters = " + json.dumps(characters, indent=4) + ";"
naruto_js_code = "export const characters = " + json.dumps(n_characters, indent=4) + ";"

# Écrire le code JavaScript dans un fichier
with open('./src/op/char.js', 'w') as js_file:
    js_file.write(js_code)

with open('./src/naruto/char.js', 'w') as naruto_js_file:
    naruto_js_file.write(naruto_js_code)