---
name: mock-database
description: Use ao adicionar, consultar, atualizar ou remover entidades no database.json deste projeto POC/MVP. Trigger quando o usuário pedir "nova entidade", "adicionar X ao mock", "criar tabela no database.json", "buscar Y", "novo CRUD mockado", ou ao criar/editar arquivos em src/services/database.ts e src/hooks/. Cobre o schema do JSON, a camada de serviço async, hooks de consumo, mutações em memória e tipagem espelhada. NÃO use para integrações reais com backend ou para persistência server-side.
---
 
# Mock Database — Padrão de acesso ao `database.json`
 
Esta skill define **como** consumir e mutar dados nesta POC. O projeto inteiro depende de uma única fonte de dados: `database.json` na raiz. Toda leitura passa pela camada de serviço; toda mutação acontece em memória via Context. Componentes nunca tocam o JSON diretamente.
 
## Pré-requisitos antes de qualquer alteração
 
Antes de adicionar ou consumir uma entidade, confirme que estes três arquivos existem e estão alinhados:
 
- `database.json` — fonte de dados
- `src/types/models.ts` — tipos espelhando o schema
- `src/services/database.ts` — camada de acesso
Se algum não existir, comece criando-os com o template em `templates/` deste diretório.
 
## Procedimento: adicionar uma nova entidade ao mock
 
Suponha que você precisa adicionar uma entidade `Invoice` (faturas) ao projeto. Execute os passos **nesta ordem** — pular ou inverter quebra a tipagem ou deixa código órfão.
 
### Passo 1 — Definir o schema no `database.json`
 
Adicione a nova "tabela" como chave de topo, sempre como array. Use IDs com prefixo curto e relacionamentos via ID.
 
```json
{
  "users": [...],
  "products": [...],
  "invoices": [
    {
      "id": "i1",
      "userId": "u1",
      "amount": 4500,
      "status": "pending",
      "dueDate": "2026-06-15",
      "createdAt": "2026-05-01T10:00:00Z"
    },
    {
      "id": "i2",
      "userId": "u2",
      "amount": 320,
      "status": "paid",
      "dueDate": "2026-05-20",
      "createdAt": "2026-05-10T14:30:00Z"
    }
  ]
}
```
 
**Convenções obrigatórias:**
 
- Chave de topo no plural (`invoices`, não `invoice`)
- IDs como string com prefixo de 1-2 letras (`i1`, `inv1`)
- Datas em ISO 8601 (`createdAt`, `dueDate`)
- Status como string lowercase (`pending`, `paid`, `overdue`)
- Pelo menos 2-3 registros de exemplo (UI sem dados parece quebrada em demo)
- Relacionamentos sempre por ID, nunca embedados
### Passo 2 — Declarar o tipo em `src/types/models.ts`
 
O tipo espelha **exatamente** o schema. Use union types para enums.
 
```ts
export type Invoice = {
  id: string;
  userId: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  dueDate: string; // ISO date
  createdAt: string; // ISO datetime
};
```
 
Se a entidade tem relacionamento, **não** exporte tipos "hidratados" (`Invoice & { user: User }`). Composição é responsabilidade do serviço, caso a caso.
 
### Passo 3 — Adicionar funções ao serviço em `src/services/database.ts`
 
Toda função é async e simula latência. Mínimo de 4 funções por entidade: `getAll`, `getById`, `create`, `update`. `delete` se aplicável.
 
```ts
import db from '../../database.json';
import type { Invoice } from '@/types/models';
import { delay, generateId } from './_helpers';
 
// Estado mutável em memória — clonado do JSON na inicialização
let invoices: Invoice[] = [...db.invoices] as Invoice[];
 
export const invoicesApi = {
  async getAll(): Promise<Invoice[]> {
    await delay();
    return [...invoices]; // retorna cópia, nunca a referência
  },
 
  async getById(id: string): Promise<Invoice | null> {
    await delay();
    return invoices.find((i) => i.id === id) ?? null;
  },
 
  async getByUser(userId: string): Promise<Invoice[]> {
    await delay();
    return invoices.filter((i) => i.userId === userId);
  },
 
  async create(data: Omit<Invoice, 'id' | 'createdAt'>): Promise<Invoice> {
    await delay();
    const newInvoice: Invoice = {
      ...data,
      id: generateId('i'),
      createdAt: new Date().toISOString(),
    };
    invoices = [...invoices, newInvoice];
    return newInvoice;
  },
 
  async update(id: string, patch: Partial<Omit<Invoice, 'id'>>): Promise<Invoice> {
    await delay();
    const index = invoices.findIndex((i) => i.id === id);
    if (index === -1) throw new Error(`Invoice ${id} não encontrada`);
    invoices[index] = { ...invoices[index], ...patch };
    return invoices[index];
  },
 
  async remove(id: string): Promise<void> {
    await delay();
    invoices = invoices.filter((i) => i.id !== id);
  },
};
```
 
**Regras críticas:**
 
- O array `invoices` (com let) é o estado mutável em memória — alterações ficam vivas durante a sessão
- `getAll` retorna **cópia** (`[...invoices]`), nunca a referência interna — senão consumidores podem mutar acidentalmente o "banco"
- `create` recebe `Omit<T, 'id' | 'createdAt'>` — o serviço gera esses campos, não o caller
- `update` usa `Partial<Omit<T, 'id'>>` — permite atualização parcial mas impede trocar o ID
### Passo 4 — Criar hook de consumo em `src/hooks/`
 
Componentes não chamam o serviço direto. Sempre via hook.
 
```ts
// src/hooks/useInvoices.ts
import { useState, useEffect, useCallback } from 'react';
import { invoicesApi } from '@/services/database';
import type { Invoice } from '@/types/models';
 
export function useInvoices() {
  const [data, setData] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
 
  const refetch = useCallback(() => {
    setIsLoading(true);
    invoicesApi
      .getAll()
      .then(setData)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, []);
 
  useEffect(() => {
    refetch();
  }, [refetch]);
 
  const create = useCallback(
    async (data: Parameters<typeof invoicesApi.create>[0]) => {
      const created = await invoicesApi.create(data);
      setData((prev) => [...prev, created]);
      return created;
    },
    []
  );
 
  const update = useCallback(
    async (id: string, patch: Parameters<typeof invoicesApi.update>[1]) => {
      const updated = await invoicesApi.update(id, patch);
      setData((prev) => prev.map((i) => (i.id === id ? updated : i)));
      return updated;
    },
    []
  );
 
  const remove = useCallback(async (id: string) => {
    await invoicesApi.remove(id);
    setData((prev) => prev.filter((i) => i.id !== id));
  }, []);
 
  return { data, isLoading, error, refetch, create, update, remove };
}
```
 
**Por que atualizar o state local após mutação:** o array em `services/database.ts` muda, mas o React não sabe disso. Atualizar `setData` após cada mutação mantém a UI sincronizada sem precisar fazer refetch.
 
### Passo 5 — Consumir no componente
 
```tsx
function InvoicesPage() {
  const { data, isLoading, error, create, remove } = useInvoices();
 
  if (isLoading) return <Skeleton />;
  if (error) return <ErrorState message={error.message} />;
  if (data.length === 0) return <EmptyState />;
 
  return (
    <div>
      <button
        onClick={() =>
          create({ userId: 'u1', amount: 100, status: 'pending', dueDate: '2026-07-01' })
        }
      >
        Nova fatura
      </button>
      {data.map((invoice) => (
        <InvoiceCard key={invoice.id} invoice={invoice} onDelete={() => remove(invoice.id)} />
      ))}
    </div>
  );
}
```
 
## Helpers compartilhados
 
Crie `src/services/_helpers.ts` uma vez e reutilize em todas as entidades:
 
```ts
export const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));
 
export const generateId = (prefix: string): string => {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
};
```
 
## Buscar com relacionamentos (joins)
 
Quando uma tela precisa de dados de múltiplas entidades, **componha no hook**, não no componente:
 
```ts
// src/hooks/useInvoicesWithUser.ts
export function useInvoicesWithUser() {
  const { data: invoices, isLoading: l1 } = useInvoices();
  const { data: users, isLoading: l2 } = useUsers();
 
  const enriched = invoices.map((invoice) => ({
    ...invoice,
    user: users.find((u) => u.id === invoice.userId) ?? null,
  }));
 
  return { data: enriched, isLoading: l1 || l2 };
}
```
 
Não crie funções `getInvoicesWithUser` no serviço — isso acopla entidades e dificulta a migração futura para backend, onde joins acontecem no servidor.
 
## Checklist final ao adicionar entidade
 
- [ ] Chave adicionada ao `database.json` no plural, com 2+ registros de exemplo
- [ ] Tipo declarado em `src/types/models.ts` espelhando o schema
- [ ] Objeto `{entidade}Api` exportado em `src/services/database.ts` com `getAll`, `getById`, `create`, `update`, e `remove` se aplicável
- [ ] Hook `use{Entidade}` em `src/hooks/` retornando `{ data, isLoading, error, refetch, create, update, remove }`
- [ ] Estado mutável em memória usa `let` e cópia inicial (`[...db.invoices]`)
- [ ] `getAll` retorna cópia, nunca referência interna
- [ ] `create` aceita `Omit<T, 'id' | 'createdAt'>`
- [ ] Componentes que usam a entidade tratam loading, error e empty state
## O que evitar
 
- ❌ Importar `database.json` diretamente em componentes ou hooks
- ❌ Mutar o array interno via `.push()` ou `.splice()` — sempre criar novo array
- ❌ Retornar a referência interna do array (sem spread) — vaza estado mutável
- ❌ Joins no serviço — composição é responsabilidade do hook
- ❌ Esquecer de atualizar `setData` no hook após mutação — UI fica dessincronizada
- ❌ IDs numéricos ou sem prefixo — quebra a convenção e dificulta debug
## Quando migrar para backend real
 
Quando os endpoints existirem, substitua **apenas** o corpo de cada função em `src/services/database.ts` por `fetch`. Mantenha as assinaturas. Os hooks e componentes não mudam.
 
```ts
// Antes (mock)
async getAll(): Promise<Invoice[]> {
  await delay();
  return [...invoices];
}
 
// Depois (real)
async getAll(): Promise<Invoice[]> {
  const res = await fetch('/api/invoices');
  if (!res.ok) throw new Error('Falha ao buscar faturas');
  return res.json();
}
```
 