---
layout: default
title: Development
permalink: /architecture/development
parent: Architecture
---

# Development

## Introduction

This document describes the application point of view of the Social Feeds application.

### Reference Documentation

* [WCAG 2.0](https://www.w3.org/TR/WCAG20/)
* [Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc7807)

## Constraints

### Libraries and Frameworks

* All backend services will be implemented as AWS Serverless Lambdas using Typescript
* All user interface experiences will be implemented using NextJS and TailwindCSS
* Additional dependencies may be added for things such as state management, but should be used consistently through the application.

### Tooling

* Git will be used for version control
* Github will be used to host the application code and this documentation
* Projen will be used to manage the project structure and common configuration files
* CDK will be used for IaC

### CI/CD

* During early development, this project will not utilize CI/CD
* As the product matures, CI _may_ be implemented via github actions to push a CDK pattern representing the entire application to NPM
* CD will be implemented external to this repository when the application is productionized

### Code Quality

* All typescript must be linted in compliance with the default configuration defined by projen
* All code changes must pass all SonarCloud quality gates

### Quality Assurance

* Unit testing is not a priority of this project, as it is primarily a simple CRUD application. Particularly interesting business logic _should_ have unit test coverage, which must be implemented using jest
* End-to-end testing will be performed semi-manually via Selenium suites

## Non-functional Requirements

### Accessibility

Application should strive to confirm to WCAG 2.0 Level AA with the following exceptions:

* If a CAPTCHA is implemented, accessibility concerns will be delegated to the CAPTCHA provider
* If social media feed sample functionality is implemented, accessibility of the embedded content is delegated to the social media provider

### Ergonomics

#### Fonts

* Fonts must be self-hosted to protect user privacy
* A single font should be used for all components in the application
* Font should be subset to include include characters required for the application

#### Responsivity

The application UI must be fully responsive.

#### PWA

The application will not be packaged as a PWA and cannot be operated offline.

#### Browser Support

The application must support Chrome 58+, Edge 16+, Safari 10.1+, and Firefox 54+ (All of which support CSS Grid and Flexbox). Vendor-specific features should be avoided when possible.

#### Internationalization

The application will not support locales other than en-US.

#### Offline Mode

The application will not be required to work offline.

### SEO

If applicable, static marketing pages must follow SEO best practices. Administrative pages are not required to follow any SEO standards outside of those related to UX.

### Ecodesign

Application should use a web host with sustainability commitments if possible (AWS does post such commitments). The average power consumption caused by the display of a Web page must not exceed 10mWH, i.e. for 10K users who display on average 100 pages 200 J per year: 50 g/KWH x 10mWH x 100 x 10K x 200 = 100 Kg CO2 equivalent / year.

## Target Architecture

### Software Stack

#### Frontend

* NextJS - Rendering and componentization
* TailwindCSS - Styling, bikeshedding prevention

#### Backend

* Typescript AWS Lambda SDK
* Lambda Layers for shared dependencies
* Amazon API Gateway

### Performance

#### Frontend

* Run lighthouse locally before committing changes
* Avoid synchronous fetch calls
* Build timeouts and retries into all fetch calls

#### Backend

* Avoid synchronous blocking IO
* Build timeouts and retries into all IO

### Software Factory Specifics

* Early phase development will not produce any specific artifacts
* Releases will be primarily manual
* Later phases will automate deployment to a staging environment via CDK self-mutating pipelines

### Development Standards

* All code must be linted via eslint using projen's default profile
* All code changes must pass all SonarCloud quality gates

### Notable Patterns

N/A

### Test Specificities

N/A

### Ecodesign

* Client side profiling should be done to minimize resource usage in the SPA
* All image assets should be stored in multiple sizes, minimum required size should be served
* All image assets should be lazy loaded to prevent unneccessary fetching
* Lambda layers should be utilized to reduce lambda bundle size
* Dark mode should be available to save power on OLED screens

### Robustness

#### Transaction Management

* If multiple tables or items are impacted within the scope of a single API request, they should be done using DynamoDB's TransactWriteItems and TransactGetItems APIs.

#### Session Management

* State will be maintained client-side, backend is stateless

#### Error Handling

* All functions must be idempotent
* Lambda functions should internally represent errors as Typescript extensions of the built-in `Error` type
* Lambda functions should return errors as RFC7807 Problem Details for HTTP APIs, maintained in a common lambda layer
* Problems must be logged from this common lambda layer in the following format
    ```json5
    {
        "correlationId": "<trace id>",
        "organizationId": "<org id>",
        "subjectId": "<user sub attribute>",
        "message": "<error message>",
        "stack": "<error stack>",
        "problem": {
            // problem json
        }
    }
    ```
* All publicly exposed error types should be documented in the OAS specification
* Errors will be logged with full stack traces, but clients will only receive the problem json for security

#### Frontend Robustness

* Form submissions must be debounced or disabled after submission to prevent double submission

#### Configuration Management

* Application configuration will be managed as part of the CDK deployment
* Backend envars will be injected via lambda environment variables
* Frontend envars will be generated during the CDK deploy and pushed to the well-known path `/env.json`

#### Branch Management

* Project will follow trunk-based development
* The trunk branch is `main`
* All changes will be completed on branches with the prefix `feature/` and merged via pull request

#### Versioning

* Project will follow semantic versioning as managed by projen

#### Concurrency

* Concurrency should be handled by async await whenever possible

#### Encoding

* The only encoding allowed in all modules of this project is UTF-8

#### Timezones

* All time data will be persisted in UTF-8. Data may be shifted into the user timezone client-side for display purposes

#### Log Management

##### General Rules

* All log events should be formatted as JSON lines
* Problems should be log as specified in the error handling section of this document
* Timed events, such as cron tasks or secret rotations, should be logged at INFO level
* All logs triggered by synchronous requests must include that request's correlation id

#### Administrative Tools

* Tooling must be provided for admins to manage organizations and user accounts
* Admins must be able to "impersonate" standard users, maintaining the admin's unique user id but assuming the user's security policies

#### Sorting and Pagination

* All list queries must specify a sort order and support pagination

#### Provisioning and DDL Updates

* All databases will be provisioned as part of the IaC deployment via CDK
* As this application only uses NoSQL data stores, there is no need for any DDL updates