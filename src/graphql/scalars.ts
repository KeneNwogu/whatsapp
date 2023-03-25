import { GraphQLScalarType, GraphQLScalarSerializer, Kind } from "graphql";


export const DateScalar = new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value: string | unknown) {
      // Convert incoming date string to Date object
      const date = value as string
      return new Date(date);
    },
    serialize(value) {
      const date = value as Date
      // Convert outgoing Date object to ISO string
      return date.toISOString();
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        // Convert string literal to Date object
        return new Date(ast.value);
      }
      return null;
    },
  });