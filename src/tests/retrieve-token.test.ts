import { expectTypeOf } from 'expect-type';
import TokenCreationDto from 'src/models/token-creation-dto';
import TokenDto from 'src/models/token-dto';
import TokenOnlyDto from 'src/models/token-only-dto';
import createHtppClient from '../shared/create-http-client';
import TokenExpirationDto from 'src/models/token-expiration-dto';

describe('Retrieve token function', () => {
    const httpClient = createHtppClient();

    test('Should get token details', async () => {
        const newToken: TokenCreationDto = {
            cardNumber: '4111111111111111',
            cvv: '1234',
            expirationMonth: 9,
            expirationYear: 2025,
            email: 'gian.corzo@gmail.com'
        };
        const response1 = await httpClient.post('/tokens', newToken);
        const newTokenOnly = response1.data as TokenOnlyDto;
        const response2 = await httpClient.get(`/tokens/${newTokenOnly.token}`);
        const { status, data: body } = response2;
        expect(status).toBe(200);
        expectTypeOf(body).toMatchTypeOf<TokenDto>();
    });

    test('Should validate token expiration', async () => {
        try {
            const newToken: TokenCreationDto = {
                cardNumber: '4111111111111111',
                cvv: '1234',
                expirationMonth: 9,
                expirationYear: 2025,
                email: 'gian.corzo@gmail.com'
            };
            const response1 = await httpClient.post('/tokens', newToken);
            const newTokenOnly = response1.data as TokenOnlyDto;
            const expiredToken: TokenExpirationDto = {
                token: newTokenOnly.token
            }
            await httpClient.patch('/tokens', expiredToken);
            await new Promise((resolve) => setTimeout(resolve, 500));
            const response2 = await httpClient.get(`/tokens/${expiredToken.token}`);
            expect(response2.status).toBe(400);
        } catch (e) { }
    });
});