# browser-notepad
Web browser notepad I made for my own use


# 開発メモ
## 最初の準備（手動）
1. npm create vite@latest

2. npm install gh-pages

3. add package.json scripts section:

  ```json
   "scripts": {
    ...
    "deploy": "npm run build && gh-pages -d dist -m \"Updates --skip-ci\""
    }
  ```

4. vite.config.ts add base:

   ```ts
   import { defineConfig } from 'vite'

   export default defineConfig({
     base: './',
   })
   ```

5. To deploy: `npm run deploy`

6. GitHub Pages settings: deploy from `gh-pages` branch

7. Access URL: `https://<username>.github.io/<repository>/`
