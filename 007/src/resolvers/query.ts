import { todos, Todo } from "../data";

export const queryResolvers = {
  // 全ての ToDo を取得
  todos: (): Todo[] => {
    return todos;
  },

  // 特定の ToDo を取得
  todo: (args: { id: string }): Todo | undefined => {
    return todos.find((todo) => todo.id === args.id);
  },
};
