import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { uid } from 'rand-token';
import schema from './schema';
import createDbClient from 'src/shared/create-db-client';
import TokenCreationDto from 'src/models/token-creation-dto';
import Card from 'src/models/card';
import TokenOnlyDto from 'src/models/token-only-dto';
import { validateAuthorizationToken } from '@libs/validate-authorization-token';

const dbClient = createDbClient();

const createToken: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const isAuthorized = validateAuthorizationToken(event.headers.Authorization);

  if (!isAuthorized) {
    return {
      statusCode: 401,
      body: 'Authorization token is invalid'
    };
  }

  const {
    cardNumber,
    cvv,
    expirationMonth,
    expirationYear,
    email
  }: TokenCreationDto = event.body;

  const createdAt = new Date();
  const expiredAt = new Date(createdAt.getTime() + 15 * 60 * 1000);

  const newCard: Card = {
    id: uid(16),
    cardNumber: cardNumber,
    cvv: cvv,
    expirationMonth: expirationMonth,
    expirationYear: expirationYear,
    email: email,
    createdAt: createdAt.toISOString(),
    expiredAt: expiredAt.toISOString()
  };

  await dbClient.put({
    TableName: 'CardTable',
    Item: newCard
  }).promise();

  const newTokenOnly: TokenOnlyDto = {
    token: newCard.id
  };

  return {
    statusCode: 200,
    body: JSON.stringify(newTokenOnly)
  };
};

export const main = middyfy(createToken);
