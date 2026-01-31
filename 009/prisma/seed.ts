import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	// 既存データを削除
	await prisma.todo.deleteMany();

	// Seedデータを投入
	await prisma.todo.createMany({
		data: [
			{ title: "Dockerを学ぶ", completed: true },
			{ title: "SQLを練習する", completed: true },
			{ title: "Prismaを使いこなす", completed: false },
			{ title: "FE-BE-DB連携を実装する", completed: false },
			{ title: "アプリをデプロイする", completed: false },
		],
	});

	const todos = await prisma.todo.findMany();
	console.log("Seed data has been inserted:");
	console.log(todos);
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
