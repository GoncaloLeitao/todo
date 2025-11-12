import { Hono } from "hono";
import { Env } from './core-utils';
import type { Todo, ApiResponse } from '@shared/types';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
    // --- To-Do List API Endpoints ---
    // Get all todos
    app.get('/api/todos', async (c) => {
        const durableObjectStub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const data = await durableObjectStub.getTodos();
        return c.json({ success: true, data } satisfies ApiResponse<Todo[]>);
    });
    // Add a new todo
    app.post('/api/todos', async (c) => {
        const todo = await c.req.json<Todo>();
        const durableObjectStub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const data = await durableObjectStub.addTodo(todo);
        return c.json({ success: true, data } satisfies ApiResponse<Todo[]>);
    });
    // Update a todo
    app.put('/api/todos/:id', async (c) => {
        const todo = await c.req.json<Todo>();
        const durableObjectStub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const data = await durableObjectStub.updateTodo(todo);
        return c.json({ success: true, data } satisfies ApiResponse<Todo[]>);
    });
    // Delete a todo
    app.delete('/api/todos/:id', async (c) => {
        const id = c.req.param('id');
        const durableObjectStub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const data = await durableObjectStub.deleteTodo(id);
        return c.json({ success: true, data } satisfies ApiResponse<Todo[]>);
    });
    // Clear all completed todos
    app.post('/api/todos/clear-completed', async (c) => {
        const durableObjectStub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const data = await durableObjectStub.clearCompletedTodos();
        return c.json({ success: true, data } satisfies ApiResponse<Todo[]>);
    });
}