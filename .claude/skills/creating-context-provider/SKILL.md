---
name: creating-context-provider
description: Use ao criar um novo React Context Provider neste projeto.
  Cobre estrutura de arquivos, padrão de hook customizado, tipagem do
  contexto, tratamento de valor default, e onde registrar o provider
  na árvore. Trigger quando o usuário pedir "novo contexto", "context
  provider", "estado global para X", ou criar arquivos em src/contexts/.
---

# Criando um Context Provider

## Estrutura de arquivo
[onde vai, como nomear]

## Template base
Veja `template.tsx` neste diretório. Copie e adapte.

## Checklist
- [ ] Tipo do contexto definido
- [ ] Default value e error guard no hook
- [ ] Provider exportado
- [ ] Hook customizado `use<Nome>` exportado
- [ ] Registrado em `src/providers/AppProviders.tsx`

## Anti-patterns
[o que evitar — valores não-memoizados, providers aninhados demais, etc.]