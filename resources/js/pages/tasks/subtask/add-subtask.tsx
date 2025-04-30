import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@inertiajs/react";
import axios from "axios";
import { toast } from "sonner";

interface SubtaskFormData {
    [key:string] : string | undefined;
    title: string;
    description?: string;
    status: "to-do" | "in-progress" | "done";
}

interface AddSubtaskProps {
    taskId : number,
    onSuccess?: ()=> void;
}

export default function AddSubtask({taskId,onSuccess}:AddSubtaskProps){
    const { data, setData, processing, errors } = useForm<SubtaskFormData>({
        title: "",
        description: "",
        status: "to-do", // Default status
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setData(name as keyof SubtaskFormData, value);
    };

    const handleStatusChange = (value: string) => {
        setData("status", value as "to-do" | "in-progress" | "done");
    };


    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();

        try {

            const formData = {
                title: data.title,
                description: data.description,
                status: data.status,
                task_id : taskId
            };

            const response = await axios.post(route("subtask-manager.store"), formData);

            console.log(response.data);
            setData({ title: "", description: "", status: "to-do" });
            if (onSuccess) onSuccess(); // Call optional success callback
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || 'Something went wrong!');
            }
        }

    };

    return (
        <div className="p-4 space-y-4 bg-white shadow-md rounded-md">
            <form onSubmit={handleSubmit}>
                {/* Title Input */}
                <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                        type="text"
                        id="title"
                        name="title"
                        value={data.title}
                        onChange={handleChange}
                        placeholder="Enter subtask title"
                        className="mt-2"
                        required
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>
                {/* Description Input */}
                <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        name="description"
                        value={data.description || ""}
                        onChange={handleChange}
                        placeholder="Enter subtask description"
                        className="mt-2"
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>
                {/* Status Selection */}
                <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                        name="status"
                        value={data.status}
                        onValueChange={handleStatusChange}
                    >
                       <SelectTrigger
                            className="mt-1 w-full rounded-md border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 appearance-none bg-none"
                        >
                            <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Status</SelectLabel>
                                <SelectItem value="to-do">To Do</SelectItem>
                                <SelectItem value="in-progress">In Progress</SelectItem>
                                <SelectItem value="done">Done</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
                </div>
                {/* Submit Button */}
                <Button type="submit" className="w-full mt-4" disabled={processing}>
                    {processing ? "Adding..." : "Add Subtask"}
                </Button>
            </form>
        </div>
    );

}
