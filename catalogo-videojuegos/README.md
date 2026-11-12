# Catálogo de videojuegos — Angular + JSON Server 0.17.4

## Puesta en marcha en WSL (Ubuntu)

1. Node.js en WSL (si no lo tienes), con nvm:
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
   source ~/.bashrc
   nvm install --lts
   ```
2. Descomprime el proyecto en el sistema de archivos de Linux (mucho más rápido que /mnt/c):
   ```bash
   cd ~
   unzip /mnt/c/Users/TU_USUARIO/Downloads/catalogo-videojuegos.zip
   cd catalogo-videojuegos
   npm install
   ```
3. Terminal 1 — API (http://localhost:3000/games):
   ```bash
   npm run api
   ```
4. Terminal 2 — Angular (http://localhost:4200):
   ```bash
   npm start
   ```
5. Abre http://localhost:4200 en el navegador de Windows (WSL2 reenvía localhost).

Para editar con VS Code desde WSL: `code .`

## Estructura
- `db.json` — datos de JSON Server
- `src/app/models/game.ts` — interfaces `Game` y `GameFilters`
- `src/app/services/game.service.ts` — todas las peticiones HTTP
- `src/app/app.component.*` — interfaz, eventos y estado
