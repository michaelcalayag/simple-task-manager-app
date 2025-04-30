import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Label } from '@radix-ui/react-label';
import { CircleOff, Save } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import DeleteTask from '@/components/delete-task';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Task Manager',
        href: route('task-manager.index'),
    },
    {
        title: 'Edit Task',
        href: route('task-manager.create'),
    },
];

interface Task {
    id: number;
    title: string;
    description: string;
    status: string;
    priority: string;
    due_date: string;
    image: File | null;
}

export default function EditTask({Task} : {Task : Task }) {
    const baseURL = import.meta.env.VITE_API_BASE_URL || process.env.REACT_APP_API_BASE_URL;

    const [formData, setFormData] = useState<Task>({
        id: Task.id,
        title: Task.title,
        description: Task.description,
        status: Task.status,
        priority: Task.priority,
        due_date: Task.due_date,
        image: Task.image,
    });

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    const handleSubmit = async () => {
        try {
            const response = await axios.put(route('task-manager.update', formData.id),formData);
            toast.success(response.data.message);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || 'Something went wrong!');
            }
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Task" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div className="flex items-center justify-between border-b border-neutral-300 p-4 dark:border-neutral-700 dark:bg-neutral-800">
                    <div className="flex items-center">
                        <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Task Manager</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="mb-4" onClick={ handleSubmit}>
                            <Save /> Update
                        </Button>
                        <Button onClick={()=> window.location.href =  route('task-manager.index') } variant="outline" className="mb-4">
                            <CircleOff /> Cancel
                        </Button>
                    </div>
                </div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Fill out the form below to create a new task. Ensure all fields are filled out correctly.
                </p>
                <form className="space-y-6">
                    <div className="flex flex-col gap-10 md:flex-row">
                        <div className="flex-1 space-y-6">
                            <div>
                                <Label
                                    htmlFor="title"
                                    className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                                >
                                    Title
                                </Label>
                                <Input
                                    type="text"
                                    name="title"
                                    id="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder='Enter task title'
                                    required
                                    className="mt-1 block w-full rounded-md border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                                />
                            </div>
                            <div>
                                <Label
                                    htmlFor="description"
                                    className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                                >
                                    Description
                                </Label>
                                <Textarea
                                    name="description"
                                    id="description"
                                    placeholder='Enter task description'
                                    value={formData.description}
                                    onChange={handleTextareaChange}
                                    rows={4}
                                    className="mt-1 block w-full rounded-md border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                                ></Textarea>
                            </div>
                            <div>
                                <Label
                                    htmlFor="status"
                                    className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                                >
                                    Status
                                </Label>
                                <Select
                                    name="status"
                                    value={formData.status}
                                    onValueChange={(value) => {
                                        setFormData((prevData) => ({
                                            ...prevData,
                                            status: value,
                                        }));
                                    }}
                                >
                                    <SelectTrigger
                                        className="mt-1 w-full rounded-md border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 appearance-none bg-none"
                                    >
                                        <SelectValue placeholder="Select a status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Status</SelectLabel>
                                            <SelectItem value="draft">Draft</SelectItem>
                                            <SelectItem value="publish">Publish</SelectItem>
                                            <SelectItem value="to-do">To Do</SelectItem>
                                            <SelectItem value="in-progress">In Progress</SelectItem>
                                            <SelectItem value="done">Done</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label
                                    htmlFor="priority"
                                    className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                                >
                                    Priority
                                </Label>
                                <Select
                                    name="priority"
                                    value={formData.priority}
                                    onValueChange={(value) => {
                                        setFormData((prevData) => ({
                                            ...prevData,
                                            priority: value,
                                        }));
                                    }}
                                >
                                    <SelectTrigger
                                        className="mt-1 w-full rounded-md border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                                    >
                                        <SelectValue placeholder="Select a priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                        <SelectLabel>Priority</SelectLabel>
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label
                                    htmlFor="due_date"
                                    className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                                >
                                    Due Date
                                </Label>
                                <Input
                                    type="datetime-local"
                                    name="due_date"
                                    id="due_date"
                                    value={formData.due_date}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                                />
                            </div>
                        </div>
                        <div className="w-full md:w-1/3">

                            {Task.image ? (
                                <div className="flex flex-col space-y-3 mt-3">
                                    <img
                                        src={`${baseURL}/storage/${Task.image}`}
                                        alt="Task Preview"
                                        className="rounded-md border border-neutral-300 dark:border-neutral-700 shadow-sm"
                                    />
                                    <span className="text-neutral-500 text-sm">
                                        File Path: {JSON.stringify(Task.image)}
                                    </span>
                                </div>
                            ) : (
                                // Fallback when no image is available
                                <div className="flex flex-col space-y-3 mt-3">
                                    <span className="text-neutral-500 dark:text-neutral-400 text-sm">
                                        No image available for this task.
                                    </span>
                                </div>
                            )}
                            <p className='mt-4'>
                                <DeleteTask id={ Task.id }/>
                            </p>
                        </div>
                    </div>
                </form>

                <div className="mt-6">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Note: Ensure all fields are filled out correctly before submitting.
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
