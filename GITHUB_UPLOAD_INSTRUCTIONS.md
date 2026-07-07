# RabbAI GitHub Upload

Upload the contents of this folder to the root of a new GitHub repository.

The repository root should contain:
- package.json
- package-lock.json
- vite.config.js
- index.html
- .gitignore
- README.md
- src/

Do not upload the enclosing RabbAI_GitHub_Upload folder as an extra nested level if using Vercel. `package.json` should be visible at the repository root.

Vercel settings:
- Framework: Vite
- Build command: npm run build
- Output directory: dist
- Install command: npm install
