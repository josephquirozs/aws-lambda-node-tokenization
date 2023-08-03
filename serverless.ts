import type { AWS } from '@serverless/typescript';
import hello from '@functions/hello';
import createToken from '@functions/create-token';
import retrieveToken from '@functions/retrieve-token';
import searchToken from '@functions/search-token';
import expireToken from '@functions/expire-token';

const serverlessConfiguration: AWS = {
  service: 'aws-lambda-node-tokenization',
  frameworkVersion: '3',
  plugins: [
    'serverless-esbuild',
    'serverless-dynamodb',
    'serverless-offline'
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    region: 'us-west-2',
    iamRoleStatements: [
      {
        'Effect': 'Allow',
        'Action': ['dynamodb:*'],
        'Resource': 'arn:aws:dynamodb:us-west-2:423414906545:table/*'
      }
    ]
  },
  // import the function via paths
  functions: {
    hello,
    createToken,
    retrieveToken,
    searchToken,
    expireToken
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    dynamodb: {
      stages: ['dev'],
      start: {
        docker: true,
        port: 8000,
        inMemory: true,
        migrate: true,
        noStart: true
      }
    }
  },
  resources: {
    Resources: {
      CardTable: {
        Type: 'AWS::DynamoDB::Table',
        DeletionPolicy: "Delete",
        Properties: {
          TableName: 'CardTable',
          BillingMode: 'PAY_PER_REQUEST',
          AttributeDefinitions: [
            { AttributeName: 'id', AttributeType: 'S' },
          ],
          KeySchema: [
            { AttributeName: 'id', KeyType: 'HASH' },
          ],
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
