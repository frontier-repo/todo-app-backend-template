export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
};

// インメモリストレージ
export const todos: Todo[] = [];
export let nextId = 1;
export const incrementId = () => nextId++;
