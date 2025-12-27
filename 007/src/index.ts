import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { buildSchema, graphql } from "graphql";
import { ruruHTML } from "ruru/server";
import { resolvers } from "./resolvers";

// 環境変数を読み込む（ENV_FILE が指定されていればそのファイルを使用）
config({ path: process.env.ENV_FILE || ".env.development" });

// ES Modules で __dirname を取得するためのおまじない
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// GraphQL スキーマファイルを読み込む関数
const loadSchema = (): string => {
	const schemaDir = join(__dirname, "schema");
	try {
		const types = readFileSync(join(schemaDir, "types.graphql"), "utf-8");
		const query = readFileSync(join(schemaDir, "query.graphql"), "utf-8");
		const mutation = readFileSync(join(schemaDir, "mutation.graphql"), "utf-8");
		return [types, query, mutation].join("\n");
	} catch (error) {
		console.error("Failed to load GraphQL schema files:", error);
		process.exit(1);
	}
};

const app = express();
const PORT = Number(process.env.PORT) || 4000;

// ミドルウェア
app.use(cors());
app.use(express.json());

// GraphQL スキーマをビルド
const schema = buildSchema(loadSchema());

// リゾルバーをまとめる
const rootValue = {
	...resolvers.Query,
	...resolvers.Mutation,
};

// GraphQL Playground（ブラウザでAPIを試せるツール）
app.get("/graphql", (_req, res) => {
	res.type("html").send(ruruHTML({ endpoint: "/graphql" }));
});

// GraphQL エンドポイント
app.post("/graphql", async (req, res) => {
	try {
		const { query, variables, operationName } = req.body as {
			query: string;
			variables?: Record<string, unknown>;
			operationName?: string;
		};

		if (!query) {
			res.status(400).json({ errors: [{ message: "Query is required" }] });
			return;
		}

		const result = await graphql({
			schema,
			source: query,
			rootValue,
			variableValues: variables,
			operationName,
		});

		res.json(result);
	} catch (error) {
		console.error("GraphQL error:", error);
		res.status(500).json({
			errors: [{ message: "Internal server error" }],
		});
	}
});

// サーバー起動
app.listen(PORT, () => {
	console.log(`GraphQL server running at http://localhost:${PORT}/graphql`);
	console.log("\nAvailable operations:");
	console.log("  Query:");
	console.log("    - todos: Get all todos");
	console.log("    - todo(id): Get a single todo");
	console.log("  Mutation:");
	console.log("    - createTodo(input): Create a new todo");
	console.log("    - updateTodo(id, input): Update a todo");
	console.log("    - deleteTodo(id): Delete a todo");
	console.log("    - toggleTodo(id): Toggle todo completed status");
});
