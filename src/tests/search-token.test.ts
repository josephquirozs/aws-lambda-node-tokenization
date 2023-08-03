import { expectTypeOf } from 'expect-type';
import TokenCreationDto from 'src/models/token-creation-dto';
import TokenDto from 'src/models/token-dto';
import createHtppClient from '../shared/create-http-client';

describe('Search token function', () => {
    const httpClient = createHtppClient();

    test('Should get all tokens', async () => {
        const newToken: TokenCreationDto = {
            cardNumber: '4111111111111111',
            cvv: '1234',
            expirationMonth: 9,
            expirationYear: 2025,
            email: 'gian.corzo@gmail.com'
        };
        await httpClient.post('/tokens', newToken);
        const response = await httpClient.get('/tokens');
        const { status, data: body } = response;
        expect(status).toBe(200);
        expectTypeOf(body).toMatchTypeOf<TokenDto[]>();
    });
});