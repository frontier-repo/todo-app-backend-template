import { prisma } from "../lib/prisma";

// 入力型の定義
type CreateTodoInput = {
	title: string;
};

type UpdateTodoInput = {
	title?: string;
	completed?: boolean;
};

export const mutationResolvers = {
	// 新しい ToDo を作成
	createTodo: async (_parent: unknown, args: { input: CreateTodoInput }) => {
		// バリデーション
		if (!args.input.title || args.input.title.trim() === "") {
			throw new Error("Title is required");
		}

		if (args.input.title.length > 100) {
			throw new Error("Title must be 100 characters or less");
		}

		return await prisma.todo.create({
			data: { title: args.input.title.trim() },
		});
	},

	// ToDo を更新
	updateTodo: async (_parent: unknown, args: { id: string; input: UpdateTodoInput }) => {
		const todo = await prisma.todo.findUnique({
			where: { id: parseInt(args.id) },
		});

		if (!todo) {
			throw new Error(`Todo with id "${args.id}" not found`);
		}

		// バリデーション
		if (args.input.title !== undefined) {
			if (args.input.title.trim() === "") {
				throw new Error("Title cannot be empty");
			}
			if (args.input.title.length > 100) {
				throw new Error("Title must be 100 characters or less");
			}
		}

		return await prisma.todo.update({
			where: { id: parseInt(args.id) },
			data: {
				title: args.input.title?.trim(),
				completed: args.input.completed,
			},
		});
	},

	// ToDo を削除
	deleteTodo: async (_parent: unknown, args: { id: string }) => {
		const todo = await prisma.todo.findUnique({
			where: { id: parseInt(args.id) },
		});

		if (!todo) {
			throw new Error(`Todo with id "${args.id}" not found`);
		}

		return await prisma.todo.delete({
			where: { id: parseInt(args.id) },
		});
	},

	// 完了状態を切り替え
	toggleTodo: async (_parent: unknown, args: { id: string }) => {
		const todo = await prisma.todo.findUnique({
			where: { id: parseInt(args.id) },
		});

		if (!todo) {
			throw new Error(`Todo with id "${args.id}" not found`);
		}

		return await prisma.todo.update({
			where: { id: parseInt(args.id) },
			data: { completed: !todo.completed },
		});
	},
};
