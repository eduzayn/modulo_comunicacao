'use client'

import * as React from 'react'
import { addDays, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar as CalendarIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface DateRangePickerProps {
  className?: string
  onChange?: (dateRange: { from: Date; to: Date }) => void
}

export function DateRangePicker({ className, onChange }: DateRangePickerProps) {
  const [dateRange, setDateRange] = React.useState<{
    from: Date
    to: Date
  }>({
    from: new Date(),
    to: addDays(new Date(), 7),
  })

  // Opções de períodos predefinidos
  const predefinedRanges = [
    { label: 'Hoje', value: 'today', from: new Date(), to: new Date() },
    { label: 'Últimos 7 dias', value: '7days', from: addDays(new Date(), -7), to: new Date() },
    { label: 'Últimos 30 dias', value: '30days', from: addDays(new Date(), -30), to: new Date() },
    { label: 'Este mês', value: 'thisMonth', from: new Date(new Date().getFullYear(), new Date().getMonth(), 1), to: new Date() },
    { label: 'Personalizado', value: 'custom' },
  ]

  const handlePresetChange = (value: string) => {
    const preset = predefinedRanges.find(range => range.value === value)
    if (preset && preset.value !== 'custom') {
      const newRange = { from: preset.from, to: preset.to }
      setDateRange(newRange)
      onChange?.(newRange)
    }
  }

  const handleDateChange = (range: { from?: Date; to?: Date }) => {
    if (range.from && range.to) {
      const newRange = { from: range.from, to: range.to }
      setDateRange(newRange)
      onChange?.(newRange)
    }
  }

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              'w-full justify-start text-left font-normal',
              !dateRange && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, 'P', { locale: ptBR })} -{' '}
                  {format(dateRange.to, 'P', { locale: ptBR })}
                </>
              ) : (
                format(dateRange.from, 'P', { locale: ptBR })
              )
            ) : (
              <span>Selecione um período</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex flex-col sm:flex-row">
            <div className="p-3 border-b sm:border-b-0 sm:border-r">
              <Select onValueChange={handlePresetChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um período" />
                </SelectTrigger>
                <SelectContent>
                  {predefinedRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={handleDateChange}
              numberOfMonths={2}
              locale={ptBR}
              className="rounded-md"
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
} 