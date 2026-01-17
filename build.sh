#!/bin/bash

# Build Script para RustFlix Frontend
# Este script prepara el proyecto para producción

echo "🎬 RustFlix - Build Script"
echo "=========================="
echo ""

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Función para mensajes
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Verificar si existe el directorio de distribución
if [ -d "dist" ]; then
    print_warning "Limpiando directorio dist..."
    rm -rf dist
fi

# Crear directorio de distribución
print_success "Creando directorio dist..."
mkdir -p dist/css dist/js dist/assets

# Copiar archivos HTML
print_success "Copiando archivos HTML..."
cp *.html dist/

# Copiar CSS
print_success "Copiando CSS..."
cp css/styles.css dist/css/

# Copiar JavaScript
print_success "Copiando JavaScript..."
cp js/*.js dist/js/

# Copiar assets
print_success "Copiando assets..."
cp -r assets/* dist/assets/ 2>/dev/null || print_warning "No hay assets para copiar"

# Copiar manifest y service worker
print_success "Copiando PWA files..."
cp manifest.json dist/
cp service-worker.js dist/

# Copiar .gitignore y documentación
print_success "Copiando documentación..."
cp .gitignore dist/ 2>/dev/null || true
cp README.md dist/ 2>/dev/null || true
cp CONTRIBUTING.md dist/ 2>/dev/null || true

# Opcional: Minificar CSS (requiere npm y csso-cli)
if command -v csso &> /dev/null; then
    print_success "Minificando CSS..."
    csso dist/css/styles.css -o dist/css/styles.min.css
else
    print_warning "csso no encontrado, saltando minificación de CSS"
    print_warning "Instalar con: npm install -g csso-cli"
fi

# Opcional: Minificar JS (requiere npm y terser)
if command -v terser &> /dev/null; then
    print_success "Minificando JavaScript..."
    for file in dist/js/*.js; do
        filename=$(basename "$file" .js)
        terser "$file" -o "dist/js/${filename}.min.js" -c -m
    done
else
    print_warning "terser no encontrado, saltando minificación de JS"
    print_warning "Instalar con: npm install -g terser"
fi

# Generar hash de archivos para cache busting
print_success "Generando checksums..."
cd dist
find . -type f -name "*.js" -o -name "*.css" | while read file; do
    md5sum "$file" >> checksums.txt 2>/dev/null || shasum -a 256 "$file" >> checksums.txt
done
cd ..

# Crear archivo de información de build
print_success "Creando build info..."
cat > dist/build-info.json << EOF
{
    "version": "2.0.0",
    "buildDate": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
    "environment": "production"
}
EOF

echo ""
echo "=========================="
print_success "Build completado exitosamente!"
echo ""
echo "📦 Archivos generados en: ./dist"
echo ""
echo "Para servir el build de producción:"
echo "  cd dist && python -m http.server 8080"
echo ""
echo "Para deploy:"
echo "  - Subir contenido de /dist a tu servidor"
echo "  - Configurar servidor web (nginx/apache)"
echo "  - Actualizar API_BASE_URL en config.js"
echo ""
