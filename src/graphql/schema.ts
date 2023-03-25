import { buildSchema } from "graphql";
import { DateScalar } from "./scalars";

export const schema = buildSchema(`
scalar Date

type Query {
    message: String
}

type User {
    username: String!
    supabaseId: String!
    lastActive: Date!
    profilePicture: String!
}

type Mutation {
    updateUserLastActiveStatus: User!
    searchUsers(searchTerm: String!): [User]!
}
`)