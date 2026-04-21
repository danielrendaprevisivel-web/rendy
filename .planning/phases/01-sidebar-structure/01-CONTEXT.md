# Phase 1: Estrutura HTML da Sidebar - Context

**Gathered:** 2026-04-17
**Status:** Ready for planning

<domain>
## Phase Boundary

**Phase 1:** Criar estrutura HTML da coluna lateral (sidebar) com os 3 pilares do RP.

The sidebar is:
- A left sidebar column
- Contains 3 pillars: "Produto Previsível", "Conteúdo Intencional", "Vendas"
- Currently does not exist — needs to be created

</domain>

<decisions>
## Implementation Decisions

All requirements from ROADMAP and REQUIREMENTS.

### LAYOUT-01
- [LOCKED] Sidebar containing: Produto Previsível, Conteúdo Intencional, Vendas
- [LOCKED] Posicionada à esquerda da tela principal (left side)
- [LOCKED] Largura definida (approx 250px)

### User Interface
- [LOCKED] Navy (#0d1b2e) background for sidebar
- [LOCKED] Gold (#c9a96e) accents/links

### Fonts
- [LOCKED] Cormorant Garamond for pillar titles
- [LOCKED] Inter for pillar content

</decisions>

<canonical_refs>
## Canonical References

No external specs needed. Implementation in existing index.html.

### Existing Patterns
- `public/index.html` — Main application file
- Design system already defined in CSS :root
- Fonts already loaded via Google Fonts CDN

</canonical_refs>

<specifics>
## Specific Ideas

From REQUIREMENTS.md:
> Sidebar contendo: Produto Previsível, Conteúdo Intencional, Vendas
> Posicionada à esquerda da tela principal
> Largura definida (aprox 250px)

</specifics>

<deferred>
## Deferred Ideas

None for Phase 1.

Phase 1 focuses ONLY on HTML structure. Styling and visibility come in Phases 2-3.

</deferred>

---

*Phase: 01-sidebar-structure*
*Context gathered: 2026-04-17*