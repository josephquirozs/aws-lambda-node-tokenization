interface TokenCreationDto {
    cardNumber: string;
    cvv: string;
    expirationMonth: number;
    expirationYear: number;
    email: string;
}

export default TokenCreationDto;