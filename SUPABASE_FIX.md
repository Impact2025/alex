# 🔧 Supabase Login Fix

## Probleem: Kan niet inloggen

### Mogelijke oorzaken:

1. **Email verificatie is vereist** (standaard in Supabase)
2. **Account bestaat niet**
3. **Verkeerd wachtwoord/pincode**

---

## ✅ Oplossing 1: Disable Email Verificatie (Development)

1. Ga naar **Supabase Dashboard**:
   https://supabase.com/dashboard/project/gdtqrpkoocyqoeikwumq/auth/settings

2. Scroll naar **Email Auth**

3. **Zet uit**: "Enable email confirmations"
   - Dit zorgt ervoor dat je direct kan inloggen na registratie
   - Geen email verificatie nodig tijdens development

4. **Save**

5. **Test**: Registreer een nieuw account

---

## ✅ Oplossing 2: Check Supabase Auth Settings

Controleer deze instellingen in Dashboard → Authentication → Settings:

```
✓ Enable Email provider: ON
✓ Enable Email Confirmations: OFF (voor development)
✓ Email Templates: Configured
✓ Site URL: http://localhost:5174
```

---

## ✅ Oplossing 3: Test Account Aanmaken

Gebruik deze test credentials:

**Email**: `test@ajax.nl`
**Pincode**: `9999` (of wachtwoord: `Test123!`)

Probeer:
1. Registreer met deze gegevens
2. Check of je een email krijgt (als verificatie AAN staat)
3. Of log direct in (als verificatie UIT staat)

---

## 🔍 Debug: Check Console

Open Browser Console (F12) en kijk naar:
- Login errors
- Network requests naar Supabase
- Auth state changes

---

## 💡 Quick Fix Script

Run dit om een test user aan te maken:

```bash
node scripts/create-test-user.js
```

Dit maakt een user aan die direct kan inloggen.

---

## 🚨 Common Errors

### "Invalid login credentials"
→ Verkeerd email/wachtwoord OF account bestaat niet

### "Email not confirmed"
→ Email verificatie staat AAN, check je inbox of disable het

### "User already registered"
→ Probeer in te loggen ipv registreren

---

**Pro Tip**: Voor development is het makkelijkst om email confirmations UIT te zetten!
