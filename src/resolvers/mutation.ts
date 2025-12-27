import { todos, Todo, incrementId } from "../data";

export type CreateTodoInput = {
  title: string;
};

export type UpdateTodoInput = {
  title?: string;
  completed?: boolean;
};

export const mutationResolvers = {
  // 新しい ToDo を作成
  createTodo: (args: { input: CreateTodoInput }): Todo => {
    // バリデーション: タイトルをトリムして空文字チェック
    const title = args.input.title?.trim();
    if (!title) {
      throw new Error("Title cannot be empty");
    }

    const newTodo: Todo = {
      id: String(incrementId()),
      title,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    todos.push(newTodo);
    return newTodo;
  },

  // ToDo を更新
  updateTodo: (args: { id: string; input: UpdateTodoInput }): Todo => {
    const todo = todos.find((t) => t.id === args.id);
    if (!todo) {
      throw new Error(`Todo with id "${args.id}" not found`);
    }

    // バリデーション: タイトルが渡された場合、空文字チェック
    if (args.input.title !== undefined) {
      const title = args.input.title.trim();
      if (!title) {
        throw new Error("Title cannot be empty");
      }
      todo.title = title;
    }
    if (args.input.completed !== undefined) {
      todo.completed = args.input.completed;
    }

    return todo;
  },

  // ToDo を削除
  deleteTodo: (args: { id: string }): Todo => {
    const index = todos.findIndex((t) => t.id === args.id);
    if (index === -1) {
      throw new Error(`Todo with id "${args.id}" not found`);
    }

    const [deleted] = todos.splice(index, 1);
    return deleted;
  },

  // 完了状態を切り替え
  toggleTodo: (args: { id: string }): Todo => {
    const todo = todos.find((t) => t.id === args.id);
    if (!todo) {
      throw new Error(`Todo with id "${args.id}" not found`);
    }

    todo.completed = !todo.completed;
    return todo;
  },
};
