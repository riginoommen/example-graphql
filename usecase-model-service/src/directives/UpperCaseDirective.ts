import { SchemaDirectiveVisitor } from 'apollo-server-express';
import { defaultFieldResolver } from 'graphql';

export class UpperCaseDirective extends SchemaDirectiveVisitor {
    visitFieldDefinition(field: any) {
      const { resolve = defaultFieldResolver } = field;
      field.resolve = async function (...args: any) {
        const result = await resolve.apply(this, args);
        if (typeof result === 'string') {
          return result.toUpperCase();
        }
        return result;
      };
    }
  }