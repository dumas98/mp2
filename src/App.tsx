import { useProducts } from './hooks/useProducts.ts'

// Temporary: shows the products store status until the routes arrive in step 1.8
function App() {
  const { status, products, usedFallback, retry } = useProducts()

  if (status === 'loading') return <p>Loading products…</p>
  if (status === 'error') {
    return (
      <p>
        Couldn't load products. <button type="button" onClick={retry}>Retry</button>
      </p>
    )
  }
  return (
    <p>
      {products.length} products loaded from {usedFallback ? 'the saved copy' : 'DummyJSON'}.
    </p>
  )
}

export default App
