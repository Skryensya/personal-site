import * as React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import { ArrowDownZA, ArrowUpAZ, ArrowUpDown } from 'lucide-react';

const { useState } = React;

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  getRowHref?: (row: TData) => string;
}

export default function DataTable<TData, TValue>({
  columns,
  data,
  getRowHref,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  return (
    <div className="bg-secondary">
      <table className="w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header, index) => (
                <th key={header.id} className={`text-left py-2 pb-3 ${index === 0 ? 'pl-3' : 'pl-2'}`}>
                  {header.isPlaceholder ? null : (
                    <div
                      className={`flex items-center text-main text-xs font-medium ${
                        header.column.getCanSort() ? 'cursor-pointer hover:text-main/80' : ''
                      }`}
                      style={{ fontFamily: 'JetBrains Mono, monospace' }}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getCanSort() && (
                        <span className="ml-1.5">
                          {header.column.getIsSorted() === 'desc' ? (
                            <ArrowDownZA className="w-3 h-3" />
                          ) : header.column.getIsSorted() === 'asc' ? (
                            <ArrowUpAZ className="w-3 h-3" />
                          ) : (
                            <ArrowUpDown className="w-3 h-3 opacity-40" />
                          )}
                        </span>
                      )}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              const href = getRowHref?.(row.original);
              
              return (
                <tr key={row.id} className="border-t border-main/20 group">
                  <td colSpan={columns.length} className="p-0">
                    <div className="mx-0.5 my-px">
                      {href ? (
                        <a
                          href={href}
                          className="flex items-center hover:bg-main hover:text-secondary cursor-pointer px-2.5 py-2 rounded-sm"
                        >
                          {row.getVisibleCells().map((cell, index) => (
                            <div key={cell.id} className={`${index === 0 ? 'flex-1 min-w-0' : index === 1 ? 'flex-none' : 'flex-none ml-3'}`}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </div>
                          ))}
                        </a>
                      ) : (
                        <div className="flex items-center px-2.5 py-2">
                          {row.getVisibleCells().map((cell, index) => (
                            <div key={cell.id} className={`${index === 0 ? 'flex-1 min-w-0' : index === 1 ? 'flex-none' : 'flex-none ml-3'}`}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="h-16 text-center font-mono text-main/60 text-sm py-8"
              >
                No results.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}