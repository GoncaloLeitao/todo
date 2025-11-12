import React, { useState, useEffect, useMemo } from 'react';
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Trash2, CheckCircle, Circle, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Toaster, toast } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
import type { Todo, ApiResponse } from '@shared/types';
type Filter = 'all' | 'active' | 'completed';
interface TodoState {
  todos: Todo[];
  loading: boolean;
  filter: Filter;
  setTodos: (todos: Todo[]) => void;
  setLoading: (loading: boolean) => void;
  setFilter: (filter: Filter) => void;
}
const useTodoStore = create<TodoState>((set) => ({
  todos: [],
  loading: true,
  filter: 'all',
  setTodos: (todos) => set({ todos }),
  setLoading: (loading) => set({ loading }),
  setFilter: (filter) => set({ filter }),
}));
const api = {
  async getTodos(): Promise<Todo[]> {
    const res = await fetch('/api/todos');
    const json: ApiResponse<Todo[]> = await res.json();
    if (!json.success || !json.data) throw new Error('Failed to fetch todos');
    return json.data;
  },
  async addTodo(todo: Todo): Promise<Todo[]> {
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo),
    });
    const json: ApiResponse<Todo[]> = await res.json();
    if (!json.success || !json.data) throw new Error('Failed to add todo');
    return json.data;
  },
  async updateTodo(todo: Todo): Promise<Todo[]> {
    const res = await fetch(`/api/todos/${todo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo),
    });
    const json: ApiResponse<Todo[]> = await res.json();
    if (!json.success || !json.data) throw new Error('Failed to update todo');
    return json.data;
  },
  async deleteTodo(id: string): Promise<Todo[]> {
    const res = await fetch(`/api/todos/${id}`, { method: 'DELETE' });
    const json: ApiResponse<Todo[]> = await res.json();
    if (!json.success || !json.data) throw new Error('Failed to delete todo');
    return json.data;
  },
  async clearCompleted(): Promise<Todo[]> {
    const res = await fetch('/api/todos/clear-completed', { method: 'POST' });
    const json: ApiResponse<Todo[]> = await res.json();
    if (!json.success || !json.data) throw new Error('Failed to clear completed todos');
    return json.data;
  },
};
function TodoItem({ todo }: { todo: Todo }) {
  const setTodos = useTodoStore((state) => state.setTodos);
  const [isUpdating, setIsUpdating] = useState(false);
  const handleToggle = async () => {
    setIsUpdating(true);
    try {
      const updatedTodos = await api.updateTodo({ ...todo, completed: !todo.completed });
      setTodos(updatedTodos);
    } catch (error) {
      toast.error('Failed to update task.');
    } finally {
      setIsUpdating(false);
    }
  };
  const handleDelete = async () => {
    try {
      const updatedTodos = await api.deleteTodo(todo.id);
      setTodos(updatedTodos);
      toast.success('Task deleted.');
    } catch (error) {
      toast.error('Failed to delete task.');
    }
  };
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="group flex items-center gap-4 p-3 transition-colors duration-200 hover:bg-accent rounded-lg"
    >
      <Checkbox
        id={`todo-${todo.id}`}
        checked={todo.completed}
        onCheckedChange={handleToggle}
        disabled={isUpdating}
        className="size-5 rounded-full"
      />
      <label
        htmlFor={`todo-${todo.id}`}
        className={cn(
          'flex-1 text-base font-medium transition-all duration-300 cursor-pointer',
          todo.completed ? 'line-through text-muted-foreground' : 'text-foreground'
        )}
      >
        {todo.text}
      </label>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        className="size-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-muted-foreground hover:text-destructive"
      >
        <X className="size-4" />
      </Button>
    </motion.div>
  );
}
function TodoList() {
  const todos = useTodoStore((state) => state.todos);
  const filter = useTodoStore((state) => state.filter);
  const filteredTodos = useMemo(() => {
    const sorted = [...todos].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (filter === 'active') return sorted.filter((todo) => !todo.completed);
    if (filter === 'completed') return sorted.filter((todo) => todo.completed);
    return sorted;
  }, [todos, filter]);
  if (filteredTodos.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground animate-fade-in">
        <CheckCircle className="mx-auto size-12 mb-4" />
        <p className="text-lg font-medium">All tasks completed!</p>
        <p>You're all caught up.</p>
      </div>
    );
  }
  return (
    <div className="space-y-2">
      <AnimatePresence>
        {filteredTodos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </AnimatePresence>
    </div>
  );
}
export function HomePage() {
  const [newTodoText, setNewTodoText] = useState('');
  const todos = useTodoStore((state) => state.todos);
  const loading = useTodoStore((state) => state.loading);
  const filter = useTodoStore((state) => state.filter);
  const setTodos = useTodoStore((state) => state.setTodos);
  const setLoading = useTodoStore((state) => state.setLoading);
  const setFilter = useTodoStore((state) => state.setFilter);
  useEffect(() => {
    async function fetchTodos() {
      try {
        const initialTodos = await api.getTodos();
        setTodos(initialTodos);
      } catch (error) {
        toast.error('Could not load your tasks.');
      } finally {
        setLoading(false);
      }
    }
    fetchTodos();
  }, [setTodos, setLoading]);
  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;
    const newTodo: Todo = {
      id: uuidv4(),
      text: newTodoText.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setNewTodoText('');
    try {
      const updatedTodos = await api.addTodo(newTodo);
      setTodos(updatedTodos);
    } catch (error) {
      toast.error('Failed to add new task.');
    }
  };
  const handleClearCompleted = async () => {
    try {
      const activeTodos = await api.clearCompleted();
      setTodos(activeTodos);
      toast.success('Completed tasks cleared.');
    } catch (error) {
      toast.error('Failed to clear completed tasks.');
    }
  };
  const activeCount = useMemo(() => todos.filter((t) => !t.completed).length, [todos]);
  const completedCount = useMemo(() => todos.filter((t) => t.completed).length, [todos]);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative">
      <ThemeToggle className="absolute top-4 right-4" />
      <main className="w-full max-w-2xl mx-auto">
        <Card className="shadow-soft dark:shadow-none border-border/50 animate-scale-in">
          <CardHeader className="text-center pt-8">
            <h1 className="text-4xl font-display font-bold text-foreground">Africacom To-Do List</h1>
            <p className="text-muted-foreground">Focus on what matters.</p>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <form onSubmit={handleAddTodo} className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="What needs to be done?"
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                className="h-12 text-lg"
                aria-label="New todo input"
              />
              <Button type="submit" size="icon" className="h-12 w-12 flex-shrink-0" aria-label="Add new todo">
                <Plus className="size-5" />
              </Button>
            </form>
            <div className="min-h-[200px]">
              {loading ? (
                <div className="flex items-center justify-center h-full py-12">
                  <Loader2 className="size-8 animate-spin text-primary" />
                </div>
              ) : (
                <TodoList />
              )}
            </div>
            <Separator />
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
              <span>{activeCount} {activeCount === 1 ? 'item' : 'items'} left</span>
              <div className="flex items-center gap-2">
                <Button variant={filter === 'all' ? 'secondary' : 'ghost'} size="sm" onClick={() => setFilter('all')}>All</Button>
                <Button variant={filter === 'active' ? 'secondary' : 'ghost'} size="sm" onClick={() => setFilter('active')}>Active</Button>
                <Button variant={filter === 'completed' ? 'secondary' : 'ghost'} size="sm" onClick={() => setFilter('completed')}>Completed</Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearCompleted}
                disabled={completedCount === 0}
                className="hover:text-destructive"
              >
                Clear completed
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <footer className="text-center text-muted-foreground/80 mt-12">
        <p>Built with ��️ at Cloudflare</p>
      </footer>
      <Toaster richColors closeButton />
    </div>
  );
}