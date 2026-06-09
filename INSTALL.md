# 📦 KOMO — Dependencias e Instalación

## Requisitos del sistema

| Herramienta | Versión mínima | Verificar |
|-------------|---------------|-----------|
| Node.js     | ≥ 18.x        | `node -v` |
| npm         | ≥ 9.x         | `npm -v`  |
| Git         | cualquiera    | `git -v`  |

---

## 🚀 Instalación rápida (desde cero)

```bash
# 1. Clonar el repositorio
git clone https://github.com/Asss678/Komo.git
cd Komo

# 2. Instalar TODAS las dependencias
npm install

# 3. Levantar servidor local
npm run dev
# ➜ http://localhost:5173/Komo/
```

---

## 📦 Dependencias de producción

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.23.1",
  "lucide-react": "^0.395.0"
}
```

| Paquete | Versión | Uso |
|---------|---------|-----|
| `react` | 18.3.1 | Framework UI |
| `react-dom` | 18.3.1 | Renderizado DOM |
| `react-router-dom` | 6.23.1 | Navegación SPA |
| `lucide-react` | 0.395.0 | Íconos SVG |

---

## 🛠️ Dependencias de desarrollo

```json
{
  "@vitejs/plugin-react": "^4.3.0",
  "autoprefixer": "^10.4.19",
  "postcss": "^8.4.38",
  "tailwindcss": "^3.4.4",
  "vite": "^5.3.1"
}
```

| Paquete | Versión | Uso |
|---------|---------|-----|
| `vite` | 5.3.1 | Bundler / Dev server |
| `@vitejs/plugin-react` | 4.3.0 | Soporte JSX/React en Vite |
| `tailwindcss` | 3.4.4 | Utilidades CSS |
| `postcss` | 8.4.38 | Procesador CSS |
| `autoprefixer` | 10.4.19 | Prefijos CSS cross-browser |

---

## 📜 Scripts disponibles

```bash
npm run dev       # Servidor local en http://localhost:5173/Komo/
npm run build     # Build de producción → carpeta dist/
npm run preview   # Preview del build de producción
```

---

## 🌐 Despliegue en GitHub Pages

### Automático (recomendado)
El archivo `.github/workflows/deploy.yml` despliega automáticamente a GitHub Pages en cada push a `main`.

**Activar en GitHub:**
1. Ve a tu repo → **Settings** → **Pages**
2. En **Source** selecciona: `GitHub Actions`
3. Haz un push a `main` → se despliega automáticamente

URL resultante: `https://asss678.github.io/Komo/`

---

### Manual (una sola vez)

```bash
# Instalar gh-pages globalmente (solo la primera vez)
npm install -g gh-pages

# Build + deploy en un comando
npm run build && npx gh-pages -d dist
```

---

## 🖥️ Despliegue en Vercel (alternativa)

```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

En Vercel, configura:
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Node Version:** 20.x

---

## 🔁 Estructura del proyecto

```
Komo/
├── .github/
│   └── workflows/
│       └── deploy.yml          ← CI/CD GitHub Actions
├── public/
│   └── komo-icon.svg
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── Toast.jsx
│   ├── context/
│   │   └── AppContext.jsx       ← Estado global (tokens, usuario)
│   ├── data/
│   │   └── mockData.js          ← Datos mock (cursos, tutores, logros)
│   ├── pages/
│   │   ├── Landing.jsx          ← Página principal
│   │   ├── Dashboard.jsx        ← Panel del estudiante
│   │   ├── Explore.jsx          ← Marketplace de cursos
│   │   └── Profile.jsx          ← Perfil + logros NFT
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json                 ← Dependencias
├── package-lock.json            ← Lock file (versiones exactas)
├── vite.config.js               ← Configuración Vite
├── tailwind.config.js           ← Configuración Tailwind
├── postcss.config.js
├── INSTALL.md                   ← Este archivo
└── README.md
```

---

## ⚠️ Solución de problemas

### Error: `node: command not found`
→ Instala Node.js desde https://nodejs.org (versión LTS)

### Error al instalar dependencias
```bash
# Limpiar caché y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Puerto 5173 ocupado
```bash
npm run dev -- --port 3000
```

### Build falla con errores de ESLint
```bash
# El build no usa ESLint por defecto con Vite, pero si aparece:
npm run build -- --no-lint
```

---

## 📋 Versiones exactas (package-lock.json)

El archivo `package-lock.json` incluido garantiza que **todos los miembros del equipo** instalen exactamente las mismas versiones de los 181 paquetes del árbol de dependencias.

Siempre usar `npm ci` en CI/CD y `npm install` en desarrollo local.
