# Database Setup Instructies

## Stap 1: Open Supabase SQL Editor

1. Ga naar https://supabase.com/dashboard
2. Login met je account
3. Selecteer je project: `gdtqrpkoocyqoeikwumq`
4. Klik op het **SQL Editor** icoon in het linkermenu (⚡)
5. Klik op **+ New query**

## Stap 2: Voer de SQL uit

1. Open het bestand `supabase_setup.sql` in deze map
2. Kopieer de HELE inhoud (Ctrl+A, Ctrl+C)
3. Plak het in de SQL Editor in Supabase (Ctrl+V)
4. Klik op **Run** (of druk op Ctrl+Enter)

## Stap 3: Controleer of het gelukt is

Je zou een groen vinkje moeten zien met het bericht "Success. No rows returned".

Dit betekent dat de volgende tabellen zijn aangemaakt:
- ✅ `daily_entries` - Voor dagelijkse activiteiten (ochtend, gedachten, missies, etc.)
- ✅ `match_day_entries` - Voor wedstrijddag gegevens

## Wat wordt er opgeslagen?

### In daily_entries:
- **Ochtend check-in**: Slaap score, dagdoel, fysiek, mentaal, concentratie, controle
- **Gedachten dump**: Wat je opschrijft
- **Challenge**: Of je de dagelijkse uitdaging hebt voltooid
- **Avondritueel**: Welke missies je hebt voltooid
- **Pyjama-Dribbel**: "Vandaag durfde ik..." en "Morgen ga ik proberen..."
- **Dankbaarheid**: De 3 dingen waar je dankbaar voor bent
- **Punten**: Hoeveel punten je die dag hebt verdiend

### In match_day_entries:
- **Pre-match**: Welke rituelen je voor de wedstrijd hebt gedaan
- **Post-match**: Je reflectie na de wedstrijd

## Hoe gebruik je het dagboek?

1. Voer dagelijkse activiteiten uit in de app
2. Alles wordt automatisch opgeslagen in de database
3. Klik op **"Mijn Dagboek"** in de toolbox
4. Zie al je oude dagen terug!

## Beveiliging

- ✅ Elk kind kan alleen z'n eigen gegevens zien
- ✅ Row Level Security (RLS) is ingeschakeld
- ✅ Niemand anders kan je dagboek lezen

## Klaar!

De database is nu klaar voor gebruik. Alle nieuwe activiteiten worden automatisch opgeslagen! 🎉
