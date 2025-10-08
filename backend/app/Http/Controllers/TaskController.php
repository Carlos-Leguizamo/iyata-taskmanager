<?php
namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller {
    public function index(Request $request) {
        $tasks = Task::whereHas('project', fn($q) => $q->where('user_id', $request->user()->id))
                     ->with('project')
                     ->paginate(10);
        return TaskResource::collection($tasks);
    }

    public function store(StoreTaskRequest $request) {
        // ensure project belongs to user
        $project = $request->user()->projects()->findOrFail($request->input('project_id'));
        $task = $project->tasks()->create($request->validated());
        return new TaskResource($task);
    }

    public function show(Task $task) {
        $this->authorize('view', $task->project);
        return new TaskResource($task);
    }

    public function update(StoreTaskRequest $request, Task $task) {
        $this->authorize('update', $task->project);
        $task->update($request->validated());
        return new TaskResource($task);
    }

    public function destroy(Task $task) {
        $this->authorize('delete', $task->project);
        $task->delete();
        return response()->json(null, 204);
    }
}
