// フロントエンドの Todo 型と同じ構造にする
export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
};

// インメモリストレージ（サーバー再起動で消える一時的な保存場所）
export const todos: Todo[] = [
  {
    id: "1",
    title: "GraphQLを学ぶ",
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Expressを学ぶ",
    completed: true,
    createdAt: new Date().toISOString(),
  },
];

// ID の採番用変数（既存データが id: "1", "2" なので 3 から開始）
export let nextId = 3;

// ID をインクリメントして返す関数
export const incrementId = () => nextId++;
