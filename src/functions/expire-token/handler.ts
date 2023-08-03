import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';
import createDbClient from 'src/shared/create-db-client';
import { validateAuthorizationToken } from '@libs/validate-authorization-token';
import TokenExpirationDto from 'src/models/token-expiration-dto';

const dbClient = createDbClient();

const expireToken: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const isAuthorized = validateAuthorizationToken(event.headers.Authorization);

  if (!isAuthorized) {
    return {
      statusCode: 401,
      body: 'Authorization token is invalid'
    };
  }

  const { token }: TokenExpirationDto = event.body;

  await dbClient.update({
    TableName: 'CardTable',
    Key: { id: token },
    UpdateExpression: 'SET expiredAt = :expiredAt',
    ExpressionAttributeValues: {
      ':expiredAt': new Date().toISOString()
    }
  }).promise();

  return {
    statusCode: 200,
    body: ''
  };
};

export const main = middyfy(expireToken);
