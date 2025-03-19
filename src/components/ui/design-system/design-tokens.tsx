'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/**
 * Color Token Display Component
 */
interface ColorTokenProps {
  name: string;
  value: string;
  textColor?: string;
}

export function ColorToken({ name, value, textColor = 'text-white' }: ColorTokenProps) {
  return (
    <div className="flex flex-col">
      <div 
        className={cn("h-16 rounded-md flex items-end p-2", textColor)}
        style={{ backgroundColor: value }}
      >
        <span className="text-xs font-mono">{value}</span>
      </div>
      <div className="mt-1">
        <p className="text-sm font-medium">{name}</p>
      </div>
    </div>
  );
}

/**
 * Typography Token Display Component
 */
interface TypographyTokenProps {
  name: string;
  className: string;
  sample?: string;
}

export function TypographyToken({ 
  name, 
  className, 
  sample = "The quick brown fox jumps over the lazy dog" 
}: TypographyTokenProps) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm font-medium">{name}</p>
        <code className="text-xs bg-muted px-1 py-0.5 rounded">{className}</code>
      </div>
      <div className={cn("border-l-2 border-primary pl-3", className)}>
        {sample}
      </div>
    </div>
  );
}

/**
 * Spacing Token Display Component
 */
interface SpacingTokenProps {
  name: string;
  value: string;
}

export function SpacingToken({ name, value }: SpacingTokenProps) {
  return (
    <div className="flex items-center mb-2">
      <div className="w-24 text-sm font-medium">{name}</div>
      <div 
        className="bg-primary/20 h-4"
        style={{ width: value }}
      ></div>
      <div className="ml-2 text-xs text-muted-foreground">{value}</div>
    </div>
  );
}

/**
 * Border Radius Token Display Component
 */
interface RadiusTokenProps {
  name: string;
  value: string;
}

export function RadiusToken({ name, value }: RadiusTokenProps) {
  return (
    <div className="flex items-center mb-2">
      <div className="w-24 text-sm font-medium">{name}</div>
      <div 
        className="bg-primary h-16 w-16"
        style={{ borderRadius: value }}
      ></div>
      <div className="ml-2 text-xs text-muted-foreground">{value}</div>
    </div>
  );
}

/**
 * Shadow Token Display Component
 */
interface ShadowTokenProps {
  name: string;
  value: string;
}

export function ShadowToken({ name, value }: ShadowTokenProps) {
  return (
    <div className="flex items-center mb-4">
      <div className="w-24 text-sm font-medium">{name}</div>
      <div 
        className="bg-background h-16 w-16"
        style={{ boxShadow: value }}
      ></div>
      <div className="ml-2 text-xs text-muted-foreground font-mono break-all">{value}</div>
    </div>
  );
}

/**
 * Design Tokens Section Component
 */
interface DesignTokensSectionProps {
  title: string;
  children: React.ReactNode;
}

export function DesignTokensSection({ title, children }: DesignTokensSectionProps) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}

/**
 * Color Palette Component
 */
export function ColorPalette() {
  const colors = [
    { name: 'Primary', value: 'hsl(var(--primary))' },
    { name: 'Primary Foreground', value: 'hsl(var(--primary-foreground))' },
    { name: 'Secondary', value: 'hsl(var(--secondary))' },
    { name: 'Secondary Foreground', value: 'hsl(var(--secondary-foreground))' },
    { name: 'Accent', value: 'hsl(var(--accent))' },
    { name: 'Accent Foreground', value: 'hsl(var(--accent-foreground))' },
    { name: 'Background', value: 'hsl(var(--background))' },
    { name: 'Foreground', value: 'hsl(var(--foreground))' },
    { name: 'Muted', value: 'hsl(var(--muted))' },
    { name: 'Muted Foreground', value: 'hsl(var(--muted-foreground))' },
    { name: 'Border', value: 'hsl(var(--border))' },
    { name: 'Input', value: 'hsl(var(--input))' },
    { name: 'Ring', value: 'hsl(var(--ring))' },
    { name: 'Destructive', value: 'hsl(var(--destructive))' },
    { name: 'Destructive Foreground', value: 'hsl(var(--destructive-foreground))' },
  ];

  return (
    <DesignTokensSection title="Color Palette">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {colors.map((color) => (
          <ColorToken 
            key={color.name} 
            name={color.name} 
            value={color.value} 
            textColor={color.name.includes('Foreground') ? 'text-foreground' : 'text-white'}
          />
        ))}
      </div>
    </DesignTokensSection>
  );
}

/**
 * Typography Scale Component
 */
export function TypographyScale() {
  const typography = [
    { name: 'Heading 1', className: 'text-4xl font-bold tracking-tight' },
    { name: 'Heading 2', className: 'text-3xl font-semibold tracking-tight' },
    { name: 'Heading 3', className: 'text-2xl font-semibold tracking-tight' },
    { name: 'Heading 4', className: 'text-xl font-semibold tracking-tight' },
    { name: 'Paragraph', className: 'text-base leading-7' },
    { name: 'Small', className: 'text-sm font-medium leading-none' },
    { name: 'Muted', className: 'text-sm text-muted-foreground' },
  ];

  return (
    <DesignTokensSection title="Typography Scale">
      <div className="space-y-6">
        {typography.map((type) => (
          <TypographyToken 
            key={type.name} 
            name={type.name} 
            className={type.className} 
          />
        ))}
      </div>
    </DesignTokensSection>
  );
}

/**
 * Spacing Scale Component
 */
export function SpacingScale() {
  const spacing = [
    { name: '0.5', value: '0.125rem' },
    { name: '1', value: '0.25rem' },
    { name: '1.5', value: '0.375rem' },
    { name: '2', value: '0.5rem' },
    { name: '2.5', value: '0.625rem' },
    { name: '3', value: '0.75rem' },
    { name: '3.5', value: '0.875rem' },
    { name: '4', value: '1rem' },
    { name: '5', value: '1.25rem' },
    { name: '6', value: '1.5rem' },
    { name: '8', value: '2rem' },
    { name: '10', value: '2.5rem' },
    { name: '12', value: '3rem' },
    { name: '16', value: '4rem' },
    { name: '20', value: '5rem' },
    { name: '24', value: '6rem' },
  ];

  return (
    <DesignTokensSection title="Spacing Scale">
      <div className="space-y-2">
        {spacing.map((space) => (
          <SpacingToken 
            key={space.name} 
            name={space.name} 
            value={space.value} 
          />
        ))}
      </div>
    </DesignTokensSection>
  );
}

/**
 * Border Radius Scale Component
 */
export function BorderRadiusScale() {
  const radii = [
    { name: 'none', value: '0px' },
    { name: 'sm', value: '0.125rem' },
    { name: 'DEFAULT', value: '0.25rem' },
    { name: 'md', value: '0.375rem' },
    { name: 'lg', value: '0.5rem' },
    { name: 'xl', value: '0.75rem' },
    { name: '2xl', value: '1rem' },
    { name: '3xl', value: '1.5rem' },
    { name: 'full', value: '9999px' },
  ];

  return (
    <DesignTokensSection title="Border Radius Scale">
      <div className="space-y-2">
        {radii.map((radius) => (
          <RadiusToken 
            key={radius.name} 
            name={radius.name} 
            value={radius.value} 
          />
        ))}
      </div>
    </DesignTokensSection>
  );
}

/**
 * Shadow Scale Component
 */
export function ShadowScale() {
  const shadows = [
    { name: 'sm', value: '0 1px 2px 0 rgb(0 0 0 / 0.05)' },
    { name: 'DEFAULT', value: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' },
    { name: 'md', value: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' },
    { name: 'lg', value: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' },
    { name: 'xl', value: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' },
    { name: '2xl', value: '0 25px 50px -12px rgb(0 0 0 / 0.25)' },
  ];

  return (
    <DesignTokensSection title="Shadow Scale">
      <div className="space-y-4">
        {shadows.map((shadow) => (
          <ShadowToken 
            key={shadow.name} 
            name={shadow.name} 
            value={shadow.value} 
          />
        ))}
      </div>
    </DesignTokensSection>
  );
}

/**
 * Design Tokens Component
 */
export function DesignTokens() {
  return (
    <div className="space-y-8">
      <ColorPalette />
      <TypographyScale />
      <SpacingScale />
      <BorderRadiusScale />
      <ShadowScale />
    </div>
  );
}
