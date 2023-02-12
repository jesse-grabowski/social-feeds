---
layout: default
title: Security
permalink: /architecture/security
parent: Architecture
---

* Cognito User Pool
* API Gateway
* Cognito Authorizer (https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-integrate-with-cognito.html)
* Token Vendor Lambda Layer (https://aws.amazon.com/blogs/apn/isolating-saas-tenants-with-dynamically-generated-iam-policies/)

```typescript
const userPool = new cognito.UserPool(this, 'UserPool');

const auth = new apigateway.CognitoUserPoolsAuthorizer(this, 'booksAuthorizer', {
  cognitoUserPools: [userPool]
});

declare const books: apigateway.Resource;
books.addMethod('GET', new apigateway.HttpIntegration('http://amazon.com'), {
  authorizer: auth,
  authorizationType: apigateway.AuthorizationType.COGNITO,
});
```

Cognito bot prevention via https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-pre-sign-up.html