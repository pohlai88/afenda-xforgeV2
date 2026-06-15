ALTER ROLE authenticator SET pgrst.db_schemas = 'public, next_forge, graphql_public';
NOTIFY pgrst, 'reload config';
