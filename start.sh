#!/bin/bash

# Quick Start Script para RustFlix Frontend

clear

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                    🎬 RustFlix Frontend                        ║"
echo "║                   Quick Start v2.1.0                           ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}📦 Estado del Proyecto${NC}"
echo "----------------------------------------"
echo "Versión: 2.1.0"
echo "Estado: ✅ Completo y listo"
echo "Archivos: 34+ archivos"
echo ""

echo -e "${BLUE}🚀 Opciones de Inicio${NC}"
echo "----------------------------------------"
echo "1. Servidor Python (Recomendado)"
echo "2. Servidor Node.js"
echo "3. Ver Documentación"
echo "4. Build para Producción"
echo "5. Salir"
echo ""

read -p "Selecciona una opción (1-5): " option

case $option in
    1)
        echo ""
        echo -e "${GREEN}Iniciando servidor Python...${NC}"
        echo ""
        echo "🌐 Abre tu navegador en: http://localhost:3000"
        echo ""
        echo "Para detener: Presiona Ctrl+C"
        echo ""
        python3 -m http.server 3000
        ;;
    2)
        if command -v npx &> /dev/null; then
            echo ""
            echo -e "${GREEN}Iniciando servidor Node.js...${NC}"
            echo ""
            echo "🌐 Abre tu navegador en: http://localhost:3000"
            echo ""
            npx http-server -p 3000 -c-1
        else
            echo ""
            echo -e "${YELLOW}Node.js no encontrado.${NC}"
            echo "Instala Node.js desde: https://nodejs.org/"
            echo ""
        fi
        ;;
    3)
        echo ""
        echo -e "${GREEN}📚 Documentación Disponible${NC}"
        echo "----------------------------------------"
        echo ""
        echo "📄 README.md             - Inicio"
        echo "📄 STATUS.md             - Estado actual"
        echo "📄 FEATURES.md           - Features detalladas"
        echo "📄 IMPLEMENTATION.md     - Detalles técnicos"
        echo "📄 CONTRIBUTING.md       - Guía de contribución"
        echo "📄 TESTING.md            - Guía de testing"
        echo ""
        read -p "¿Abrir README.md? (s/n): " open_readme
        if [ "$open_readme" = "s" ] || [ "$open_readme" = "S" ]; then
            if command -v cat &> /dev/null; then
                cat README.md | head -n 50
                echo ""
                echo "... (ver archivo completo)"
            fi
        fi
        ;;
    4)
        echo ""
        echo -e "${GREEN}🏗️ Iniciando build...${NC}"
        echo ""
        if [ -f "build.sh" ]; then
            ./build.sh
        else
            echo -e "${YELLOW}build.sh no encontrado${NC}"
        fi
        ;;
    5)
        echo ""
        echo "👋 ¡Hasta luego!"
        echo ""
        exit 0
        ;;
    *)
        echo ""
        echo -e "${YELLOW}Opción inválida${NC}"
        echo ""
        ;;
esac

echo ""
echo "----------------------------------------"
echo "✨ ¡Gracias por usar RustFlix! 🎬"
echo ""
