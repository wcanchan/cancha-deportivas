'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Cancha, HorarioDisponible } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, Users, Clock, ArrowLeft } from 'lucide-react'
import ReservaModal from '@/components/ReservaModal'

export default function CanchaDetail() {
  const params = useParams()
  const canchaId = params.id as string

  const [cancha, setCancha] = useState<Cancha | null>(null)
  const [horarios, setHorarios] = useState<HorarioDisponible[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [showReservaModal, setShowReservaModal] = useState(false)

  useEffect(() => {
    const fetchCancha = async () => {
      // Obtener datos de la cancha
      const { data: canchaData } = await supabase
        .from('canchas')
        .select('*')
        .eq('id', canchaId)
        .single()

      if (canchaData) {
        setCancha(canchaData)

        // Obtener horarios disponibles
        const { data: horariosData } = await supabase
          .from('horarios_disponibles')
          .select('*')
          .eq('cancha_id', canchaId)
          .eq('disponible', true)

        if (horariosData) {
          setHorarios(horariosData)
        }
      }

      setLoading(false)
    }

    fetchCancha()
  }, [canchaId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="h-8 w-8 text-blue-600" />
      </div>
    )
  }

  if (!cancha) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">Cancha no encontrada</p>
          <Link href="/">
            <Button>Volver al inicio</Button>
          </Link>
        </div>
      </div>
    )
  }

  const diasOrdenados = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo'
  ]

  const horariosOrdenados = horarios.sort((a, b) => {
    const diaOrder = diasOrdenados.indexOf(a.dia_semana) - diasOrdenados.indexOf(b.dia_semana)
    if (diaOrder !== 0) return diaOrder
    return a.hora_inicio.localeCompare(b.hora_inicio)
  })

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header con botón volver */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Galería de imágenes */}
        <div className="mb-8">
          <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
            {cancha.fotos && cancha.fotos.length > 0 ? (
              <Image
                src={cancha.fotos[0]}
                alt={cancha.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-400 to-blue-600">
                <span className="text-white text-6xl">⚽</span>
              </div>
            )}
          </div>

          {/* Thumbnail gallery */}
          {cancha.fotos && cancha.fotos.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {cancha.fotos.map((foto, idx) => (
                <div
                  key={idx}
                  className="relative h-20 w-20 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-75"
                  onClick={() => {
                    // Aquí podrías implementar cambio de imagen principal
                  }}
                >
                  <Image
                    src={foto}
                    alt={`${cancha.name} ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información de la cancha */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {cancha.name}
              </h1>
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <MapPin className="h-5 w-5" />
                <span>{cancha.direccion}</span>
              </div>
              {cancha.descripcion && (
                <p className="text-gray-700 text-lg">
                  {cancha.descripcion}
                </p>
              )}
            </div>

            {/* Características */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Características</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Capacidad</p>
                    <p className="font-bold">{cancha.capacidad} personas</p>
                  </div>
                </div>
                {cancha.telefono && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Teléfono</p>
                      <p className="font-bold">{cancha.telefono}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Amenidades */}
            {cancha.amenidades && cancha.amenidades.length > 0 && (
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Amenidades</h3>
                <div className="flex flex-wrap gap-2">
                  {cancha.amenidades.map((amenidad, idx) => (
                    <Badge key={idx} variant="secondary">
                      {amenidad}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}

            {/* Horarios disponibles */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Horarios Disponibles
              </h3>

              {horariosOrdenados.length === 0 ? (
                <p className="text-gray-600">
                  No hay horarios disponibles en este momento
                </p>
              ) : (
                <div className="space-y-3">
                  {diasOrdenados.map(dia => {
                    const horariosDelDia = horariosOrdenados.filter(
                      h => h.dia_semana === dia
                    )
                    if (horariosDelDia.length === 0) return null

                    return (
                      <div key={dia}>
                        <p className="font-semibold text-gray-900 mb-2">
                          {dia}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {horariosDelDia.map(horario => (
                            <Badge
                              key={horario.id}
                              variant="outline"
                              className="cursor-pointer hover:bg-blue-50"
                              onClick={() => {
                                setSelectedDate(dia)
                                setSelectedTime(`${horario.hora_inicio}-${horario.hora_fin}`)
                              }}
                            >
                              {horario.hora_inicio} - {horario.hora_fin}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </Card>
          </div>

          {/* Panel lateral de reserva */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24 space-y-4">
              <div>
                <p className="text-sm text-gray-600">Precio por hora</p>
                <p className="text-4xl font-bold text-blue-600">
                  ${cancha.precio_por_hora}
                </p>
              </div>

              {selectedDate && selectedTime && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Seleccionado</p>
                  <p className="font-semibold">
                    {selectedDate}
                  </p>
                  <p className="font-semibold">
                    {selectedTime}
                  </p>
                </div>
              )}

              <Button
                onClick={() => setShowReservaModal(true)}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700"
                disabled={!selectedDate || !selectedTime}
              >
                Reservar Ahora
              </Button>

              <p className="text-xs text-gray-500 text-center">
                ✓ El registro se realiza al momento de confirmar la reserva
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal de reserva */}
      <ReservaModal
        isOpen={showReservaModal}
        onClose={() => setShowReservaModal(false)}
        cancha={cancha}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
      />
    </main>
  )
}
