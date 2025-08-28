import * as React from 'react';
import DataTable from './ui/DataTable';
import { type ColumnDef } from '@tanstack/react-table';
import { getClientTranslations, getTranslations } from '@/i18n/utils';

interface ComponentData {
    name: string;
    path: string;
    tags: string[];
}

interface ComponentsTableProps {
    data: ComponentData[];
}

export default function ComponentsTable({ data }: ComponentsTableProps) {
    // Get translations without hooks to avoid conflicts
    const t = typeof window === 'undefined' ? getTranslations('es') : getClientTranslations();

    const columns: ColumnDef<ComponentData>[] = [
        {
            accessorKey: 'name',
            header: () => t('showcase.table.component'),
            cell: ({ row }) => {
                const component = row.original;
                return <span className="font-mono text-main group-hover:text-secondary font-medium text-sm">{component.name}</span>;
            }
        },
        {
            accessorKey: 'tags',
            header: () => t('showcase.table.technologies'),
            cell: ({ row }) => {
                const tags = row.getValue('tags') as string[];
                return (
                    <div className="flex flex-wrap gap-1.5">
                        {tags.map((tag, index) => (
                            <span
                                key={index}
                                className="relative inline-block bg-secondary text-main px-2.5 py-0.5 !text-xs font-mono font-medium border-2 border-main overflow-hidden group-hover:bg-main group-hover:text-secondary group-hover:border-secondary"
                            >
                                #{tag}
                                <div className="absolute bottom-0 right-0 w-0 h-0 border-l-[8px] border-l-transparent border-b-[8px] border-b-main group-hover:border-b-secondary"></div>
                            </span>
                        ))}
                    </div>
                );
            },
            enableSorting: false // Disable sorting for tags since it's an array
        }
    ];

    return <DataTable columns={columns} data={data} getRowHref={(component) => component.path} />;
}
