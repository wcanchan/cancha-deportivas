'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase/client'
import { Cancha } from '@/lib/types'
import { MapPin, Phone, Users, DollarSign } from 'lucide-react'
import { Header } from '@/components/Header'

export default function Home() {
  const [localidad, setLocalidad] = useState('')
  const [canchas, setCanchas] = useState<Cancha[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [localidades, setLocalidades] = useState<string[]>([])

  useEffect(() => {
    // Cargar todas las localidades disponibles
    const fetchLocalidades = async () => {
      const { data } = await supabase
        .from('canchas')
        .select('localidad')
        .eq('disponible', true)
        .order('localidad')

      if (data) {
        const uniqueLocalidades = [...new Set(data.map(c => c.localidad))]
        setLocalidades(uniqueLocalidades)
      }
    }

    fetchLocalidades()
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!localidad.trim()) return

    setLoading(true)
    setSearched(true)

    const { data, error } = await supabase
      .from('canchas')
      .select('*')
      .eq('localidad', localidad)
      .eq('disponible', true)

    if (!error && data) {
      setCanchas(data)
    }

    setLoading(false)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">

      {/* Search Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            ¿Dónde quieres jugar?
          </h2>
          
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Buscar por localidad (ej: Centro, Las Condes)..."
                value={localidad}
                onChange={(e) => setLocalidad(e.target.value)}
                list="localidades-list"
                className="w-full h-12 px-4 rounded-lg text-black"
              />
              <datalist id="localidades-list">
                {localidades.map(loc => (
                  <option key={loc} value={loc} />
                ))}
              </datalist>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-white text-blue-600 hover:bg-gray-100 font-bold text-lg"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Spinner className="h-4 w-4" />
                  Buscando...
                </div>
              ) : (
                'Buscar Canchas'
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {searched && loading && (
          <div className="flex justify-center py-12">
            <Spinner className="h-8 w-8 text-blue-600" />
          </div>
        )}

        {searched && !loading && canchas.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">
              No encontramos canchas disponibles en {localidad}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Intenta con otra localidad
            </p>
          </div>
        )}

        {canchas.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold mb-6 text-gray-800">
              {canchas.length} cancha{canchas.length !== 1 ? 's' : ''} disponible{canchas.length !== 1 ? 's' : ''} en {localidad}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {canchas.map(cancha => (
                <Link key={cancha.id} href={`/cancha/${cancha.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                    {/* Imagen de la cancha */}
                    <div className="relative h-40 bg-gray-200">
                      {cancha.fotos && cancha.fotos.length > 0 ? (
                        <Image
                          src={cancha.fotos[0]}
                          alt={cancha.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-400 to-blue-600">
                          <span className="text-white text-4xl">⚽</span>
                        </div>
                      )}
                    </div>

                    {/* Contenido */}
                    <div className="p-4 space-y-3">
                      <div>
                        <h4 className="font-bold text-lg text-gray-800">
                          {cancha.name}
                        </h4>
                        <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                          <MapPin className="h-4 w-4" />
                          {cancha.direccion}
                        </div>
                      </div>

                      {/* Info rápida */}
                      <div className="flex flex-wrap gap-2">
                        {cancha.telefono && (
                          <Badge variant="secondary" className="text-xs">
                            <Phone className="h-3 w-3 mr-1" />
                            {cancha.telefono}
                          </Badge>
                        )}
                        <Badge variant="secondary" className="text-xs">
                          <Users className="h-3 w-3 mr-1" />
                          {cancha.capacidad} personas
                        </Badge>
                      </div>

                      {/* Precio */}
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center gap-1 text-xl font-bold text-blue-600">
                          <DollarSign className="h-5 w-5" />
                          {cancha.precio_por_hora}
                        </div>
                        <span className="text-xs text-gray-500">por hora</span>
                      </div>

                      {/* Amenidades */}
                      {cancha.amenidades && cancha.amenidades.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-2">
                          {cancha.amenidades.slice(0, 3).map((amenidad, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {amenidad}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {!searched && (
          <div className="text-center py-12 text-gray-600">
            <p className="text-lg mb-2">🏟️ Comienza buscando una localidad</p>
            <p className="text-sm">
              Selecciona una localidad para ver las canchas disponibles
            </p>
          </div>
        )}
      </div>
    </main>
    </>
  )
}
