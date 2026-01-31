import { prisma } from "../lib/prisma";

export const queryResolvers = {
	// 全ての ToDo を取得
	todos: async () => {
		return await prisma.todo.findMany({
			orderBy: { createdAt: "desc" },
		});
	},

	// 指定した ID の ToDo を取得
	todo: async (_parent: unknown, args: { id: string }) => {
		return await prisma.todo.findUnique({
			where: { id: parseInt(args.id) },
		});
	},
};
