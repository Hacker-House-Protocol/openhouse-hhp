# Plan de Implementación — Arbitrum Buildathon
# Hacker House Protocol

**Versión**: 1.1 · Junio 2026 (sincronizado con el código)
**Plazo**: 3 semanas
**Para el pitch ejecutivo ver**: `pitch.md` · **Para el deck de presentación ver**: `slides.md`

---

## Decisiones de scope

No se borra HackSpaces — ya está construido. La decisión es **congelar su desarrollo** estas 3 semanas y no protagonizar el pitch.

| Feature | Decisión | Razón |
|---|---|---|
| HackerHouses | **PROTAGONISTA** | Core del pitch. Ya implementado — se le agrega el contrato Arbitrum |
| Smart Contract Arbitrum | **BUILD NOW** | El diferenciador real. Sin esto es una app SaaS con wallet login decorativo |
| Comunidades | **BUILD NOW (scope acotado)** | Growth layer adicional. Invite link + badge + filtro. Sin gobernanza ni páginas públicas |
| HackSpaces (nuevas features) | **CONGELADO** | Existe, funciona, no se toca |

---

## Arquitectura del Smart Contract

**Contrato:** `HackerHouseEscrow.sol` en Arbitrum One

### Funciones
| Función | Descripción |
|---|---|
| `createHouse()` | Organizador define capacidad, precio por persona y deadline |
| `deposit()` | Builder aceptado paga su parte. Fondos lockeados |
| `release()` | Auto: house completa → fondos al organizador |
| `refund()` | Auto: deadline sin completar → reembolso a cada depositor |
| `reject()` | Organizador rechaza un builder → devuelve deposit inmediatamente |
| `mintBookingNFT()` | Auto: pool completo → mint NFT de confirmación para cada builder |

### Yield vía GMX (parte del scope buildathon)
Los fondos lockeados generan yield mientras esperan el release. El frontend ya está cableado y lee del contrato vía `hooks/use-pending-yield.ts`. Funciones view requeridas: `pendingYield()`, `yieldDest()` (0=HOST, 1=BUILDERS), `nextBookingId()`. Ver `docs/web3/gmx-requirements.md` para el detalle de integración. Estado: contrato en testnet, frontend listo.

> **Estado on-chain (junio 2026):** el contrato se demuestra en **Arbitrum Sepolia (testnet)**. La UI de pago/staking de la app está construida (`/dashboard/hacker-houses/[id]/payment`) pero todavía hace un upsert en DB — el cableado app ↔ contrato (wagmi/viem) es lo que se está cerrando. Las columnas escrow/yield ya existen en la tabla `hacker_houses`.

### Por qué Arbitrum
- Gas fees bajos — crítico para deposits de co-living
- EVM-compatible — Solidity directo, sin cambios de arquitectura
- Privy ya soporta Arbitrum — sin cambios en la capa de auth
- El buildathon es de Arbitrum — fit directo con los jueces

---

## Arquitectura de Comunidades

> **Nota (junio 2026):** el plan original acotaba comunidades a "invite link + badge + filtro" sobre una tabla `organizations`. La implementación real terminó siendo **más amplia** y usa tablas dedicadas (`communities`, no `organizations`). Esta sección refleja lo construido.

### Schema (real)
| Tabla | Campos clave | Propósito |
|---|---|---|
| `communities` | id, slug, name, category, logo_url, creator_id, invite_code, is_verified, verification_requested, is_featured, featured_order, display_order | Comunidad u organización |
| `community_members` | community_id, user_id, role, joined_at | Un builder puede pertenecer a varias comunidades |
| `mini_events` | id, community_id, name, location, fechas | Mini-eventos organizados por una comunidad |
| `mini_event_attendees` | mini_event_id, user_id | RSVP a mini-eventos |

### Scope construido (más amplio que el MVP planeado)
- Invite link: `/join/[slug]` — une al builder a la comunidad
- CRUD completo: explorar (`/dashboard/community/explore`), crear, página de detalle (`/dashboard/community/[id]`), gestión de miembros
- Mini-eventos con RSVP, visibles en el mapa interactivo
- Badge de comunidad en perfil y cards + filtro en Builder Discovery
- **Verificación manual** (`is_verified`): la comunidad la solicita (`verification_requested`) y un admin la concede desde `/dashboard/admin` → badge ✓ Verificado
- Featured/orden de comunidades controlado desde el panel admin
- **Sigue en V2:** gobernanza on-chain y comunidades privadas

---

## Plan semana a semana

### Semana 1 — Comunidades + Research del contrato

| Rol | Tareas |
|---|---|
| **PRODUCTO** | Definir flujo completo de invite link · Spec del badge y filtros · Coordinar con Web3 los parámetros que el contrato necesita exponer al backend |
| **BACK** | Migración Supabase: communities + community_members + RLS · API: POST /api/communities, GET /api/communities/[slug] · Lógica de invite_code |
| **FRONT** | Badge de comunidad en ProfileCard y perfil público · Página /join/[slug] · Filtro por comunidad en Builder Discovery |
| **WEB3** | Definir interface del contrato · Setup Hardhat + Arbitrum Sepolia · Primer borrador de HackerHouseEscrow.sol |

### Semana 2 — Smart Contract + Integración backend

| Rol | Tareas |
|---|---|
| **WEB3** | Implementar createHouse(), deposit(), release(), refund(), reject(), mintBookingNFT() · Tests unitarios · Deploy en Arbitrum Sepolia · Exponer ABI y contract address |
| **BACK** | Guardar contract_address en tabla hacker_houses · Listener para sincronizar estado del contrato con DB · Endpoint GET /api/hacker-houses/[id]/contract-status |
| **FRONT** | Componente de deposit en detalle de HackerHouse (wagmi/viem) · Estado en tiempo real: pool actual vs capacidad · Notificación in-app al completarse o ejecutarse refund |
| **PRODUCTO** | Testing del flujo completo en testnet · Documentar el flujo para el pitch · Priorizar edge cases con Web3 dev |

### Semana 3 — Polish, Demo Flow y Deploy

| Rol | Tareas |
|---|---|
| **PRODUCTO** | Definir y ensayar el demo flow de 5 minutos · Preparar presentación (problema, solución, demo, roadmap, ask) · 2 rondas de dogfooding interno |
| **FRONT** | Polish del flujo completo · Mobile responsive en pantallas nuevas · Loading states, error handling y toasts para interacciones on-chain |
| **BACK** | Stress test de endpoints críticos · Verificar que RLS no bloquea ningún paso del demo · Logs y monitoreo para el día del buildathon |
| **WEB3** | Deploy en Arbitrum One (mainnet) · Verificar contrato en Arbiscan · Soporte técnico on-chain durante el demo |

---

## Fuera de scope estas 3 semanas

Cualquier trabajo fuera de esta lista es scope creep y pone en riesgo el buildathon.

| Feature | Estado |
|---|---|
| HackSpaces (nuevas features) | CONGELADO — existe, no se toca |
| Pagos on-chain completos (Fase 2) | CONGELADO — el contrato del buildathon es un subset acotado |
| Página pública (sin auth / SEO) de comunidad | V2 — la página de detalle interna (`/dashboard/community/[id]`) sí se construyó |
| Gobernanza de comunidades | V2 — fuera de scope |
| Chat interno | V2 — fuera de scope |
| Cypher Kittens NFT minteable | V2 — fuera de scope |
| Filtros on-chain (POAPs, NFTs, score) | Fase 2 — los campos existen, la validación no |

---

## Riesgos y mitigación

| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| Contrato tarda más de lo esperado | MEDIA | Web3 dev arranca en semana 1. Si hay bloqueo, el pitch presenta el contrato en testnet como demo funcional |
| Scope creep en comunidades | ALTA | El MVP planeado era invite link + badge + filtro; en la práctica se construyó más (CRUD, detalle, mini-eventos, verificación). Mantener gobernanza y comunidades privadas en V2 |
| Buildathon requiere mainnet (no testnet) | BAJA | Verificar requisitos en semana 1. Deploy a mainnet toma < 1 hora si el contrato ya pasó tests |
| Mobile no responsive a tiempo | MEDIA | Front prioriza mobile desde el inicio. Si hay tiempo límite, el demo se hace en desktop |

---

## Métricas objetivo — 60 días post-buildathon

| Métrica | Target |
|---|---|
| Builders registrados | 200 |
| Hacker Houses creadas | 15 |
| Houses con pool on-chain completado | 8 |
| ETH coordinado via contrato | 5 ETH |
| Eventos cubiertos | 3 (ETHGlobal + 2 regionales) |
| Comunidades onboarded | 3 |
