export const validateAuthorizationToken = (authorizationHeader: string): boolean => {
    const [type, token] = authorizationHeader.split(' ');
    if (type !== 'Bearer') {
        return false;
    }
    if (token !== 'pk_test_123') {
        return false;
    }
    return true;
}