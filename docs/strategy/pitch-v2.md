# Pitch v2 — Hacker House Protocol
# Arbitrum Open House London Buildathon

**Versión**: 2.2 · Mayo 2026
**Formato**: Slide por slide — listo para trasladar a presentación

---

## SLIDE 1 — Cover

**Título:** Hacker House Protocol

**Subtítulo:** El lugar donde los builders encuentran su casa — y la coordinan on-chain.

**Contexto:** Arbitrum Open House London Online Buildathon

---

## SLIDE 2 — Problem

**Headline:** Coordinar una Hacker House no debería depender de la buena voluntad de nadie.

- Los builders viajan a los mismos eventos pero no tienen dónde encontrarse de forma estructurada
- Siempre hay un organizador responsable — pero el proceso es manual, frágil y sin garantías: persigue pagos, recibe fondos de fe, y no puede ofrecer reembolso automático si algo falla
- No hay infraestructura crypto-nativa para los tres modelos reales: **copayment** entre builders, **sponsor** de una organización, o **staking** como compromiso
- Las comunidades se disuelven después de cada evento — sin persistencia, sin identidad acumulada

**El protocolo no reemplaza al organizador — le da la infraestructura para que su responsabilidad sea trustless, automática y verificable on-chain.**

---

## SLIDE 3 — Solution

**Headline:** MATCH → BUILD → CO-LIVE

- **MATCH** — Conecta builders por identidad on-chain: POAPs, Talent Protocol skill tags, wallet con historial. Matching verificable, no auto-declarado.
- **BUILD** — Hack Spaces para formar equipos y colaborar remotamente en proyectos reales.
- **CO-LIVE** — Hacker Houses coordinadas on-chain en Arbitrum. Pool de fondos vía smart contract. Sin intermediarios.

---

## SLIDE 4 — How it works

**Headline:** Del discovery al NFT de booking — todo on-chain.

```
Builder entra → Explora Hacker Houses (ciudad, fecha, perfil)
      ↓
Le interesa una → Aplica
      ↓
Es aceptado → Hace su parte del pool en Arbitrum
      ↓
House completa  →  fondos al organizador  →  NFT de booking en tu wallet
House no completa  →  refund automático a cada builder
```

La confirmación de tu Hacker House es un **NFT en Arbitrum** con fechas, ubicación y detalles del espacio. Las llaves de tu casa viven on-chain.

---

## SLIDE 5 — Smart Contract (El diferenciador Arbitrum)

**Headline:** El contrato hace el trabajo que antes hacía la confianza ciega.

| Acción | Quién | Qué ocurre |
|---|---|---|
| `createHouse()` | Organizador | Define capacidad, precio y deadline |
| `deposit()` | Builder aceptado | Paga su parte. Fondos lockeados |
| `release()` | Contrato (auto) | House completa → fondos al organizador |
| `refund()` | Contrato (auto) | Deadline sin completar → reembolso automático |
| `mintBookingNFT()` | Contrato (auto) | Pool completo → NFT de confirmación a cada builder |

**Por qué Arbitrum:** Gas fees bajos (crítico para co-living), EVM maduro, Privy ya lo soporta.

---

## SLIDE 6 — Target Audience

**Headline:** Para quien lo construimos.

- Builders que viajan a hackathons y eventos Web3
- Comunidades tech que se organizan alrededor de eventos
- Organizaciones y DAOs que quieren patrocinar Hacker Houses
- Equipos de startups y founders que necesitan coordinar co-living

---

## SLIDE 7 — Business Model

**Headline:** Cómo genera valor el protocolo.

| Fuente | Detalle |
|---|---|
| **Comisión del host** | 1% sobre el total coordinado por la plataforma |
| **Yield del staking** | Fondos lockeados generan yield mientras esperan el release |
| **Houses patrocinadas** | DAOs y empresas financian houses con su marca — Base House, Arbitrum House |

---

## SLIDE 8 — Traction / Estado actual

**Headline:** Ya construido. Esto es lo que falta.

✅ Auth + Cypher Identity (perfil on-chain)
✅ Hacker Houses — crear, listar, aplicar, gestionar
✅ Builder Discovery + Matching algorítmico
✅ Sistema de amistades + Notificaciones + Mapa interactivo

🔨 Smart contract Arbitrum (pool + escrow + NFT de booking)
🔨 Integración contrato ↔ UI de HackerHouses
🔨 Comunidades — invite link, badge, filtros

---

## SLIDE 9 — Roadmap

| Fase | Foco |
|---|---|
| **Buildathon (ahora)** | Pool on-chain + NFT booking + Comunidades como growth layer |
| **Fase 2** | Yield del staking · Houses patrocinadas · Filtros on-chain |
| **V2** | Chat interno · Gobernanza de comunidades · Experiencia gamificada |
| **V3** | ZK Matching · ZK Identity · Cross-chain |

---

## SLIDE 10 — CTA / Closing

**Headline:** Let's redefine how builders travel, build, and co-live.

> "Éramos 4 builders yendo a ETHGlobal.
> Cada uno pagó su parte on-chain.
> Si no llegábamos a 4, todo volvía automáticamente.
> Llegamos. El NFT de booking apareció en nuestras wallets esa noche."

**Join the protocol. Build your Hacker House.**

---

*Versión del pitch: 2.2 · Mayo 2026 · Para el plan de implementación ver `plan-buildathon.md`*
