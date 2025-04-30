import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Trashed',
        href: '/trash',
    },
];

interface Task {
    id: number;
    title: string;
    description: string;
    status: string;
    due_date: string | null;
    priority: 'low' | 'medium' | 'high' | null;
}

interface PaginatedResponse<T> {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: { url: string | null; label: string; active: boolean }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export default function Index({data}:{data:  PaginatedResponse<Task> }){

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="overflow-x-auto dark:border-sidebar-border">
                    <Table className="w-full bg-neutral-100 dark:bg-neutral-800">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-left cursor-pointer">
                                    Title
                                </TableHead>
                                <TableHead>
                                    Description
                                </TableHead>
                                <TableHead>
                                    Status
                                </TableHead>
                                <TableHead>
                                    Priority
                                </TableHead>
                                <TableHead>
                                Due Date
                                </TableHead>

                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.data.length > 0 ? (
                                data.data.map((task) => (
                                    <TableRow key={task.id}>
                                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700 dark:text-neutral-300">
                                            {task.title}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700 dark:text-neutral-300">
                                            {task.description}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700 dark:text-neutral-300">
                                            <span
                                                className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                                                    task.status === 'completed'
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                                                        : task.status === 'pending'
                                                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                                                        : task.status === 'in-progress'
                                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
                                                }`}
                                            >
                                                {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700 dark:text-neutral-300">
                                            {task.priority || 'No priority set'}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700 dark:text-neutral-300">
                                            {task.due_date || 'No due date'}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="px-6 py-4 text-center text-sm text-neutral-500 dark:text-neutral-400"
                                    >
                                        No tasks found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <div className="flex items-center justify-center mt-4 space-x-2">
                        {data.links.map((link, index) => (
                            <button
                                key={index}

                                disabled={!link.url}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-4 py-2 text-sm rounded ${
                                    link.active
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            ></button>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
