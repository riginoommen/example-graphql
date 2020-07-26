import { SchemaDirectiveVisitor } from 'apollo-server-express';
const fetch = require( 'node-fetch' );

export class RestDirective extends SchemaDirectiveVisitor {
    public visitFieldDefinition(field: any) {
      const { url } = this.args;
      field.resolve = () => fetch(url).then((res:any) => res.json());
    }
  }
  