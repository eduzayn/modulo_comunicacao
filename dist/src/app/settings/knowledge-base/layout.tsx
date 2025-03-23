interface KnowledgeBaseLayoutProps {
  children: React.ReactNode
}

export default function KnowledgeBaseLayout({
  children,
}: KnowledgeBaseLayoutProps) {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      {children}
    </div>
  )
} 