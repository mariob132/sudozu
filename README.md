# WebBuilder - Creador de Páginas Web

Una aplicación web moderna para crear y editar páginas web sin necesidad de conocimientos técnicos.

## Características

- 🎨 **Landing Page Promocional**: Página de inicio atractiva que promociona el servicio
- 🔐 **Sistema de Autenticación**: Login con credenciales hardcodeadas (admin/12345678)
- ✏️ **Editor Visual de Templates**: Editor drag & drop para personalizar páginas
- 📋 **15 Templates Profesionales Gratis**: Templates precargados listos para usar
  - Landing Page para Negocio
  - Portfolio Personal
  - Blog/Artículos
  - Tienda Online (E-commerce)
  - **E-commerce Premium** - Tienda con header destacado y hero section
  - Página Corporativa
  - **Restaurante Foodhut** - Template profesional para restaurantes (base)
  - **Restaurante Azul** - Variación azul con header centrado
  - **Restaurante Verde** - Variación verde con diseño orgánico
  - **Restaurante Naranja** - Variación naranja vibrante
  - **Restaurante Púrpura** - Variación púrpura elegante
  - **Landing Page Creativa** - Diseño moderno con hero impactante
  - **Agencia Moderna** - Template para agencias creativas
  - **Gimnasio & Fitness** - Template para gimnasios y centros de fitness
  - **Inmobiliaria** - Template para agencias inmobiliarias y propiedades
- 🖼️ **Gestión de Imágenes**: Cambiar y mover imágenes fácilmente (con imágenes profesionales de Unsplash)
- 📝 **Edición de Texto Avanzada**: Personalizar textos, fuentes, colores, tamaños, fondos, padding y más
- 🔘 **Botones Profesionales**: Nuevo tipo de elemento botón con diseño avanzado
  - Border radius personalizable
  - Sombras y efectos visuales
  - Efectos hover opcionales
  - Colores y estilos completamente editables
- 📋 **Headers con Navegación Funcional**: Nuevo tipo de elemento header profesional
  - Logo/Texto personalizable
  - Menú de navegación editable
  - Colores y tamaños configurables
  - Opción de header fijo (sticky)
  - Navegación con scroll suave a secciones
  - Efectos hover en enlaces
  - Diseño responsive y profesional
- 🎯 **Interfaz Intuitiva**: Diseño moderno y fácil de usar
- 🖼️ **Galería de Templates**: Vista previa y selección de templates con filtros por categoría
- 👁️ **Vista Previa Completa**: Modal de vista previa que muestra cómo se verá el template antes de cargarlo
- 🎨 **Renderizado Profesional**: Los templates se muestran como páginas web completas en el editor

## Instalación

### Opción 1: Instalación Normal
```bash
npm install
```

### Opción 2: Si tienes problemas de permisos
```bash
npm install --legacy-peer-deps
# o
npm install --force
```

### Opción 3: Usar el script de instalación
```bash
chmod +x install.sh
./install.sh
```

### Solución de problemas de permisos
Si npm muestra errores de permisos (EPERM), intenta:
```bash
# Limpiar caché
npm cache clean --force

# Corregir permisos (macOS/Linux)
sudo chown -R $(whoami) ~/.npm

# O reinstalar node con nvm
nvm reinstall-packages
```

### Iniciar el proyecto
Una vez instaladas las dependencias:
```bash
npm run dev
```

Abre tu navegador en `http://localhost:5173`

## Credenciales de Acceso

- **Usuario**: admin
- **Contraseña**: 12345678

## Uso

1. **Landing Page**: Visita la página principal para ver la promoción del servicio
2. **Login**: Haz clic en "Iniciar Sesión" e ingresa las credenciales
3. **Editor**: Una vez autenticado, accede al editor de templates
4. **Seleccionar Template**:
   - Haz clic en el botón "📋 Templates" en el header o sidebar
   - Explora la galería de templates profesionales
   - Filtra por categoría (Negocio, Portfolio, Blog, etc.)
   - **Vista Previa**: Haz clic en "👁️ Vista Previa" para ver cómo se verá el template completo
   - Haz clic en "Usar Template" o "✅ Usar Este Template" (desde la vista previa) para cargarlo
5. **Editar Elementos**:
   - Haz clic en cualquier elemento para seleccionarlo
   - Arrastra elementos para moverlos
   - Usa el panel lateral para editar propiedades
   - Agrega nuevos elementos con los botones "+ Texto", "+ Imagen", "+ Botón" o "+ Header"
   - **Botones**: Personaliza texto, colores, padding, border radius, sombras y efectos hover
   - **Headers**: Crea headers profesionales con logo y navegación funcional
     - Edita logo, items de navegación, colores y tamaños
     - Los enlaces tienen scroll suave a las secciones
     - Opción de header fijo que se mantiene visible al hacer scroll
   - Cambia imágenes arrastrándolas al área de carga
   - Usa "🗑️ Limpiar" para empezar desde cero

## Tecnologías Utilizadas

- React 18
- Vite
- React Router
- React Draggable
- React Dropzone

## Estructura del Proyecto

```
src/
  ├── components/
  │   ├── LandingPage.jsx    # Página de inicio promocional
  │   ├── Login.jsx          # Componente de autenticación
  │   └── Editor.jsx         # Editor de templates
  ├── App.jsx                # Componente principal con rutas
  └── main.jsx               # Punto de entrada
```

## Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run preview`: Previsualiza la build de producción
