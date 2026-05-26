# KRATOS Mockup Asset Inventory

**Gerado em:** 2026-05-24  
**Operador:** Lucas Tigre  
**Objetivo:** Mapear todos os assets visuais disponíveis para uso como backgrounds das telas de ilha no KRATOS Mission Control.

---

## Fontes de Assets

### Fonte A: `/public/islands/` (projeto KRATOS)
Assets originados do pacote Kimi — mockups com UI completa (~400KB cada, 1280x960px estimado).

### Fonte B: `Desktop/OMNIS_KRATOS.../ocr_package (1)/`
Assets gerados via ChatGPT Image (13 mai 2026) — mockups de alta resolucao com UI fake rica (~3.3MB cada).

### Fonte C: `/public/assets/images/` (projeto KRATOS)
world-map-mockup.png original em alta resolucao (~2.3MB).

---

## Destino Canônico

Todos os assets copiados para:
```
C:\Users\lucas\kratos-mission-control\public\assets\images\islands\
```

Referencia no React: `/assets/images/islands/<nome>.png`

---

## Inventário Completo

### Assets de Desktop (ocr_package — ChatGPT Images, ~3.3MB cada)

| Arquivo Original | Ilha/Tela | Tamanho | Tem UI fake? | Pode ser background? | Copiado para assets? |
|---|---|---|---|---|---|
| ChatGPT Image 17_57_00 (1).png | Vila Viva (v3) | 3.421 KB | Sim | Sim | `vila-v3.png` |
| ChatGPT Image 17_57_06.png | Arena Comercial | 3.329 KB | Sim | Sim | `arena.png` |
| ChatGPT Image 17_57_14.png | Observatorio (v2) | 3.411 KB | Sim | Sim | `observatorio-v2.png` |
| ChatGPT Image 17_57_31.png | Vila Viva (v2) | 3.386 KB | Sim | Sim | `vila-v2.png` |
| ChatGPT Image 17_57_36.png | Filosofia & Sabedoria (v2) | 3.341 KB | Sim | Sim | `filosofia-v2.png` |
| ChatGPT Image 17_57_40.png | Observatorio (v3) | 3.371 KB | Sim | Sim | `observatorio-v3.png` |
| ChatGPT Image 17_57_53.png | Visao Geral / World Map (v2) | 3.341 KB | Sim | Sim | `world-map-v2.png` |
| ChatGPT Image 17_57_58.png | Nimbus (v2) | 3.281 KB | Sim | Sim | `nimbus-v2.png` |
| ChatGPT Image 17_58_14.png | Agencia / Estudio (v2) | 3.271 KB | Sim | Sim | `agencia-v2.png` |
| ChatGPT Image 17_59_46.png | OMNIS Lab (v2) | 3.258 KB | Sim | Sim | `omnis-lab-v2.png` |

### Assets do Projeto — /public/islands/ (Kimi, ~400KB cada)

| Arquivo | Ilha/Tela | Tamanho | Tem UI fake? | Pode ser background? | Copiado para assets? |
|---|---|---|---|---|---|
| 01_AKASHA_GRINGOTTS.png | Akasha / Gringotts | 413 KB | Sim | Sim | `akasha.png` |
| 02_OMNIS_LAB.png | OMNIS LAB | 378 KB | Sim | Sim | `omnis-lab.png` |
| 03_AGENCIA_ESTUDIO_V2.png | Agencia / Estudio | 394 KB | Sim | Sim | `agencia.png` |
| 04_AGENCIA_ESTUDIO_V1.png | Agencia / Estudio (v1) | 439 KB | Sim | Sim | `agencia-v1.png` |
| 05_NIMBUS_ACADEMY.png | Nimbus | 393 KB | Sim | Sim | `nimbus.png` |
| 06_VISAO_GERAL_MAPA.png | Visao Geral / World Map | 423 KB | Sim | Sim | `world-map.png` |
| 07_FILOSOFIA_SABEDORIA.png | Filosofia / Sabedoria | 412 KB | Sim | Sim | `filosofia.png` |
| 08_VILA_VIVA.png | Vila Viva | 417 KB | Sim | Sim | `vila.png` |
| 09_OBSERVATORIO.png | Observatorio | 449 KB | Sim | Sim | `observatorio.png` |

### Asset de Alta Resolucao — world-map-mockup.png

| Arquivo | Ilha/Tela | Tamanho | Tem UI fake? | Pode ser background? | Copiado para assets? |
|---|---|---|---|---|---|
| world-map-mockup.png | Visao Geral / World Map | 2.366 KB | Sim | Sim | `world-map-hires.png` |

---

## Mapeamento: Rota → Asset Disponivel

| Rota | Ilha | Asset Recomendado (primario) | Alternativas |
|---|---|---|---|
| `/` | Visao Geral / World Map | `/assets/images/islands/world-map-hires.png` | `world-map.png`, `world-map-v2.png` |
| `/ilhas/omnis` | OMNIS LAB | `/assets/images/islands/omnis-lab.png` | `omnis-lab-v2.png` |
| `/ilhas/akasha` | Akasha / Gringotts | `/assets/images/islands/akasha.png` | — |
| `/ilhas/arena` | Arena Comercial | `/assets/images/islands/arena.png` | — |
| `/ilhas/agencia` | Agencia / Estudio | `/assets/images/islands/agencia.png` | `agencia-v1.png`, `agencia-v2.png` |
| `/ilhas/forja` | Forja / Corpo | **SEM MOCKUP** | — |
| `/ilhas/vila` | Vila Viva | `/assets/images/islands/vila.png` | `vila-v2.png`, `vila-v3.png` |
| `/ilhas/observatorio` | Observatorio | `/assets/images/islands/observatorio.png` | `observatorio-v2.png`, `observatorio-v3.png` |
| `/ilhas/tesouro` | Tesouro / Financas | **SEM MOCKUP** | — |
| `/ilhas/nimbus` | Nimbus | `/assets/images/islands/nimbus.png` | `nimbus-v2.png` |
| `/ilhas/filosofia` | Filosofia / Sabedoria | `/assets/images/islands/filosofia.png` | `filosofia-v2.png` |

---

## Ilhas SEM Mockup (gap)

As seguintes ilhas nao possuem nenhum asset visual disponivel:

| Ilha | Rota | Status |
|---|---|---|
| Forja / Corpo | `/ilhas/forja` | Nenhum mockup encontrado em nenhuma fonte |
| Tesouro / Financas | `/ilhas/tesouro` | Nenhum mockup encontrado em nenhuma fonte |

**Acao sugerida:** Gerar via ChatGPT Image ou usar placeholder com gradiente CSS ate ter o asset.

---

## Uso no React

```tsx
// Exemplo de uso como background
<div
  style={{
    backgroundImage: `url('/assets/images/islands/omnis-lab.png')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
/>

// Ou via CSS module / Tailwind
// background-image: url('/assets/images/islands/arena.png');
```

### Paths completos por ilha

```ts
export const ISLAND_BACKGROUNDS = {
  world:       '/assets/images/islands/world-map-hires.png',
  omnis:       '/assets/images/islands/omnis-lab.png',
  akasha:      '/assets/images/islands/akasha.png',
  arena:       '/assets/images/islands/arena.png',
  agencia:     '/assets/images/islands/agencia.png',
  nimbus:      '/assets/images/islands/nimbus.png',
  filosofia:   '/assets/images/islands/filosofia.png',
  vila:        '/assets/images/islands/vila.png',
  observatorio:'/assets/images/islands/observatorio.png',
  // forja e tesouro: sem mockup disponivel
} as const;
```

---

## Resumo de Assets por Localizacao no Projeto

```
C:\Users\lucas\kratos-mission-control\
  public\
    assets\images\
      world-map-mockup.png          (2.366 KB) — original hi-res
      islands\                       ← PASTA CANONICA (20 arquivos)
        akasha.png                   (413 KB)
        agencia.png                  (394 KB)
        agencia-v1.png               (439 KB)
        agencia-v2.png               (3.271 KB)
        arena.png                    (3.329 KB)   ← unico mockup de arena
        filosofia.png                (412 KB)
        filosofia-v2.png             (3.341 KB)
        nimbus.png                   (393 KB)
        nimbus-v2.png                (3.281 KB)
        observatorio.png             (449 KB)
        observatorio-v2.png          (3.411 KB)
        observatorio-v3.png          (3.371 KB)
        omnis-lab.png                (378 KB)
        omnis-lab-v2.png             (3.258 KB)
        vila.png                     (417 KB)
        vila-v2.png                  (3.386 KB)
        vila-v3.png                  (3.422 KB)
        world-map.png                (423 KB)
        world-map-hires.png          (2.366 KB)
        world-map-v2.png             (3.341 KB)
    islands\                         ← FONTE ORIGINAL (nao renomeada)
      01_AKASHA_GRINGOTTS.png
      02_OMNIS_LAB.png
      ...09_OBSERVATORIO.png
  frontend\public\references\kimi\   ← copia de referencia (nao usar diretamente)
  frontend\dist\references\kimi\     ← build output (nao usar diretamente)
```
