#!/bin/bash

# Script de instalación alternativa para WebBuilder
# Si npm tiene problemas de permisos, intenta estas soluciones:

echo "Instalando dependencias para WebBuilder..."

# Opción 1: Intentar con npm normalmente
if npm install; then
    echo "✅ Dependencias instaladas correctamente con npm"
    exit 0
fi

echo "⚠️  npm falló, intentando soluciones alternativas..."

# Opción 2: Limpiar caché de npm
echo "Limpiando caché de npm..."
npm cache clean --force

# Opción 3: Reinstalar con --legacy-peer-deps
echo "Intentando instalación con --legacy-peer-deps..."
npm install --legacy-peer-deps

# Si todo falla, mostrar instrucciones
if [ $? -ne 0 ]; then
    echo ""
    echo "❌ La instalación automática falló."
    echo ""
    echo "Soluciones manuales:"
    echo "1. Ejecuta: npm install --legacy-peer-deps"
    echo "2. O usa: npm install --force"
    echo "3. O corrige permisos de npm: sudo chown -R $(whoami) ~/.npm"
    echo "4. O reinstala node/npm con nvm"
    exit 1
fi

echo "✅ Instalación completada!"
