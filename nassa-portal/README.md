# Nassa Studio — Client Portal

## Deploy su Vercel (consigliato, gratuito)

### 1. Carica su GitHub
1. Vai su [github.com](https://github.com) → **New repository**
2. Nome: `nassa-portal` → **Create repository**
3. Carica tutti questi file (drag & drop nella pagina del repo)

### 2. Collega a Vercel
1. Vai su [vercel.com](https://vercel.com) → **Sign up** con GitHub
2. Clicca **Add New → Project**
3. Seleziona il repo `nassa-portal`
4. Lascia tutto di default → **Deploy**

✅ In ~2 minuti ottieni un URL tipo `nassa-portal.vercel.app`

---

## Deploy su Netlify (alternativa)

1. Vai su [netlify.com](https://netlify.com) → **Sign up**
2. Trascina la cartella `nassa-portal` direttamente su Netlify
3. Netlify la builda e pubblica automaticamente

---

## Sviluppo locale

```bash
npm install
npm run dev
```

Apri `http://localhost:5173`

---

## Note importanti

- **Storage**: ogni utente/browser ha i propri dati (`localStorage`).  
  I dati NON sono condivisi tra utenti diversi.
- **Nessun login**: chiunque abbia l'URL può accedere all'admin.  
  Aggiungi autenticazione (es. Clerk, Auth0) se necessario.
- **Dati mock**: al primo avvio viene caricato il cliente demo EICH Design.
