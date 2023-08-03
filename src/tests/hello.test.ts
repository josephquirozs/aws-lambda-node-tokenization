import createHtppClient from '../shared/create-http-client';

describe('Hello function', () => {
    const httpClient = createHtppClient();

    test('Should say hello', async () => {
        const response = await httpClient.post('/hello', {
            name: 'Joe'
        });
        expect(response.status).toBe(200);
        expect(response.data.message).toMatch(/Hello Joe/);
    });
});