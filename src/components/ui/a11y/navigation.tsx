'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

/**
 * Enhanced Link component with improved accessibility
 */
interface AccessibleLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
  external?: boolean;
  hideExternalIcon?: boolean;
}

export function AccessibleLink({
  children,
  external,
  hideExternalIcon,
  className,
  ...props
}: AccessibleLinkProps) {
  const isExternal = external || (props.href && typeof props.href === 'string' && props.href.startsWith('http'));
  
  const externalProps = isExternal
    ? {
        target: '_blank',
        rel: 'noopener noreferrer',
      }
    : {};
  
  return (
    <Link
      className={cn(
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
        className
      )}
      {...externalProps}
      {...props}
    >
      {children}
      {isExternal && !hideExternalIcon && (
        <span className="ml-1 inline-block" aria-hidden="true">
          ↗
        </span>
      )}
      {isExternal && (
        <span className="sr-only"> (abre em uma nova janela)</span>
      )}
    </Link>
  );
}

/**
 * Breadcrumbs component for navigation
 */
interface BreadcrumbsProps {
  items: {
    label: string;
    href: string;
  }[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Navegação estrutural" className={cn('mb-4', className)}>
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 text-muted-foreground" aria-hidden="true">
                /
              </span>
            )}
            {index === items.length - 1 ? (
              <span className="text-muted-foreground" aria-current="page">
                {item.label}
              </span>
            ) : (
              <AccessibleLink
                href={item.href}
                className="text-primary hover:underline"
              >
                {item.label}
              </AccessibleLink>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * NavItem component for navigation menus
 */
interface NavItemProps {
  href: string;
  label: string;
  icon?: React.ReactNode;
  className?: string;
}

export function NavItem({ href, label, icon, className }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);
  
  return (
    <AccessibleLink
      href={href}
      className={cn(
        'flex items-center py-2 px-3 text-sm font-medium rounded-md transition-colors',
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:text-foreground hover:bg-accent',
        className
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </AccessibleLink>
  );
}
