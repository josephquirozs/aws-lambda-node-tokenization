interface TokenDto {
    token: string;
    cardNumber: string;
    expirationMonth: number;
    expirationYear: number;
    email: string;
    createdAt: string;
    expiredAt: string;
}

export default TokenDto;