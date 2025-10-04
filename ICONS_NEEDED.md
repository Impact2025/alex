# App Iconen Nodig

Voor de PWA (Progressive Web App) functionaliteit hebben we 2 iconen nodig in de `public/` map:

## Benodigde bestanden:

1. **ajax-icon-192.png** (192x192 pixels)
2. **ajax-icon-512.png** (512x512 pixels)

## Hoe te maken:

### Optie 1: Gebruik een online tool
1. Ga naar https://www.canva.com
2. Maak een vierkant design (512x512)
3. Voeg AJAX logo toe (of rode achtergrond met witte letters "AJAX")
4. Download als PNG
5. Gebruik https://www.iloveimg.com/resize-image om ook een 192x192 versie te maken

### Optie 2: Gebruik dit als placeholder
Als tijdelijke oplossing kun je deze rode vierkanten met tekst gebruiken:

**Stappen:**
1. Open Paint of Preview
2. Maak een nieuw bestand van 512x512 pixels
3. Vul met rood (#DC2626)
4. Voeg witte tekst "AJAX" toe in het midden
5. Sla op als `ajax-icon-512.png` in de `public/` map
6. Doe hetzelfde voor 192x192 en sla op als `ajax-icon-192.png`

## Waar te plaatsen:
```
ajax-performance-suite/
  public/
    ajax-icon-192.png  ← Hier
    ajax-icon-512.png  ← Hier
```

## Zonder iconen:
De app werkt ook zonder iconen, maar:
- ❌ Geen mooi icoon op het home screen
- ❌ Geen icoon in notificaties
- ✅ Notificaties werken nog steeds!
