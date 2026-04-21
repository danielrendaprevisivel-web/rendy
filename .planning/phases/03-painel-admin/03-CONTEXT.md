# Phase 3: Painel Admin — Context

**Date:** 2026-04-17

## Requirements

- ADMIN-01: Página admin com login via Supabase
- ADMIN-02: Listar todos os usuários com resumos da tabela chat_history

## User Decisions

1. **Admin authentication:** Login com usuário admin via Supabase (mesma credencial)
2. **Data source:** Reaproveitar tabela chat_history existente
3. **UI pattern:** Lista de alunos + detalhe ao clicar
4. **Content to display:**
   - Nicho e subnicho
   - Público-alvo (idade, sexo, localização, país, profissão, renda)
   - Persona (sonhos, dores, dificuldades, crenças, concreto)
   - Biografia Instagram (Module 2 content)
   - Roteiro de Reels (Module 2 content)
   - Script de vendas (Module 3 content)

## Implementation Notes

- Verificar se usuário tem role admin (via campo na tabela auth.users ou tabela users)
- Query: buscar todos de chat_history, join com auth.users para email
- Ao clicar em aluno, abrir modal ou painel lateral com todos os dados
- Dados do Module 2 e 3 vem de localStorage (para cada usuário) — precisar store no Supabase também ou adaptar