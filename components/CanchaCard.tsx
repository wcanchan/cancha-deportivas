'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Phone, Users, Zap } from 'lucide-react'
import { Cancha } from '@/lib/types'

interface CanchaCardProps {
  cancha: Cancha
}

export function CanchaCard({ cancha }: CanchaCardProps) {
  const priceFormatted = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
  }).format(cancha.precio_por_hora)

  return (
    <Link href={`/cancha/${cancha.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        <div className="aspect-video bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
          <div className="text-white text-center">
            <Zap className="h-12 w-12 mx-auto mb-2" />
            <p className="text-sm font-semibold">Cancha de Fútbol 7</p>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-bold text-lg text-foreground">{cancha.name}</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <MapPin className="h-4 w-4" />
              {cancha.localidad}
            </div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {cancha.descripcion}
          </p>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            {cancha.capacidad} personas
          </div>

          {cancha.telefono && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              {cancha.telefono}
            </div>
          )}

          {cancha.amenidades && cancha.amenidades.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {cancha.amenidades.slice(0, 3).map((amenidad, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {amenidad}
                </Badge>
              ))}
              {cancha.amenidades.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{cancha.amenidades.length - 3} más
                </Badge>
              )}
            </div>
          )}

          <div className="pt-2 border-t border-border">
            <p className="font-bold text-lg text-primary">{priceFormatted}/hora</p>
            <p className="text-xs text-muted-foreground">Haz clic para ver horarios y reservar</p>
          </div>
        </div>
      </Card>
    </Link>
  )
}
