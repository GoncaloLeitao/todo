import { DurableObject } from "cloudflare:workers";
import type { DemoItem, Todo } from '@shared/types';
import { MOCK_ITEMS } from '@shared/mock-data';
// **DO NOT MODIFY THE CLASS NAME**
export class GlobalDurableObject extends DurableObject {
    async getCounterValue(): Promise<number> {
      const value = (await this.ctx.storage.get("counter_value")) || 0;
      return value as number;
    }
    async increment(amount = 1): Promise<number> {
      let value: number = (await this.ctx.storage.get("counter_value")) || 0;
      value += amount;
      await this.ctx.storage.put("counter_value", value);
      return value;
    }
    async decrement(amount = 1): Promise<number> {
      let value: number = (await this.ctx.storage.get("counter_value")) || 0;
      value -= amount;
      await this.ctx.storage.put("counter_value", value);
      return value;
    }
    async getDemoItems(): Promise<DemoItem[]> {
      const items = await this.ctx.storage.get("demo_items");
      if (items) {
        return items as DemoItem[];
      }
      await this.ctx.storage.put("demo_items", MOCK_ITEMS);
      return MOCK_ITEMS;
    }
    async addDemoItem(item: DemoItem): Promise<DemoItem[]> {
      const items = await this.getDemoItems();
      const updatedItems = [...items, item];
      await this.ctx.storage.put("demo_items", updatedItems);
      return updatedItems;
    }
    async updateDemoItem(id: string, updates: Partial<Omit<DemoItem, 'id'>>): Promise<DemoItem[]> {
      const items = await this.getDemoItems();
      const updatedItems = items.map(item =>
        item.id === id ? { ...item, ...updates } : item
      );
      await this.ctx.storage.put("demo_items", updatedItems);
      return updatedItems;
    }
    async deleteDemoItem(id: string): Promise<DemoItem[]> {
      const items = await this.getDemoItems();
      const updatedItems = items.filter(item => item.id !== id);
      await this.ctx.storage.put("demo_items", updatedItems);
      return updatedItems;
    }
    // --- To-Do List Methods ---
    async getTodos(): Promise<Todo[]> {
      const todos = await this.ctx.storage.get<Todo[]>("todos");
      return todos || [];
    }
    async addTodo(todo: Todo): Promise<Todo[]> {
      const todos = await this.getTodos();
      const updatedTodos = [...todos, todo];
      await this.ctx.storage.put("todos", updatedTodos);
      return updatedTodos;
    }
    async updateTodo(updatedTodo: Todo): Promise<Todo[]> {
      const todos = await this.getTodos();
      const updatedTodos = todos.map(todo =>
        todo.id === updatedTodo.id ? updatedTodo : todo
      );
      await this.ctx.storage.put("todos", updatedTodos);
      return updatedTodos;
    }
    async deleteTodo(id: string): Promise<Todo[]> {
      const todos = await this.getTodos();
      const updatedTodos = todos.filter(todo => todo.id !== id);
      await this.ctx.storage.put("todos", updatedTodos);
      return updatedTodos;
    }
    async clearCompletedTodos(): Promise<Todo[]> {
      const todos = await this.getTodos();
      const activeTodos = todos.filter(todo => !todo.completed);
      await this.ctx.storage.put("todos", activeTodos);
      return activeTodos;
    }
}