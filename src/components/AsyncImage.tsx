import { useState } from 'react'
import { ImageOff, RefreshCw } from 'lucide-react'

interface AsyncImageProps {
  src: string
  alt: string
  className?: string
}

type Status = 'loading' | 'loaded' | 'error'

/**
 * Equivalent to Coil's AsyncImage in the original Android app: shows a shimmer
 * placeholder while loading and a "Reintentar" fallback when the image fails.
 */
export default function AsyncImage({ src, alt, className = '' }: AsyncImageProps) {
  const [status, setStatus] = useState<Status>('loading')
  // Bumping the key forces the <img> to re-request on retry.
  const [attempt, setAttempt] = useState(0)

  return (
    <div className={`relative overflow-hidden bg-surface-variant ${className}`}>
      {status === 'loading' && (
        <div className="absolute inset-0 animate-pulse bg-linear-to-br from-surface-variant to-outline/40" />
      )}

      {status === 'error' ? (
        <button
          type="button"
          onClick={() => {
            setStatus('loading')
            setAttempt((a) => a + 1)
          }}
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-on-surface-variant transition-colors hover:text-primary"
        >
          <ImageOff className="h-8 w-8" />
          <span className="flex items-center gap-1 text-sm font-medium">
            <RefreshCw className="h-4 w-4" /> Reintentar
          </span>
        </button>
      ) : (
        <img
          key={attempt}
          src={src}
          alt={alt}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={`h-full w-full object-cover transition-opacity duration-500 ${
            status === 'loaded' ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  )
}
