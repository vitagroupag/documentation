# Security

This page describes how to set up different security mechanisms in EHRbase and also provides some basic information
on how to configure your external security servers.

## Introduction

The EHRbase Spring-Boot application can be configured to use different security mechanisms. They
are used to allow access to all resources only to authenticated users to protect stored data from
unauthenticated access.

A basic role system also defines permissions on different resources, e.g. the additional admin
endpoints are only accessible by users with the role `admin` configured.

By default EHRbase is started without security enabled (`NONE`) which will be reported by a message during
boot.

To enable authentication start the EHRbase application with environment variable `AUTH_TYPE` set
to the appropriate value or set the necessary data at one of the .yml files inside 
`{projectRoot}/application/src/main/resources/`.

### Supported security mechanisms

* None
* Basic Auth
* Oauth2

## Basic Auth

The basic auth mechanism uses a predefined set of users and roles that will be configured during
start of EHRbase by setting the data inside the environment variables or inside the .yml file as
follows:

| ENV                        | .yml                       | Value to set        | Default                |
| -------------------------- | -------------------------- | ------------------- | ---------------------- |
| SECURITY_AUTHTYPE          | security.authType          | BASIC               | NONE                   |
| SECURITY_AUTHUSER          | security.authUser          | your username       | ehrbase-user           |
| SECURITY_AUTHPASSWORD      | security.authPassword      | Your password       | SuperSecretPassword    |
| SECURITY_AUTHADMINUSER     | security.authAdminUser     | Your admin username | ehrbase-admin          |
| SECURITY_AUTHADMINPASSWORD | security.authAdminPassword | Your admin password | EvenMoreSecretPassword |

To access a resource from a client generate the Base64 encoded string of `{username}:{password}` 
and add it in the Authorization header with `Basic {Base64 encoded string}`.

Additionally, access to the management endpoints can be configured trough the `management.endpoints.web.access` property (supported values: `ADMIN_ONLY`, `PRIVATE`, `PUBLIC`, default: `ADMIN_ONLY`).

## OAuth2

OAuth2 uses an external authentication server realm to authenticate a user and provide additional
information about the role of each user.

To start EHRbase with OAuth2 support and configure the external server use one of the following
configuration methods:

| ENV                                                 | .yml                                                 | Value to set            | Default                                   |
| --------------------------------------------------- | ---------------------------------------------------- | ----------------------- | ----------------------------------------- |
| SECURITY_AUTHTYPE                                   | security.authType                                    | OAUTH                   | NONE                                      |
| SECURITY_OAUTH2USERROLE                             | security.oauth2UserRole                              | Desired user role name  | USER                                      |
| SECURITY_OAUTH2ADMINROLE                            | security.oauth2AdminRole                             | Desired admin role name | ADMIN                                     |
| SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_ISSUERURI | spring.security.oauth2.resourceserver.jwt.issuer-uri | Your realm base url     | http://localhost:8081/auth/realms/ehrbase |

The realm, client and all other settings must be done inside the corresponding authentication
server.
The user and admin role names are configurable, enabling compatibility with authentication servers which are opinionated
on the names of custom OAuth roles or scopes. EHRBase will look for the admin/user role in the `realm_access.roles` and
`scope` claims of the JWT provided on an authenticated request.

The clients must be implemented / configured to use the external authentication server as well.
There are multiple libraries for many frameworks available that can be used for this.
