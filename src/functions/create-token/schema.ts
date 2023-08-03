export default {
  type: "object",
  properties: {
    cardNumber: { type: 'string', minLength: 13, maxLength: 16, pattern: '\\d+' },
    cvv: { type: 'string', minLength: 3, maxLength: 4, pattern: '\\d+' },
    expirationMonth: { type: 'integer', minimum: 1, maximum: 12 },
    expirationYear: { type: 'integer', minimum: 2023, maximum: 2028 },
    email: { type: 'string', minLength: 5, maxLength: 100, format: 'email' }
  },
  required: [
    'cardNumber',
    'cvv',
    'expirationMonth',
    'expirationYear',
    'email'
  ]
} as const;
