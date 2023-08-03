import { APIGatewayProxyEvent } from 'aws-lambda';
import { middyfy } from '@libs/lambda';
import createDbClient from 'src/shared/create-db-client';
import Card from 'src/models/card';
import TokenDto from 'src/models/token-dto';
import { validateAuthorizationToken } from '@libs/validate-authorization-token';

const dbClient = createDbClient();

const retrieveToken = async (event: APIGatewayProxyEvent) => {
  const isAuthorized = validateAuthorizationToken(event.headers.Authorization);

  if (!isAuthorized) {
    return {
      statusCode: 401,
      body: 'Authorization token is invalid'
    };
  }

  const { token } = event.pathParameters;

  const result = await dbClient.get({
    TableName: 'CardTable',
    Key: { id: token }
  }).promise();

  const foundCard = result.Item as Card;
  const currentDate = new Date();
  const expiredDate = new Date(foundCard.expiredAt);

  if (currentDate > expiredDate) {
    return {
      statusCode: 400,
      body: 'Token is expired'
    };
  }

  const foundToken: TokenDto = {
    token: foundCard.id,
    cardNumber: foundCard.cardNumber,
    expirationMonth: foundCard.expirationMonth,
    expirationYear: foundCard.expirationYear,
    email: foundCard.email,
    createdAt: foundCard.createdAt,
    expiredAt: foundCard.expiredAt
  }

  return {
    statusCode: 200,
    body: JSON.stringify(foundToken)
  };
};

export const main = middyfy(retrieveToken);
