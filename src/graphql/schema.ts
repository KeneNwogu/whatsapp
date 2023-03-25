import { buildSchema } from "graphql";

export const schema = buildSchema(`
type User {
    username: String!
    supabaseId: String!
    lastActive: Date!
}

type Mutation {
    updateUserLastActiveStatus: User!
}

`)