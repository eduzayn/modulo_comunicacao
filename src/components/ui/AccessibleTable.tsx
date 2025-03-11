'use client';

import React, { forwardRef, useState } from 'react';
import { cn } from '../../lib/utils';
import { useAccessibility } from '../providers/AccessibilityProvider';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';

export interface TableColumn<T> {
  header: string;
  accessorKey: keyof T;
  cell?: (item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  caption?: string;
  className?: string;
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  sortable?: boolean;
  pagination?: {
    pageSize: number;
    currentPage: number;
    totalItems: number;
    onPageChange: (page: number) => void;
  };
  ariaLabel?: string;
  ariaDescribedBy?: string;
  zebra?: boolean;
  bordered?: boolean;
  compact?: boolean;
  responsive?: boolean;
}

const AccessibleTable = <T extends Record<string, any>>(
  { 
    data, 
    columns, 
    caption,
    className,
    onRowClick,
    isLoading = false,
    emptyMessage = 'Nenhum dado encontrado',
    sortable = false,
    pagination,
    ariaLabel,
    ariaDescribedBy,
    zebra = true,
    bordered = true,
    compact = false,
    responsive = true,
  }: TableProps<T>,
  ref: React.ForwardedRef<HTMLTableElement>
) => {
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [focusedCell, setFocusedCell] = useState<{ row: number; col: number } | null>(null);
  const { announceToScreenReader, highContrastMode } = useAccessibility();
  
  // Handle keyboard navigation
  const { handleKeyDown } = useKeyboardNavigation({
    onArrowUp: (event) => {
      if (focusedCell && focusedCell.row > 0) {
        event.preventDefault();
        setFocusedCell({ row: focusedCell.row - 1, col: focusedCell.col });
      }
    },
    onArrowDown: (event) => {
      if (focusedCell && focusedCell.row < data.length - 1) {
        event.preventDefault();
        setFocusedCell({ row: focusedCell.row + 1, col: focusedCell.col });
      }
    },
    onArrowLeft: (event) => {
      if (focusedCell && focusedCell.col > 0) {
        event.preventDefault();
        setFocusedCell({ row: focusedCell.row, col: focusedCell.col - 1 });
      }
    },
    onArrowRight: (event) => {
      if (focusedCell && focusedCell.col < columns.length - 1) {
        event.preventDefault();
        setFocusedCell({ row: focusedCell.row, col: focusedCell.col + 1 });
      }
    },
    onEnter: (event) => {
      if (focusedCell && onRowClick) {
        event.preventDefault();
        onRowClick(data[focusedCell.row]);
      }
    },
  });
  
  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortColumn) return data;
    
    return [...data].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      
      if (aValue === bValue) return 0;
      
      const comparison = aValue < bValue ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, sortColumn, sortDirection]);
  
  // Handle sort
  const handleSort = (column: TableColumn<T>) => {
    if (!column.sortable && !sortable) return;
    
    const isCurrentSortColumn = sortColumn === column.accessorKey;
    
    if (isCurrentSortColumn) {
      // Toggle sort direction
      const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      setSortDirection(newDirection);
      
      // Announce sort direction to screen readers
      announceToScreenReader(
        `Tabela ordenada por ${column.header} em ordem ${newDirection === 'asc' ? 'crescente' : 'decrescente'}.`,
        'polite'
      );
    } else {
      // Set new sort column
      setSortColumn(column.accessorKey);
      setSortDirection('asc');
      
      // Announce sort column to screen readers
      announceToScreenReader(
        `Tabela ordenada por ${column.header} em ordem crescente.`,
        'polite'
      );
    }
  };
  
  // Handle cell focus
  const handleCellFocus = (row: number, col: number) => {
    setFocusedCell({ row, col });
  };
  
  // Handle row click
  const handleRowClick = (item: T) => {
    if (onRowClick) {
      onRowClick(item);
    }
  };
  
  // Pagination
  const paginatedData = React.useMemo(() => {
    if (!pagination) return sortedData;
    
    const { pageSize, currentPage } = pagination;
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    
    return sortedData.slice(start, end);
  }, [sortedData, pagination]);
  
  // Generate unique ID for the table
  const tableId = React.useId();
  
  // Announce table structure to screen readers on mount
  React.useEffect(() => {
    if (data.length > 0) {
      announceToScreenReader(
        `Tabela com ${data.length} linhas e ${columns.length} colunas. Use as teclas de seta para navegar.`,
        'polite'
      );
    } else {
      announceToScreenReader(emptyMessage, 'polite');
    }
  }, [data.length, columns.length, announceToScreenReader, emptyMessage]);
  
  return (
    <div className={cn(
      "w-full",
      responsive && "overflow-x-auto"
    )}>
      <table
        ref={ref}
        className={cn(
          "w-full border-collapse",
          bordered && "border border-neutral-200",
          highContrastMode && "high-contrast-table",
          className
        )}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-busy={isLoading ? 'true' : 'false'}
        id={tableId}
      >
        {caption && (
          <caption className="text-sm text-neutral-700 p-2 text-left">
            {caption}
          </caption>
        )}
        
        <thead className="bg-neutral-100">
          <tr>
            {columns.map((column, colIndex) => (
              <th
                key={`header-${colIndex}`}
                className={cn(
                  "text-left p-3 font-medium text-neutral-700",
                  bordered && "border border-neutral-200",
                  compact && "p-2 text-sm",
                  (column.sortable || sortable) && "cursor-pointer hover:bg-neutral-200",
                  column.width && column.width
                )}
                onClick={() => handleSort(column)}
                aria-sort={
                  sortColumn === column.accessorKey
                    ? sortDirection === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : undefined
                }
                tabIndex={colIndex === 0 ? 0 : -1}
                onFocus={() => handleCellFocus(-1, colIndex)}
                scope="col"
              >
                <div className="flex items-center gap-1">
                  {column.header}
                  
                  {(column.sortable || sortable) && (
                    <span className="inline-flex" aria-hidden="true">
                      {sortColumn === column.accessorKey ? (
                        sortDirection === 'asc' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m18 15-6-6-6 6"/>
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m6 9 6 6 6-6"/>
                          </svg>
                        )
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-30">
                          <path d="m18 15-6-6-6 6"/>
                          <path d="m6 9 6 6 6-6"/>
                        </svg>
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        
        <tbody>
          {isLoading ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center p-4"
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  <span>Carregando...</span>
                </div>
              </td>
            </tr>
          ) : paginatedData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center p-4 text-neutral-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            paginatedData.map((item, rowIndex) => (
              <tr
                key={`row-${rowIndex}`}
                className={cn(
                  zebra && rowIndex % 2 === 1 ? "bg-neutral-50" : "",
                  onRowClick && "cursor-pointer hover:bg-neutral-100"
                )}
                onClick={() => handleRowClick(item)}
                aria-selected={
                  focusedCell?.row === rowIndex ? 'true' : undefined
                }
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={`cell-${rowIndex}-${colIndex}`}
                    className={cn(
                      "p-3",
                      bordered && "border border-neutral-200",
                      compact && "p-2 text-sm",
                      focusedCell?.row === rowIndex && 
                      focusedCell?.col === colIndex && 
                      "outline outline-2 outline-primary-500"
                    )}
                    tabIndex={
                      focusedCell?.row === rowIndex && 
                      focusedCell?.col === colIndex
                        ? 0
                        : -1
                    }
                    onFocus={() => handleCellFocus(rowIndex, colIndex)}
                    onKeyDown={handleKeyDown}
                  >
                    {column.cell
                      ? column.cell(item)
                      : item[column.accessorKey] as React.ReactNode}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      
      {pagination && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-neutral-500">
            Mostrando {((pagination.currentPage - 1) * pagination.pageSize) + 1} a {
              Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)
            } de {pagination.totalItems} itens
          </div>
          
          <div className="flex items-center gap-1">
            <button
              className="p-2 rounded hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              aria-label="Página anterior"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            
            <span className="px-3 py-1">
              {pagination.currentPage} / {Math.ceil(pagination.totalItems / pagination.pageSize)}
            </span>
            
            <button
              className="p-2 rounded hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              disabled={
                pagination.currentPage ===
                Math.ceil(pagination.totalItems / pagination.pageSize)
              }
              aria-label="Próxima página"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default forwardRef(AccessibleTable) as <T extends Record<string, any>>(
  props: TableProps<T> & { ref?: React.ForwardedRef<HTMLTableElement> }
) => React.ReactElement;
