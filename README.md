# deley.com

Track: Access · Platanus Hack 26 Bogotá · team-19

<img src="./project-logo.png" alt="deley.com" width="200" />

Métricas de magistrados ponentes a partir de providencias del Consejo de Estado. Acceso autenticado al panel (Next.js, Better Auth, Prisma, tRPC, PostgreSQL).

## Equipo

- Luiz Arnold Chavez Burgos ([@luizarnoldch](https://github.com/luizarnoldch))
- Fernando Villegas ([@FernandoVillegas13](https://github.com/FernandoVillegas13))
- Carlos Ricardo Villena Cabrejos ([@CarlosVillena17](https://github.com/CarlosVillena17))

## Correr en local

La app Next.js está en `web-ui/`. Setup detallado: [web-ui/README.app.md](./web-ui/README.app.md).

```bash
cd web-ui
bun install
cp .env.example .env
# DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL, NEXT_PUBLIC_APP_URL
bunx prisma migrate dev
bun dev
```

Opcional: `docker compose up` desde `web-ui/` para Minio.

## Deploy (Vercel, Render, Netlify)

Esas plataformas solo conectan a repos **tuyos**, no al de la org Platanus. Mirror a un repo personal:

```bash
git remote set-url --add --push origin https://github.com/platanus-hack/platanus-hack-26-co-team-19.git
git remote set-url --add --push origin https://github.com/<your-user>/<your-repo>.git
```

`git push` actualiza ambos. Conecta el deploy al repo personal y pega la URL en `deploy-url` de `platanus-hack-project.jsonc`.
