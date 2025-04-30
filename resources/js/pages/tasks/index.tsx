import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import {  BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Label } from '@radix-ui/react-label';
import axios from 'axios';
import { ArrowDown, ArrowUp, ArrowUpDown, PencilLine, Plus } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Task Manager',
        href: '/task-manager',
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

export default function Index({ Tasks }: { Tasks: PaginatedResponse<Task> }) {
    console.log(Tasks);
    const [tasks, setTasks] = useState<Task[]>(Tasks?.data);
    const [pagination, setPagination] = useState<PaginatedResponse<Task>>(Tasks);
    const [sortColumn, setSortColumn] = useState('id');
    const [searchTitle, setSearchTitle] = useState(null as string | null);
    const [filterStatus, setFilterStatus] = useState(null as string | null);

    const [sortDirection, setSortDirection] = useState('asc');
    const [pageLimit, setPageLimit] = useState(Tasks.per_page || 10);

    const fetchTasks = useCallback(async (url: string | null = null) => {
        try {
            // console.log(route('task-manager.filter'), 'url')
            const response = await axios.post(url || route('task-manager.filter'), {
                params: { sortColumn, sortDirection, pageLimit,  searchTitle , filterStatus},
            });

            if (response.data && response.data.Tasks) {
                setTasks(response.data.Tasks.data || []);
                setPagination(response.data.Tasks || []);
            } else {
                console.error('Invalid data format:', response.data);
                setTasks([]);
            }

        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    }, [sortColumn, sortDirection, pageLimit, searchTitle, filterStatus]);

    const updateStatus = async(status: boolean, id: number) => {
        try {
            await axios.put(route('task-manager.updateStatus',id),{
                status : status ? 'to-do' : 'draft'
            });

            const url = route('task-manager.filter');
            fetchTasks(url);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || 'Something went wrong!');
            } else {
                toast.error('An unexpected error occurred.');
            }
        }
    }

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleSort = (column: string) => {
        const direction = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortColumn(column);
        setSortDirection(direction);
    };

    const handleLimitChange = (newLimit: string) => {
        const limit = parseInt(newLimit, 10);
        setPageLimit(limit);
    };

    const handlePagination = (url: string | null) => {
        if (url) {
            fetchTasks(url);
        }
    };

    const handleSearchInputChange = (value: string) => {
        setSearchTitle(value);
        const url = route('task-manager.filter');
        fetchTasks(url);
    };

    const handleStatusChange = (value: string) => {
        setFilterStatus(value == 'all' ? null : value);
        const url = route('task-manager.filter');
        fetchTasks(url);
    };

    const handleIsPublished = async (value: boolean, id: number) => {
        updateStatus(value, id); // Proceed with server update only if necessary
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="overflow-x-auto dark:border-sidebar-border">
                    <div className="flex items-center justify-between border-b border-neutral-300 p-4 dark:border-neutral-700 dark:bg-neutral-800">
                        <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Task Manager</h1>
                        <Button
                            onClick={() => (window.location.href = route('task-manager.create'))}
                            variant="outline"
                            className="mb-4"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Task
                        </Button>
                    </div>

                    {/* Items per Page Dropdown */}
                    <div className="mt-2 flex items-center justify-between mb-4">
                        {/* Items per page dropdown */}
                        <div className="flex items-center">
                            <Label htmlFor="itemsPerPage" className="mr-2 text-sm text-neutral-700 dark:text-neutral-300">
                                Items per page:
                            </Label>
                            <Select
                                value={pageLimit.toString()}
                                onValueChange={(value) => handleLimitChange(value)}
                            >
                                <SelectTrigger className="w-32 rounded-md border border-neutral-300 bg-white py-2 px-3 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
                                    <SelectValue placeholder="Select a limit" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="2">2</SelectItem>
                                        <SelectItem value="5">5</SelectItem>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="25">25</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Table */}
                    <Table className="w-full bg-neutral-100 dark:bg-neutral-800">
                        <TableHeader>
                            <TableRow>
                                <TableHead
                                    onClick={() => handleSort('title')}
                                    className="text-left cursor-pointer"
                                >
                                    <div className="flex items-center">
                                        <span>Title</span>
                                        <div className="ml-2 flex items-center justify-end">
                                            {sortColumn === 'title' ? (
                                                sortDirection === 'asc' ? (
                                                    <ArrowUp className="h-4 w-4 text-neutral-500 dark:text-neutral-300" />
                                                ) : (
                                                    <ArrowDown className="h-4 w-4 text-neutral-500 dark:text-neutral-300" />
                                                )
                                            ) : (
                                                <ArrowUpDown className="h-4 w-4 text-neutral-500 dark:text-neutral-300" />
                                            )}
                                        </div>
                                    </div>
                                </TableHead>
                                <TableHead
                                    onClick={() => handleSort('description')}
                                    className="text-left cursor-pointer"
                                >
                                    <div className="flex items-center">
                                        <span>Description</span>
                                        <div className="ml-2 flex items-center justify-end">
                                            {sortColumn === 'description' ? (
                                                sortDirection === 'asc' ? (
                                                    <ArrowUp className="h-4 w-4 text-neutral-500 dark:text-neutral-300" />
                                                ) : (
                                                    <ArrowDown className="h-4 w-4 text-neutral-500 dark:text-neutral-300" />
                                                )
                                            ) : (
                                                <ArrowUpDown className="h-4 w-4 text-neutral-500 dark:text-neutral-300" />
                                            )}
                                        </div>
                                    </div>
                                </TableHead>
                                <TableHead
                                    onClick={() => handleSort('status')}
                                    className="text-left cursor-pointer"
                                >
                                    <div className="flex items-center">
                                        <span>Status</span>
                                        <div className="ml-2 flex items-center justify-end">
                                            {sortColumn === 'status' ? (
                                                sortDirection === 'asc' ? (
                                                    <ArrowUp className="h-4 w-4 text-neutral-500 dark:text-neutral-300" />
                                                ) : (
                                                    <ArrowDown className="h-4 w-4 text-neutral-500 dark:text-neutral-300" />
                                                )
                                            ) : (
                                                <ArrowUpDown className="h-4 w-4 text-neutral-500 dark:text-neutral-300" />
                                            )}
                                        </div>
                                    </div>
                                </TableHead>
                                <TableHead
                                    onClick={() => handleSort('priority')}
                                    className="text-left cursor-pointer"
                                >
                                    <div className="flex items-center">
                                        <span>Priority</span>
                                        <div className="ml-2 flex items-center justify-end">
                                            {sortColumn === 'priority' ? (
                                                sortDirection === 'asc' ? (
                                                    <ArrowUp className="h-4 w-4 text-neutral-500 dark:text-neutral-300" />
                                                ) : (
                                                    <ArrowDown className="h-4 w-4 text-neutral-500 dark:text-neutral-300" />
                                                )
                                            ) : (
                                                <ArrowUpDown className="h-4 w-4 text-neutral-500 dark:text-neutral-300" />
                                            )}
                                        </div>
                                    </div>
                                </TableHead>
                                <TableHead
                                    onClick={() => handleSort('due_date')}
                                    className="text-left cursor-pointer"
                                >
                                    <div className="flex items-center">
                                        <span>Due Date</span>
                                        <div className="ml-2 flex items-center justify-end">
                                            {sortColumn === 'due_date' ? (
                                                sortDirection === 'asc' ? (
                                                    <ArrowUp className="h-4 w-4 text-neutral-500 dark:text-neutral-300" />
                                                ) : (
                                                    <ArrowDown className="h-4 w-4 text-neutral-500 dark:text-neutral-300" />
                                                )
                                            ) : (
                                                <ArrowUpDown className="h-4 w-4 text-neutral-500 dark:text-neutral-300" />
                                            )}
                                        </div>
                                    </div>
                                </TableHead>
                                <TableHead>
                                    Published
                                </TableHead>
                                <TableHead>
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className='px-6 py-2 whitespace-nowrap text-sm text-neutral-700 dark:text-neutral-300'>
                                    {/* Search Input */}
                                    <Input
                                        type="text"
                                        id="search"
                                        placeholder="Search by title"
                                        className="w-64 rounded-md border border-neutral-300 bg-white py-2 px-3 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                                        onChange={(e) => handleSearchInputChange(e.target.value)}
                                    />
                                </TableCell>
                                <TableCell className="px-6 py-2 whitespace-nowrap text-sm text-neutral-700 dark:text-neutral-300"></TableCell>
                                <TableCell className="px-6 py-2 whitespace-nowrap text-sm text-neutral-700 dark:text-neutral-300">
                                    <Select
                                        onValueChange={(value) => {
                                            handleStatusChange(value);
                                            const url = route('task-manager.filter');
                                            fetchTasks(url);
                                        }}
                                    >
                                        <SelectTrigger className="w-32 rounded-md border border-neutral-300 bg-white py-2 px-3 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
                                            <SelectValue placeholder="Filter by status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="all">All</SelectItem>
                                                <SelectItem value="done">Done</SelectItem>
                                                <SelectItem value="pending">In Progress</SelectItem>
                                                <SelectItem value="to-do">To Do</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                                <TableCell colSpan={4} className="px-6 py-2 whitespace-nowrap text-sm text-neutral-700 dark:text-neutral-300"></TableCell>
                            </TableRow>
                            {tasks.length > 0 ? (
                                tasks.map((task) => (
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
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <Switch
                                                checked ={ task.status != 'draft' ? true : false}
                                                onCheckedChange={(value) => {
                                                    handleIsPublished(value,task.id)
                                                }} />
                                                <Label>
                                                    { task.status != 'draft' ? 'Published' : 'Draft' }
                                                </Label>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-4">
                                                <Link
                                                    href={route('task-manager.edit', task.id)}
                                                    className="flex items-center text-blue-600 hover:underline font-medium"
                                                >
                                                    <PencilLine className="mr-2 text-blue-600" /> {/* Adds space between the icon and text */}
                                                    Edit
                                                </Link>
                                            </div>
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

                    {/* Pagination Links */}
                    <div className="flex items-center justify-center mt-4 space-x-2">
                        {pagination.links.map((link, index) => (
                            <button
                                key={index}
                                onClick={() => handlePagination(link.url)}
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
