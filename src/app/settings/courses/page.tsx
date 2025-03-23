'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getCourses, toggleCourse } from '@/services/settings'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import { CourseForm } from '@/features/settings'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const courseCategories = [
  'Segunda Licenciatura',
  'Formação Pedagógica',
  'EJA',
  'Bacharelado 2°',
  'Primeira Graduação',
  'Pós-Graduação',
  'MBA',
  'Formação Livre',
  'Capacitação'
] as const

export default function CoursesPage() {
  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('')

  const { data: courses = [] } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses
  })

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !categoryFilter || course.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  function formatPrice(price: number) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Cursos ({courses.length})</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie os cursos e seus preços
          </p>
        </div>

        <Dialog open={isCreateCourseOpen} onOpenChange={setIsCreateCourseOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo curso
            </Button>
          </DialogTrigger>
          <DialogContent>
            <CourseForm onSuccess={() => setIsCreateCourseOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2">
        <Input
          placeholder="Pesquisar cursos..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-sm"
        />

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Todas as categorias" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas as categorias</SelectItem>
            {courseCategories.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Cursos</h2>
        </div>

        <div className="divide-y">
          {filteredCourses.map((course) => (
            <div key={course.id} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                  <h3 className="font-medium">{course.name}</h3>
                  <Badge variant="outline">{course.category}</Badge>
                </div>
                <Switch
                  checked={course.enabled}
                  onCheckedChange={(checked) => toggleCourse(course.id, checked)}
                />
              </div>
              {course.description && (
                <p className="text-sm text-muted-foreground mb-2">
                  {course.description}
                </p>
              )}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div>
                  Preço: {formatPrice(course.full_price)}
                </div>
                <div>
                  Desconto: {course.discount_type === 'percentage'
                    ? `${course.discount_value}%`
                    : formatPrice(course.discount_value)
                  }
                </div>
                <div>
                  Preço final: {formatPrice(course.final_price)}
                </div>
                <div>
                  Entrada: {formatPrice(course.entry_fee)}
                </div>
              </div>
            </div>
          ))}

          {filteredCourses.length === 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Nenhum curso encontrado
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 