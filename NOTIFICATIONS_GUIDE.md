# 📱 Notificaties & PWA Installatie Handleiding

## Wat doet het?

Je zoon krijgt nu **automatisch dagelijkse herinneringen**:
- 🌅 **07:00 uur**: "Goedemorgen Kampioen! Start je dag met punten verdienen!"
- 🌙 **19:00 uur**: "Tijd voor je avondritueel! Voltooi je missies!"

## Hoe te installeren op mobiel

### iPhone/iPad (Safari):
1. Open de website in Safari
2. Klik op het **Deel** icoon (□↑)
3. Scroll naar beneden en klik **"Zet op beginscherm"**
4. Klik **"Voeg toe"**
5. De app verschijnt nu als icoon op het beginscherm! 🎉

### Android (Chrome):
1. Open de website in Chrome
2. Klik op de **3 puntjes** (⋮) rechtsboven
3. Klik **"App installeren"** of **"Toevoegen aan startscherm"**
4. Klik **"Installeren"**
5. De app verschijnt nu op je startscherm! 🎉

## Notificaties inschakelen

### Eerste keer na inloggen:
1. Je zoon logt in
2. Na 2 seconden verschijnt een pop-up: **"Wil je meldingen ontvangen?"**
3. Klik **"Toestaan"** of **"Allow"**
4. Je krijgt direct een test notificatie! 🎉
5. Vanaf nu krijg je elke dag om 07:00 en 19:00 een melding

### Als je per ongeluk "Weigeren" hebt geklikt:

**Op iPhone:**
1. Instellingen → Safari → Websites → Meldingen
2. Zoek je website
3. Zet aan "Toestaan"

**Op Android:**
1. Instellingen → Apps → Chrome
2. Meldingen → Websitemeldingen
3. Zoek je website en zet aan

## Belangrijke tips:

✅ **De app moet minstens 1x geopend worden** na installatie
✅ **Notificaties werken alleen als je toestemming hebt gegeven**
✅ **De browser mag niet volledig afgesloten zijn** (op sommige Android telefoons)
✅ **Test het eerst zelf** door in te loggen en toestemming te geven

## Werkt het niet?

### Checklist:
- [ ] Is toestemming gegeven voor notificaties?
- [ ] Is de app geïnstalleerd op het beginscherm?
- [ ] Is de browser (Chrome/Safari) niet geforceerd afgesloten?
- [ ] Heeft je telefoon internetverbinding?

### Test nu meteen:
1. Login
2. Geef toestemming
3. Je krijgt binnen 1 seconde een test notificatie!
4. Als dat werkt → Perfect! De dagelijkse notificaties werken ook! ✅

## Notificatie tijden wijzigen

Om de tijden aan te passen, open:
```
src/notificationService.js
```

Zoek naar:
```javascript
// Morning notification at 07:00
if (hours === 7 && minutes === 0) {
```

En:
```javascript
// Evening notification at 19:00
if (hours === 19 && minutes === 0) {
```

Pas de getallen aan naar de gewenste uren!

## Veelgestelde vragen

**Q: Kan ik meerdere herinneringen per dag?**
A: Ja! Je kunt meer tijdblokken toevoegen in `notificationService.js`

**Q: Werkt dit ook op een tablet?**
A: Ja! Zowel iPad als Android tablets ondersteunen dit.

**Q: Moet ik dit elke dag opnieuw instellen?**
A: Nee! Eenmaal ingesteld blijft het werken totdat je de app verwijdert.

**Q: Krijg ik ook notificaties op vakantie?**
A: Ja, zolang je telefoon aan staat en internet heeft!

## Klaar! 🎉

Je zoon krijgt nu elke dag automatisch een herinnering om punten te verdienen! 💪⚽
