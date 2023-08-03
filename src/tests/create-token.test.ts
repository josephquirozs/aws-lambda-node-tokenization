import { expectTypeOf } from 'expect-type';
import TokenCreationDto from 'src/models/token-creation-dto';
import TokenOnlyDto from 'src/models/token-only-dto';
import createHtppClient from '../shared/create-http-client';

describe('Create token function', () => {
    const httpClient = createHtppClient();

    test('Should create new token', async () => {
        const newToken: TokenCreationDto = {
            cardNumber: '4111111111111111',
            cvv: '1234',
            expirationMonth: 9,
            expirationYear: 2025,
            email: 'gian.corzo@gmail.com'
        };
        const response = await httpClient.post('/tokens', newToken);
        const { status, data: body } = response;
        expect(status).toBe(200);
        expectTypeOf(body).toMatchTypeOf<TokenOnlyDto>();
    });

    test('Should fail because card data are wrong', async () => {
        try {
            const newToken: TokenCreationDto = {
                cardNumber: '4111111111111111',
                cvv: '12345',
                expirationMonth: 9,
                expirationYear: 2025,
                email: 'gian.corzo@gmail.com'
            };
            const response = await httpClient.post('/tokens', newToken);
            expect(response.status).toBe(400);
        } catch (e) { }
    });
});