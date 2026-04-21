# Requirements: Rendy v2 — Módulos RP + Painel Admin

**Defined:** 2026-04-17
**Core Value:** Chatbot guiado para definição de produto digital com 3 módulos clicáveis e painel admin

## v1 Requirements

### Módulos

- [ ] **MODULOS-01**: Substituir sidebar por 3 módulos clicáveis (Produto Previsível, Conteúdo Intencional, Vendas)
  - Cada módulo como botão/card após fluxo do chat
  - Layout: 3 colunas ou 3 cards empilhados
  - Títulos: "Produto Previsível", "Conteúdo Intencional", "Vendas"

- [ ] **MODULOS-02**: Cada módulo editável - salvar conteúdo em localStorage
  - Campos editáveis via textarea ou contenteditable
  - Salvar automaticamente ao modificar (debounce)
  - Carregar conteúdo ao abrir módulo

- [ ] **MODULOS-03**: Conteúdo do Módulo 1 preenchido automaticamente ao final do chat
  - Ao receber [RESUMO_COMPLETO], popular campos: nicho, subnicho, público, persona
  - Exibir no Módulo 1 após resumo

### Admin

- [ ] **ADMIN-01**: Páginaadmin com login via Supabase
  - Rota /admin ou parâmetro ?mode=admin
  - Verificar se usuário tem role admin (via tabela users ou campo)
  - Redirecionar se não autorizado

- [ ] **ADMIN-02**: Listar todos os usuários com resumos da tabela chat_history
  - Query: select user_id, summary_data, created_at from chat_history
  - Exibir lista com: email (via auth.users), nicho, subnicho, data
  - Ao clicar, abrir resumo detalhado

### Placeholders (metodologia futura)

- [ ] **CONTEUDO-01**: Módulo 2 - Biografia Instagram + Posts fixos + Roteiro Reels
  - Placeholder: campos vazios com instructional text
  - Comentário no código indicando onde metodologia será inserida

- [ ] **VENDAS-01**: Módulo 3 - Script de vendas 7 passos
  - Placeholder: campos vazios com instructional text
  - Comentário no código indicando onde metodologia será inserida

## v2 Requirements

_nenhum_

## Out of Scope

| Feature | Reason |
|---------|--------|
| Metodologia 7 passos de vendas | fornecida depois - placeholder |
| Roteiro Reels estruturado | fornecido depois - placeholder |
| Posts fixos metodologia | fornecida depois - placeholder |
| Backend adicional | reutilizar chat_history existente |
| Autenticação admin separada | usar mesma tabela users com role |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| MODULOS-01 | Phase 1 | Complete |
| MODULOS-02 | Phase 1 | Complete |
| MODULOS-03 | Phase 2 | Complete |
| ADMIN-01 | Phase 3 | Complete |
| ADMIN-02 | Phase 3 | Complete |
| CONTEUDO-01 | Phase 4 | Complete |
| VENDAS-01 | Phase 4 | Complete |

**Coverage:**
- v1 requirements: 7 total
- Mapped to phases: 0 ⚠️
- Unmapped: 7 ⚠️

---
*Requirements defined: 2026-04-17*
*Last updated: 2026-04-17 after new-milestone*