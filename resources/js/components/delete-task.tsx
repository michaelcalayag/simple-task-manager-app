import { useForm } from "@inertiajs/react";
import { FormEventHandler, useRef } from "react";

import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import HeadingSmall from "@/components/heading-small";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface DeleteTaskProps {
    taskid: number;
}

export default function DeleteTask({ taskid }: DeleteTaskProps) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const { data, setData, delete: destroy, processing, reset, errors, clearErrors } = useForm<{ password: string }>({
        password: "",
    });

    const deleteTask: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route("task-manager.destroy", { id: taskid }), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        clearErrors();
        reset();
    };

    return (
        <div className="space-y-6">
            <HeadingSmall
                title="Delete Task"
                description="Move your account and all its associated resources to the trash module."
            />
            <div className="space-y-4 rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-200/10 dark:bg-red-700/10">
                <div className="relative space-y-0.5 text-red-600 dark:text-red-100">
                    <p className="font-medium">Warning</p>
                    <p className="text-sm">Please proceed with caution, this cannot be undone.</p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="destructive">Delete Task</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle>Are you sure you want to delete this task?</DialogTitle>
                        <DialogDescription>
                            When your task is moved to the trash, all its associated resources and data will be marked
                            for deletion. To proceed, please enter your password to confirm moving this task to the
                            trash.
                        </DialogDescription>
                        <form className="space-y-6" onSubmit={deleteTask}>
                            <div className="grid gap-2">
                                <Label htmlFor="password" className="sr-only">
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    ref={passwordInput}
                                    value={data.password}
                                    onChange={(e) => setData("password", e.target.value)}
                                    placeholder="Password"
                                    autoComplete="current-password"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <DialogFooter className="gap-2">
                                <DialogClose asChild>
                                    <Button variant="secondary" onClick={closeModal}>
                                        Cancel
                                    </Button>
                                </DialogClose>

                                <Button variant="destructive" disabled={processing} asChild>
                                    <button type="submit">Delete Task</button>
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
