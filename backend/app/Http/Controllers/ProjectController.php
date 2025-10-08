<?php
namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use Illuminate\Http\Request;


class ProjectController extends Controller {
    public function index(Request $request) {
        $projects = $request->user()->projects()->withCount('tasks')->paginate(10);
        return ProjectResource::collection($projects);
    }

    public function store(StoreProjectRequest $request) {
        $project = $request->user()->projects()->create($request->validated());
        return new ProjectResource($project);
    }

    public function show(Project $project) {
        $this->authorize('view', $project);
        $project->load('tasks');
        return new ProjectResource($project);
    }

    public function update(StoreProjectRequest $request, Project $project) {
        $this->authorize('update', $project);
        $project->update($request->validated());
        return new ProjectResource($project);
    }

    public function destroy(Project $project) {
        $this->authorize('delete', $project);
        $project->delete();
        return response()->json(null, 204);
    }
}
