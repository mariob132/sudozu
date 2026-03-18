# Instalación de Tailwind CSS

Para instalar Tailwind CSS, ejecuta los siguientes comandos en tu terminal:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

O si tienes problemas de permisos, intenta:

```bash
npm install -D tailwindcss postcss autoprefixer --legacy-peer-deps
```

Los archivos de configuración ya están creados:
- `tailwind.config.js` ✅
- `postcss.config.js` ✅
- `src/index.css` (con las directivas de Tailwind) ✅

Después de instalar, reinicia el servidor de desarrollo:

```bash
npm run dev
```
