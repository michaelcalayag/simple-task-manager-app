<?php

namespace App\Http\Controllers;

use App\Models\Tasks;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $uid = auth()->user()->id;

        return Inertia::render('tasks/index', [
            'Tasks' => Tasks::where('user_id', $uid)->orderBy('id','asc')->paginate(10)->withQueryString(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('tasks/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:100|unique:tasks,title',
            'description' => 'required|nullable|string',
            'status' => 'required|string',
            'due_date' => 'nullable|date',
            'image' => 'nullable|file|mimes:jpeg,png,jpg|max:4096',
            'priority' => 'nullable|string|in:low,medium,high',
        ]);


        $filePath = null;
        if ($request->hasFile('image')) {
            $filePath = $request->file('image')->store('tasks', 'public');
            Log::info('filePath: '.$filePath);
        }

        Tasks::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'status' => $validated['status'],
            'due_date' => $validated['due_date'],
            'image' => $filePath,
            'user_id' => auth()->user()->id,
            'priority' => $validated['priority'],
        ]);

        return redirect()->route('task-manager.index')->with('success', 'Task successfully created!');

    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $uid = auth()->user()->id;

        return Inertia::render('tasks/edit', [
            'Task' => Tasks::findOrFail($id)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:100|unique:tasks,title,'.$id,
            'description' => 'required|nullable|string',
            'status' => 'required|string',
            'due_date' => 'nullable|date',
            'priority' => 'nullable|string|in:low,medium,high',
        ]);

        Tasks::findOrFail($id)->update([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'status' => $validated['status'],
            'due_date' => $validated['due_date'],
            'priority' => $validated['priority'],
        ]);

        return response()->json(['message'=>'successfully updated!']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request,string $id)
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        Tasks::findOrFail($id)->delete();

        redirect()->route('task-manager.index');
    }

    public function filteredData(Request $request)
    {
        try {

            $uid = auth()->user()->id;
            $pageLimit = $request['params']['pageLimit'] ?? 10; // Default page limit
            $sortColumn = $request['params']['sortColumn'] ?? 'id'; // Default column
            $sortDirection = $request['params']['sortDirection'] ?? 'asc'; // Default direction
            $searchTitle = $request['params']['searchTitle'] ?? ''; // Default search title
            $filterStatus = $request['params']['filterStatus'] ?? '';

            $tasks = Tasks::where('user_id', $uid)
                ->where(function ($query) use ($searchTitle) {
                    if ($searchTitle) {
                        $query->where('title', 'like', '%' . $searchTitle . '%');
                    }
                })
                ->where(function ($query) use ($filterStatus) {
                    if ($filterStatus) {
                        $query->where('status',$filterStatus);
                    }
                })
                ->orderBy($sortColumn, $sortDirection)
                ->paginate($pageLimit);

            return response()->json(['Tasks' => $tasks]);
        } catch (Exception $e) {
            Log::error('Error fetching filtered tasks: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch tasks. Please try again later.',
            ], 500);
        }
    }

    public function updateStatus(Request $request, string $id)
    {
        try {
            $validatedData = $request->validate([
                'status' => 'required',
            ]);

            $task = Tasks::findOrFail($id);

            if($task->status != 'draft')
            {
                throw new Exception('Cannot update task is ongoing!',401);
            }

            $data = Tasks::where('id',$id)->update([
                'status' => $validatedData['status'],
            ]);

            return response()->json([
                'message' => 'Status updated successfully.',
                'data' => $data
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ],401);
        }
    }
}
