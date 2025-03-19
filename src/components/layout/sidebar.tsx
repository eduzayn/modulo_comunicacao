'use client';

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'

interface SidebarProps {
  module: 'communication' | 'student' | 'content' | 'enrollment'
  items: {
    title: string
    href: string
    icon: React.ReactNode
  }[]
}

export function Sidebar({ module, items }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile Trigger */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <MobileNav module={module} items={items} />
        </SheetContent>
      </Sheet>

      {/* Desktop Nav */}
      <nav
        className={cn(
          'hidden lg:block',
          'w-72 animate-in duration-300 ease-in-out',
          'border-r bg-background'
        )}
      >
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <div className="space-y-1">
              <h2 className={cn(
                'mb-2 px-4 text-lg font-semibold tracking-tight',
                {
                  'text-communication-dark': module === 'communication',
                  'text-student-dark': module === 'student',
                  'text-content-dark': module === 'content',
                  'text-enrollment-dark': module === 'enrollment',
                }
              )}>
                Menu
              </h2>
              <nav className="grid gap-1 px-2">
                {items.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent',
                      'transition-colors duration-200',
                      pathname === item.href ? 
                        {
                          'bg-communication bg-opacity-10 text-communication-dark': module === 'communication',
                          'bg-student bg-opacity-10 text-student-dark': module === 'student',
                          'bg-content bg-opacity-10 text-content-dark': module === 'content',
                          'bg-enrollment bg-opacity-10 text-enrollment-dark': module === 'enrollment',
                        }
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {item.icon}
                    {item.title}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

function MobileNav({ module, items }: SidebarProps) {
  const pathname = usePathname()

  return (
    <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10">
      <div className="flex flex-col gap-2 p-4">
        <h2 className={cn(
          'mb-2 px-2 text-lg font-semibold tracking-tight',
          {
            'text-communication-dark': module === 'communication',
            'text-student-dark': module === 'student',
            'text-content-dark': module === 'content',
            'text-enrollment-dark': module === 'enrollment',
          }
        )}>
          Menu
        </h2>
        {items.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium',
              'transition-colors duration-200',
              pathname === item.href ? 
                {
                  'bg-communication bg-opacity-10 text-communication-dark': module === 'communication',
                  'bg-student bg-opacity-10 text-student-dark': module === 'student',
                  'bg-content bg-opacity-10 text-content-dark': module === 'content',
                  'bg-enrollment bg-opacity-10 text-enrollment-dark': module === 'enrollment',
                }
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {item.icon}
            {item.title}
          </Link>
        ))}
      </div>
    </ScrollArea>
  )
}
