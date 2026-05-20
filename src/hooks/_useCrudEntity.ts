import { useCallback, useEffect, useState } from 'react'

// Padrão genérico de consumo de uma entidade do mock database.
// Cada hook `useX` em `src/hooks/` apenas conecta a Api específica a esse
// helper — preserva o shape recomendado pelo skill (`{ data, isLoading,
// error, refetch, create, update, remove }`) sem duplicar boilerplate.

type CrudApi<T extends { id: string }, C, U> = {
  getAll: () => Promise<T[]>
  create: (data: C) => Promise<T>
  update: (id: string, patch: U) => Promise<T>
  remove: (id: string) => Promise<void>
}

export function useCrudEntity<T extends { id: string }, C, U>(api: CrudApi<T, C, U>) {
  const [data, setData] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Fetch inicial: mantém `setState` apenas dentro de callbacks do Promise
  // para não disparar `react-hooks/set-state-in-effect`. `cancelled` evita
  // race condition se o consumidor desmontar antes do delay simulado.
  useEffect(() => {
    let cancelled = false
    api.getAll()
      .then((next) => { if (!cancelled) setData(next) })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e : new Error(String(e)))
      })
      .finally(() => { if (!cancelled) setIsLoading(false) })
    return () => { cancelled = true }
  }, [api])

  const refetch = useCallback(() => {
    setIsLoading(true)
    api.getAll()
      .then(setData)
      .catch((e: unknown) => setError(e instanceof Error ? e : new Error(String(e))))
      .finally(() => setIsLoading(false))
  }, [api])

  const create = useCallback(
    async (payload: C) => {
      const created = await api.create(payload)
      setData((prev) => [...prev, created])
      return created
    },
    [api],
  )

  const update = useCallback(
    async (id: string, patch: U) => {
      const updated = await api.update(id, patch)
      setData((prev) => prev.map((item) => (item.id === id ? updated : item)))
      return updated
    },
    [api],
  )

  const remove = useCallback(
    async (id: string) => {
      await api.remove(id)
      setData((prev) => prev.filter((item) => item.id !== id))
    },
    [api],
  )

  return { data, isLoading, error, refetch, create, update, remove }
}
