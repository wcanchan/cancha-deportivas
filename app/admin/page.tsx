'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { FieldGroup, FieldLabel } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { Cancha } from '@/lib/types'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from '@/components/ui/alert-dialog'
import Link from 'next/link'

export default function AdminPage() {
  const [canchas, setCanchas] = useState<Cancha[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    localidad: '',
    descripcion: '',
    direccion: '',
    latitude: '',
    longitude: '',
    telefono: '',
    capacidad: '14',
    precio_por_hora: '',
    amenidades: '',
    fotos: '',
  })

  useEffect(() => {
    fetchCanchas()
  }, [])

  const fetchCanchas = async () => {
    const { data, error: err } = await supabase
      .from('canchas')
      .select('*')
      .order('created_at', { ascending: false })

    if (!err && data) {
      setCanchas(data)
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const amenidades = formData.amenidades
        .split(',')
        .map(a => a.trim())
        .filter(a => a)

      const fotos = formData.fotos
        .split(',')
        .map(f => f.trim())
        .filter(f => f)

      const data = {
        name: formData.name,
        localidad: formData.localidad,
        descripcion: formData.descripcion,
        direccion: formData.direccion,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        telefono: formData.telefono,
        capacidad: parseInt(formData.capacidad),
        precio_por_hora: parseFloat(formData.precio_por_hora),
        amenidades,
        fotos,
      }

      if (editingId) {
        const { error: err } = await supabase
          .from('canchas')
          .update(data)
          .eq('id', editingId)

        if (err) throw err
        setSuccess('Cancha actualizada exitosamente')
      } else {
        const { error: err } = await supabase
          .from('canchas')
          .insert([data])

        if (err) throw err
        setSuccess('Cancha creada exitosamente')
      }

      setFormData({
        name: '',
        localidad: '',
        descripcion: '',
        direccion: '',
        latitude: '',
        longitude: '',
        telefono: '',
        capacidad: '14',
        precio_por_hora: '',
        amenidades: '',
        fotos: '',
      })
      setEditingId(null)
      setShowForm(false)
      fetchCanchas()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
    }
  }

  const handleEdit = (cancha: Cancha) => {
    setFormData({
      name: cancha.name,
      localidad: cancha.localidad,
      descripcion: cancha.descripcion || '',
      direccion: cancha.direccion,
      latitude: cancha.latitude?.toString() || '',
      longitude: cancha.longitude?.toString() || '',
      telefono: cancha.telefono || '',
      capacidad: cancha.capacidad.toString(),
      precio_por_hora: cancha.precio_por_hora.toString(),
      amenidades: cancha.amenidades?.join(', ') || '',
      fotos: cancha.fotos?.join(', ') || '',
    })
    setEditingId(cancha.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const { error: err } = await supabase
        .from('canchas')
        .delete()
        .eq('id', id)

      if (err) throw err
      setSuccess('Cancha eliminada exitosamente')
      fetchCanchas()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Panel Administrativo
            </h1>
            <p className="text-gray-600 mt-1">Gestiona las canchas disponibles</p>
          </div>
          <Link href="/">
            <Button variant="outline">Volver al sitio</Button>
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Botón agregar */}
        <div className="mb-6">
          <Button
            onClick={() => {
              setEditingId(null)
              setFormData({
                name: '',
                localidad: '',
                descripcion: '',
                direccion: '',
                latitude: '',
                longitude: '',
                telefono: '',
                capacidad: '14',
                precio_por_hora: '',
                amenidades: '',
                fotos: '',
              })
              setShowForm(!showForm)
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {showForm ? 'Cancelar' : '+ Agregar Nueva Cancha'}
          </Button>
        </div>

        {/* Mensajes */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        {/* Formulario */}
        {showForm && (
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">
              {editingId ? 'Editar Cancha' : 'Nueva Cancha'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FieldGroup>
                  <FieldLabel>Nombre de la Cancha *</FieldLabel>
                  <Input
                    type="text"
                    placeholder="Ej: Cancha Premium Centro"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel>Localidad *</FieldLabel>
                  <Input
                    type="text"
                    placeholder="Ej: Centro, Las Condes"
                    value={formData.localidad}
                    onChange={(e) =>
                      setFormData({ ...formData, localidad: e.target.value })
                    }
                    required
                  />
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel>Dirección *</FieldLabel>
                  <Input
                    type="text"
                    placeholder="Calle y número"
                    value={formData.direccion}
                    onChange={(e) =>
                      setFormData({ ...formData, direccion: e.target.value })
                    }
                    required
                  />
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel>Teléfono</FieldLabel>
                  <Input
                    type="tel"
                    placeholder="+56 9 XXXX XXXX"
                    value={formData.telefono}
                    onChange={(e) =>
                      setFormData({ ...formData, telefono: e.target.value })
                    }
                  />
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel>Precio por Hora (CLP) *</FieldLabel>
                  <Input
                    type="number"
                    placeholder="20000"
                    value={formData.precio_por_hora}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        precio_por_hora: e.target.value,
                      })
                    }
                    required
                  />
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel>Capacidad (personas)</FieldLabel>
                  <Input
                    type="number"
                    placeholder="14"
                    value={formData.capacidad}
                    onChange={(e) =>
                      setFormData({ ...formData, capacidad: e.target.value })
                    }
                  />
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel>Latitud</FieldLabel>
                  <Input
                    type="number"
                    placeholder="-33.8688"
                    step="0.0001"
                    value={formData.latitude}
                    onChange={(e) =>
                      setFormData({ ...formData, latitude: e.target.value })
                    }
                  />
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel>Longitud</FieldLabel>
                  <Input
                    type="number"
                    placeholder="-51.2093"
                    step="0.0001"
                    value={formData.longitude}
                    onChange={(e) =>
                      setFormData({ ...formData, longitude: e.target.value })
                    }
                  />
                </FieldGroup>
              </div>

              <FieldGroup>
                <FieldLabel>Descripción</FieldLabel>
                <Textarea
                  placeholder="Describe la cancha, sus características especiales..."
                  value={formData.descripcion}
                  onChange={(e) =>
                    setFormData({ ...formData, descripcion: e.target.value })
                  }
                  rows={3}
                />
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>Amenidades (separadas por comas)</FieldLabel>
                <Input
                  type="text"
                  placeholder="Ej: Grama sintética, Luces LED, Estacionamiento"
                  value={formData.amenidades}
                  onChange={(e) =>
                    setFormData({ ...formData, amenidades: e.target.value })
                  }
                />
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>URLs de Fotos (separadas por comas)</FieldLabel>
                <Input
                  type="text"
                  placeholder="https://ejemplo.com/foto1.jpg, https://ejemplo.com/foto2.jpg"
                  value={formData.fotos}
                  onChange={(e) =>
                    setFormData({ ...formData, fotos: e.target.value })
                  }
                />
              </FieldGroup>

              <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {editingId ? 'Actualizar' : 'Crear Cancha'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Listado de canchas */}
        <div>
          <h2 className="text-2xl font-bold mb-4">
            Canchas ({canchas.length})
          </h2>

          {canchas.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-600">No hay canchas registradas</p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {canchas.map(cancha => (
                <Card key={cancha.id} className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{cancha.name}</h3>
                      <p className="text-sm text-gray-600">
                        {cancha.direccion} • {cancha.localidad}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        ${cancha.precio_por_hora} por hora • {cancha.capacidad} personas
                      </p>
                      {cancha.amenidades && cancha.amenidades.length > 0 && (
                        <p className="text-xs text-gray-500 mt-2">
                          {cancha.amenidades.join(' • ')}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEdit(cancha)}
                        variant="outline"
                        size="sm"
                      >
                        Editar
                      </Button>
                      <AlertDialog>
                        <Button
                          onClick={() => {}}
                          variant="destructive"
                          size="sm"
                        >
                          Eliminar
                        </Button>
                      </AlertDialog>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
