# deley.pe

**Track:** Access · **Equipo:** team-19 (Bogotá)

deley.pe es una aplicación que muestra **métricas de abogados** a partir del historial de casos que han realizado. El track Access cubre quién entra al panel y quién puede ver esos datos de desempeño.

## Problema

Evaluar o comparar abogados suele basarse en reputación informal. El historial de casos existe, pero no se traduce en métricas claras ni comparables.

## Solución

Un panel que deriva indicadores del historial de casos (volumen, resultados, tiempos, etc. según los datos disponibles) y los muestra por abogado.

El login y el dashboard de la plantilla son el **acceso** al producto: cuentas, sesión y rutas protegidas. El producto es la métrica, no el auth.

## Para quién

Estudios jurídicos, coordinadores de equipo y perfiles internos que necesitan ver desempeño con datos de casos, no con anécdotas.

## Stack

Next.js (App Router), Better Auth, Prisma + PostgreSQL, tRPC, Shadcn UI.

El deploy público se publica en `deploy-url` de `platanus-hack-project.jsonc` cuando esté en Vercel (vía repo personal; el org de Platanus no admite integraciones de deploy).
