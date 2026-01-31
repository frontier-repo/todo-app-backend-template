import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { queryResolvers } from "./resolvers/query";
import { mutationResolvers } from "./resolvers/mutation";

// ES Modules で __dirname を取得するためのおまじない
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// GraphQL スキーマファイルを読み込む関数
const loadSchema = (): string => {
	const schemaDir = join(__dirname, "schema");
	const types = readFileSync(join(schemaDir, "types.graphql"), "utf-8");
	const query = readFileSync(join(schemaDir, "query.graphql"), "utf-8");
	const mutation = readFileSync(join(schemaDir, "mutation.graphql"), "utf-8");
	return [types, query, mutation].join("\n");
};

// リゾルバーをまとめる
const resolvers = {
	Query: queryResolvers,
	Mutation: mutationResolvers,
};

// Apollo Server を作成
const server = new ApolloServer({
	typeDefs: loadSchema(),
	resolvers,
});

// サーバーを起動
const { url } = await startStandaloneServer(server, {
	listen: { port: 4000 },
});

console.log(`🚀 Server ready at ${url}`);
