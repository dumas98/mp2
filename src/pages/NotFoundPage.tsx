import { EmptyState } from '../components/common/EmptyState.tsx'

interface NotFoundPageProps {
  title?: string
  message?: string
}

// Used for unknown URLs, departments and products
export function NotFoundPage({
  title = 'Page not found',
  message = "The page you're looking for doesn't exist.",
}: NotFoundPageProps) {
  return (
    <EmptyState
      title={title}
      message={message}
      actions={[
        { label: 'Shop all products', to: '/all' },
        { label: 'Go to home page', to: '/' },
      ]}
    />
  )
}
