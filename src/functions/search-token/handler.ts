import { middyfy } from '@libs/lambda';
import createDbClient from 'src/shared/create-db-client';
import Card from 'src/models/card';
import TokenDto from 'src/models/token-dto';

const dbClient = createDbClient();

const searchToken = async () => {
  const result = await dbClient.scan({
    TableName: 'CardTable'
  }).promise();

  const tokens = result.Items.map(item => {
    const card = item as Card;
    const token: TokenDto = {
      token: card.id,
      cardNumber: card.cardNumber,
      expirationMonth: card.expirationMonth,
      expirationYear: card.expirationYear,
      email: card.email,
      createdAt: card.createdAt,
      expiredAt: card.expiredAt,
    };
    return token;
  });

  return {
    statusCode: 200,
    body: JSON.stringify(tokens)
  };
};

export const main = middyfy(searchToken);
