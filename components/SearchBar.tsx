'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, MapPin } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface SearchBarProps {
  onSearch: (localidad: string) => void
  isLoading: boolean
}

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.length < 1) {
        setSuggestions([])
        return
      }

      const { data, error } = await supabase
        .from('canchas')
        .select('localidad')
        .ilike('localidad', `%${searchTerm}%`)
        .eq('disponible', true)

      if (!error && data) {
        const uniqueLocalidades = [...new Set(data.map(c => c.localidad))]
        setSuggestions(uniqueLocalidades)
        setShowSuggestions(true)
      }
    }

    const timer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(timer)
  }, [searchTerm, supabase])

  const handleSearch = (localidad: string) => {
    setSearchTerm(localidad)
    onSearch(localidad)
    setShowSuggestions(false)
  }

  return (
    <div className="w-full">
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Busca por localidad (Centro, Las Condes, Ñuñoa...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => searchTerm.length > 0 && setShowSuggestions(true)}
            className="pl-10"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-10">
              {suggestions.map((localidad) => (
                <button
                  key={localidad}
                  onClick={() => handleSearch(localidad)}
                  className="w-full text-left px-4 py-2 hover:bg-muted focus:bg-muted transition-colors"
                >
                  {localidad}
                </button>
              ))}
            </div>
          )}
        </div>
        <Button
          onClick={() => handleSearch(searchTerm)}
          disabled={isLoading || !searchTerm.trim()}
          size="icon"
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
