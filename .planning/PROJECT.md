# Project Rendy

**Core Value:** Chatbot guiado para definição de produto digital no programa RP (Renda Previsível).

**Status:** Ativo

---

## Milestone atual: v2.0 Módulos RP + Painel Admin

**Goal:** Adicionar 3 módulos clicáveis após fluxo do bot + painel admin para visualização de resumos.

**Target features:**
- 3 módulos clicáveis reemplazar sidebar atual: Produto Previsível, Conteúdo Intencional, Vendas
- Cada módulo editável pelo aluno (conteúdo salvo pelo bot)
- Painel admin com login Supabase - visualizar resumos de todos os usuários
- Reaproveitar dados da tabela chat_history existente

**Features adicionais (pendentes metodologia):**
- Módulo 2: Biografia Instagram + Posts fixos + Roteiro Reels (placeholder)
- Módulo 3: Script de vendas 7 passos (placeholder)

---

## Active Requirements

### MODULOS-01
- [ ] **MODULOS-01**: Substituir sidebar por 3 módulos clicáveis (Produto Previsível, Conteúdo Intencional, Vendas)

### MODULOS-02
- [ ] **MODULOS-02**: Cada módulo editável - salvar conteúdo em localStorage

### MODULOS-03
- [ ] **MODULOS-03**: Conteúdo do Módulo 1 (nicho, público, persona) - preenchido automaticamente ao final do chat

### ADMIN-01
- [ ] **ADMIN-01**: Página admin com login via Supabase (mesma credencial, autorização)

### ADMIN-02
- [ ] **ADMIN-02**: Listar todos os usuários com resumos da tabela chat_history

### CONTEUDO-01 (placeholder)
- [ ] **CONTEUDO-01**: Módulo 2 - Biografia Instagram + Posts fixos + Roteiro Reels (placeholder)

### VENDAS-01 (placeholder)
- [ ] **VENDAS-01**: Módulo 3 - Script de vendas 7 passos (placeholder)

---

## Validated Requirements

_nenhum_

---

## Out of Scope

- Criar metodologia dos 7 passos de vendas (fornecida depois)
- Criar roteiro de Reels (fornecido depois)
- Criar metodologia de posts fixos (fornecida depois)
- Backend adicional - usar chat_history existente

---

## Key Decisions

- Sidebar → 3 módulos clicáveis (substituição)
- Login admin via Supabase (mesmo sistema)
- Persistência admin reaproveita chat_history
- Módulos 2 e 3 com placeholder até metodologia fornecida

---

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---

## Context

**Stack:** Static HTML + vanilla JS, Supabase Auth, Vercel Serverless + Gemini

**Stack Admin:** Mesmo stack + tabela chat_history existente

**Last updated:** 2026-04-17