'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CopyIcon, CheckIcon } from 'lucide-react'

export function InstallationSection() {
  const [copied, setCopied] = useState(false)
  
  const widgetCode = `<script type="text/javascript">(function(){window.__kb=window.__kb||{};var e=document.createElement("script");e.type="module";e.async=!0;e.src="https://widget.kinbox.com.br/widget.js";var t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t);})();</script>`
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(widgetCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch (err) {
      console.error('Falha ao copiar texto: ', err)
    }
  }
  
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        1. Copie e cole este código antes da tag &lt;/body&gt; em todas as páginas do seu site.
      </p>
      
      <div className="relative">
        <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
          {widgetCode}
        </pre>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="absolute right-2 top-2"
          onClick={handleCopy}
        >
          {copied ? (
            <>
              <CheckIcon className="h-4 w-4 mr-1" />
              Copiado
            </>
          ) : (
            <>
              <CopyIcon className="h-4 w-4 mr-1" />
              Copiar código
            </>
          )}
        </Button>
      </div>
    </div>
  )
} 