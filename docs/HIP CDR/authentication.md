# Authentication

Patient data is of high confidentiality and requires to be protected through rigid access control. In many scenarios, there is a specific context required for a healthcare professional to access patient data. There is also a tension between timely and complete access to an electronic health record and the need to empower patients by providing ways to express their preferences.

## OAuth2

Any human or technical user of HIP CDR requires to have a role being assigned. This can be achieved through the CDR Suite and directly in **HIP Keycloak**. In combination with Attribute Based Access Control (ABAC), this role will determine which services and resources can be accessed by a user with a defined scope (Create, Read, Update, Delete etc.).

Creation and management of roles is done by Organization Administrators in **HIP CDR Keycloak**. Assignment of roles to users can be done in the CDR Suite. As long as you are using services through the CDR Suite, you will not be concerned about connecting with HIP CDR through OAuth2.

### Connect a client to HIP CDR

If you want to connect to HIP CDR through an external client like an app or postman, you will need to fullfill some preconditions. The following shows the steps to add a new client to HIP CDR:

:::info
You need to have access rights as an organization or tenant admin to create new clients.
:::

1. open Keycloak e.g. "your-keycloak-url/auth/" and adress the administration console. 
2. For the case that you are an organization admin: select a tenant from the dropdown menu on the left side showing the realms.

<details>
<summary>Screenshot</summary>

![Select Realm](img/keycloak_1.png)
</details>

3. Open “Clients” on the left side menu and Click the big blue button “Create client” in the top middle bar and fill out the “General Settings”. Choose OpenID Connect as Client Type. 

<details>
<summary>Screenshot</summary>

![Client Menu 1](img/keycloak_2.png)
</details>

4. With the big blue button “Next” in the bottom lane you proceed to the next step “Capability config” and Turn on “Client authentication”. Configure the authentication flow. Please see details below.  For a backend application turn “Service Accounts Roles” on and keep the other possible authentification flows turned off

<details>
<summary>Screenshot</summary>

![Select Realm](img/keycloak_3.png)
</details>


:::danger

:warning: Direct Access grants = public clients that cannot be given a secret (secret is in the browser here, does not remain secret). A real user with specific roles is needed.

❗️ Using user accounts (Username + Password) for a backend service (e.g. patient portal) is bad practice.
:::

<details>
<summary>Explanation of authentication flow</summary>

* *Standard Flow:* This enables standard OpenID Connect redirect based authentication with authorization code. In terms of OpenID Connect or OAuth2 specifications, this enables support of 'Authorization Code Flow' for this client.
* *Implicit Flow:* This enables support for OpenID Connect redirect based authentication without authorization code. In terms of OpenID Connect or OAuth2 specifications, this enables support of 'Implicit Flow' for this client.
* *OAuth 2.0 Device Authorization Grant:* This enables support for OAuth 2.0 Device Authorization Grant, which means that client is an application on device that has limited input capabilities or lack a suitable browser.
* *OIDC CIBA Grant:* This enables support for OIDC CIBA Grant, which means that the user is authenticated via some external authentication device instead of the user's browser.
* *Direct access grants:* This enables support for Direct Access Grants, which means that client has access to username/password of user and exchange it directly with Keycloak server for access token. In terms of OAuth2 specification, this enables support of 'Resource Owner Password Credentials Grant' for this client.
* *Service accounts roles:* Allows you to authenticate this client to Keycloak and retrieve access token dedicated to this client. In terms of OAuth2 specification, this enables support of 'Client Credentials Grant' for this client.

</details>

5. When choosing the *Standard Flow* set **Redirect URL** to determine the landing page of your client (if applicable).

<details>
<summary>Screenshot</summary>

![Select Realm](img/keycloak_5.png)
</details>

6. After saving with turned on *service accounts roles* you should see a new tab in the top “Service Account Roles”. This option will allow you to define which roles can be requested through a client. The default role needs to stay assigned.

<details>
<summary>Screenshot</summary>

![Select Realm](img/keycloak_4.png)
</details>

7. Under **Client Scope** you can see which scopes apply to your client. Everything that can be seen in the client scope determines what data ends up in the Jason Web Token. The hip-scope is automatically assigned and provides mappings for tenant und organization IDs. Therefore no further changes need to be done.

<details>
<summary>Screenshot</summary>

![Select Realm](img/keycloak_6.png)
</details>

8. Congratulations, you have created your client! 🎉 

### Making a service call

Based on the newly created client, you can start sending requests to HIP CDR. First, your client needs to make a request to Keycloak in order to obtain a *JSON Web Token (JWT)*. Besides the user credentials, it will contain the tenant-ID to ensure that a user's request is only executed against the correct tenant. 

The following example demonstrates a request to obtain the JW Token from HIP Keycloak:

````
curl --location '{$keycloak-url}/auth/realms/{$tenant-name}/protocol/openid-connect/token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--header 'Authorization: Bearer Token' \
--header 'Cookie: KEYCLOAK_LOCALE=de' \
--data-urlencode 'grant_type=password' \
--data-urlencode 'client_id={$client-id}' \
--data-urlencode 'client_secret={$client-secret}' \
--data-urlencode 'username={$username}' \
--data-urlencode 'password={$password}' 
````

An example for the parameters can look like this:
```
$keycloak-url = 'https://hip-keycloak-hip-lab-integration.vitasystems.dev'
$tenant-name = sacred-heart-hospital
$client-id = my-new-app
$username = JohnDoe@vitagroup.ag
$password = mysupersavepassword
```

Once you obtained the JW-Token, you simply add it to the request against the URL of the service.

:::info
For the service calls, there will be no distinct URL for your tenant or organization. The tenant is determined by the tenant-it which is part of the JW-Token.
:::

````
curl --location 'https://hip-cdr-core-ehrbase-enterprise-hip-lab-integration.vitasystems.dev/ehrbase/rest/openehr/v1/definition/template/adl1.4' \
--header 'Accept: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJubUFlZTBXWGxjVTM3c2NkUFVaUXVLa0g1c3JMdEllTlFMcXZyMTZ3YWF3In0.eyJleHAiOjE3MDg1OTgzMzIsImlhdCI6MTcwODU5ODAzMiwianRpIjoiYTIwNjBkMmQtNWU3ZS00Y2FjLTlmZTYtNmNkOGNlYjdkZjlmIiwiaXNzIjoiaHR0cHM6Ly9jZHItaWRwLWl0LWhpcC1sYWItaW50ZWdyYXRpb24udml0YXN5c3RlbXMuZGV2L2F1dGgvcmVhbG1zL2Nkci1pdCIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiI4N2FhZDYxMC00NDk5LTQwYzMtYjg5Yy1iYTk1NDM5Yjk1M2IiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJISVAtQ0RSLUJyaWRnZS1GSElSLUNvbm5lY3RvciIsInNlc3Npb25fc3RhdGUiOiI5NTVlOTRhZC0xNjBkLTQxYWEtOWRiZS02MWQ4NzQ5ODU3YTMiLCJhY3IiOiIxIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImhjcCIsImRlZmF1bHQtcm9sZXMtY2RyLWl0Iiwib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoiZW1haWwgcHJvZmlsZSBoaXAtc2NvcGUtM2Q3OWNjZjYtYjU5ZS00ZjhiLWEiLCJzaWQiOiI5NTVlOTRhZC0xNjBkLTQxYWEtOWRiZS02MWQ4NzQ5ODU3YTMiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwib3JnIjoiNGViNDQyYjctZTE4Ny00OTViLWEyZjMtZDE5YzgyMmNiNjRkIiwibmFtZSI6IkJpcmdlciBIYWFyYnJhbmR0IiwidG50IjoiM2Q3OWNjZjYtYjU5ZS00ZjhiLWE3NzUtNjhmMzc5Zjc0ZjZkIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiY2RyLWl0LWhjcEB2aXRhZ3JvdXAuYWciLCJnaXZlbl9uYW1lIjoiQmlyZ2VyIiwibG9jYWxlIjoiZGUiLCJmYW1pbHlfbmFtZSI6IkhhYXJicmFuZHQiLCJlbWFpbCI6ImNkci1pdC1oY3BAdml0YWdyb3VwLmFnIn0.jYvurd-cwxPeREKCUjc8Fdm80qKsGEueuQLIwKa8kK5TBTZjAwACPN9WYQNYRxDcSKK7bSS5cpl0mqI2Q9SWZBVNnT7pexW3uPrCQGzCGO4EExByKo9lBINVZ3B_R8QIDPgDnLoaFfTKUgVBeWqfyCSWWC6NvmqORjvhV8TmpxEkRXHznGyv-3yibbngnkwyoarSU0oH7Llzi-tvq1Nweoua4NhP_Ww41kKg-DFfIVjm9USnz7lBkGs8EX-NsibG8_6O1Xssz7Mj2zsSCeOTsXAhx_XcxfGOreNrqEE3VjBSIXL0OuD1pJR6nOIqwLGwTjf_GFT0pizSbKpeyc2BjA' \
--header 'Cookie: INGRESSCOOKIE=1708430361.211.4163674.368835|f52d312ec958902028f8b92880cc0251'
````


