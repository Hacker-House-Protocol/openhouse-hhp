# Plan de Implementación — Arbitrum Buildathon
# Hacker House Protocol

**Versión**: 1.0 · Mayo 2026
**Plazo**: 3 semanas
**Para el pitch ejecutivo ver**: `pitch-v2.md`

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

### Por qué Arbitrum
- Gas fees bajos — crítico para deposits de co-living
- EVM-compatible — Solidity directo, sin cambios de arquitectura
- Privy ya soporta Arbitrum — sin cambios en la capa de auth
- El buildathon es de Arbitrum — fit directo con los jueces

---

## Arquitectura de Comunidades

**Decisión:** Extender la tabla `organizations` ya planificada en Supabase con `type: 'organization' | 'community'`. Evita duplicar infraestructura.

### Schema
| Tabla | Campos clave | Propósito |
|---|---|---|
| `organizations` | id, slug, name, type, logo_url, creator_id, invite_code, is_verified | Comunidad informal u organización verificada |
| `org_members` | org_id, user_id, role ('admin'\|'member'), joined_at | Un builder puede pertenecer a múltiples comunidades |

### Scope MVP de comunidades (solo esto)
- Invite link: `hackerhouse.app/join/[slug]` — auto-asigna al builder al registrarse
- Badge de comunidad en perfil público y BuilderCard
- Filtro por comunidad en Builder Discovery
- **Sin** página pública de comunidad, gobernanza ni comunidades privadas (V2)

---

## Plan semana a semana

### Semana 1 — Comunidades + Research del contrato

| Rol | Tareas |
|---|---|
| **PRODUCTO** | Definir flujo completo de invite link · Spec del badge y filtros · Coordinar con Web3 los parámetros que el contrato necesita exponer al backend |
| **BACK** | Migración Supabase: organizations + org_members + RLS · API: POST /api/communities, GET /api/communities/[slug] · Lógica de invite_code |
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
| Página pública de comunidad | V2 — fuera de scope |
| Gobernanza de comunidades | V2 — fuera de scope |
| Chat interno | V2 — fuera de scope |
| Cypher Kittens NFT minteable | V2 — fuera de scope |
| Filtros on-chain (POAPs, NFTs, score) | Fase 2 — los campos existen, la validación no |

---

## Riesgos y mitigación

| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| Contrato tarda más de lo esperado | MEDIA | Web3 dev arranca en semana 1. Si hay bloqueo, el pitch presenta el contrato en testnet como demo funcional |
| Scope creep en comunidades | ALTA | El MVP es: invite link + badge + filtro. Todo lo demás es V2 |
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
