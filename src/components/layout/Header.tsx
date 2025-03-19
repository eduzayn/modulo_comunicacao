'use client'

import { MainNav } from '@/components/navigation/main-nav'
import { UserNav } from '@/components/navigation/user-nav'
import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex flex-1 items-center justify-start">
          <Button variant="ghost" size="icon" className="mr-6">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex flex-1 items-center justify-center">
          <MainNav />
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <ModeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  )
} 