# Terminology Validation

This section provides information about external terminology validation using remote terminology services.

## Introduction

EHRbase offers the validation of external terminologies in addition to `local` and `openehr` ones.

This feature is based on constraints defined in the openEHR Templates and allows to validate every single coded elements in a composition.

The following example demonstrates how to define the constraint in order to validate a coded element based on the standard value set `http://hl7.org/fhir/ValueSet/surface` defined in HL7 FHIR.

```
<attributes xsi:type="C_SINGLE_ATTRIBUTE">
    <rm_attribute_name>defining_code</rm_attribute_name>
    <existence>
        <lower_included>true</lower_included>
        <upper_included>true</upper_included>
        <lower_unbounded>false</lower_unbounded>
        <upper_unbounded>false</upper_unbounded>
        <lower>1</lower>
        <upper>1</upper>
    </existence>
    <children xsi:type="C_CODE_REFERENCE">
        <rm_type_name>CODE_PHRASE</rm_type_name>
        <occurrences>
            <lower_included>true</lower_included>
            <upper_included>true</upper_included>
            <lower_unbounded>false</lower_unbounded>
            <upper_unbounded>false</upper_unbounded>
            <lower>1</lower>
            <upper>1</upper>
        </occurrences>
        <node_id/>
        <referenceSetUri>terminology://fhir.hl7.org/ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/surface</referenceSetUri>
    </children>
</attributes>
```

According to the constraint defined above, a valid composition should look like (using a valid code coming from http://hl7.org/fhir/ValueSet/surface):

```
"value": {
    "_type": "DV_CODED_TEXT",
    "value": "Buccal",
    "defining_code": {
        "_type": "CODE_PHRASE",
        "terminology_id": {
            "_type": "TERMINOLOGY_ID",
            "value": "http://hl7.org/fhir/ValueSet/surface"
        },
        "code_string": "B"
    }
}
```

Otherwise the submitted composition will be rejected by EHRbase indicating the error.

:::info
The current implementation only supports FHIR Terminology Server (R4).
:::

## Configuration

The following subsections provide information on the configuration of the external terminology validation in EHRbase.

### Configuring EHRbase

EHRbase supports the following properties in order to properly configure the feature:

| Key                                             | Default Value | Description                                                      |
| ------------------------------------------------|---------------|------------------------------------------------------------------|
| `validation.external-terminology.enabled`       | `false`       | Whether to enable external terminology validation feature.       |
| `validation.external-terminology.fail-on-error` | `false`       | Indicates if validation should pass in case of connection error. |
| `validation.external-terminology.provider.*`    |               | External terminology provider details.                           |

The following `application.yml` illustrates how to configure the provider details:

```yaml
# External Terminology Validation Properties
validation:
  external-terminology:
    enabled: true
    fail-on-error: true
    provider:
     fhir-server-1:
       type: fhir
       url: https://r4.ontoserver.csiro.au/fhir
#     fhir-server-2:
#       type: fhir
#       url: https://localhost:9876/fhir
```

* It is possible to register one or several providers.
* As mention above, `fhir` is the only type currently supported.
* The `url` property is the base URL of the terminology server.

### Using provider with Two-Way SSL

If the remote terminology server requires to establish a communication channel using Two-Way SSL (Mutual Authentication), EHRBase can setup the SSL context used by HTTP client with the following configuration properties:

| Key                               | Default Value | Description                                           |
| ----------------------------------|---------------|-------------------------------------------------------|
| `client.ssl.enabled`              | `false`       | Whether to enable SSL support.                        |
| `client.ssl.key-password`         |               | Password used to access the key in the key store.     |
| `client.ssl.key-store`            |               | Path to the key store.                                |
| `client.ssl.key-store-password`   |               | Password used to access the key store.                |
|

 `client.ssl.key-store-type`       |               | Type of the key store.                                |
| `client.ssl.trust-store`          |               | Path to the trust store.                              |
| `client.ssl.trust-store-password` |               | Password used to access the trust store.              |
| `client.ssl.trust-store-type`     |               | Type of the trust store.                              |

The following `application.yml` illustrates how to configure the SSL context:

```
# SSL Properties (used by Spring WebClient and Apache HTTP Client)
client:
  ssl:
    enabled: true
    key-password: MySecretPassword
    key-store: C:/ehrbase/config/keystore.p12
    key-store-password: Azerty123456
    key-store-type: pkcs12
    trust-store: C:/ehrbase/config/truststore.p12
    trust-store-password: Qwerty123456
    trust-store-type: pkcs12
```

### Using OAuth2


Configure Authentication Provider for the FHIR terminology server:
```
spring:
  security:
    oauth2:
      client:
        registration:
          fhir-terminology-client:
            client-id: EHRBase-Test
            client-secret: b2F1dGgyLXByb3h5LWNsaWVudC1zZWNyZXQK
            authorization-grant-type: client_credentials
            scope: openid
            # used identity provider must match spring.security.oauth2.provider.[provider_name]
            provider: 'fhir-terminology-provider'
        provider:
          fhir-terminology-provider:
            token-uri: http://identity.localtest.me/auth/realms/test-issuer/protocol/openid-connect/token
 
# Configure FHIR Terminology Validation Server
validation:
  external-terminology:
    enabled: true
    provider:
      fhir-terminology-server:
        # If set it must match a spring.security.oauth2.client.registration.[client_name] that needs to be configured
        oauth2-client: 'fhir-terminology-client'
        type: FHIR
        url: http://fhir.localtest.me/fhir/
````

Same configuration as environment variables:
```
SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_FHIRTERMINOLOGYCLIENT_CLIENTID=EHRBase-Test
SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_FHIRTERMINOLOGYCLIENT_CLIENTSECRET=b2F1dGgyLXByb3h5LWNsaWVudC1zZWNyZXQK
SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_FHIRTERMINOLOGYCLIENT_AUTHORIZATIONGRANTTYPE=client_credentials
SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_FHIRTERMINOLOGYCLIENT_SCOPE=openid
# used identity provider must match spring.security.oauth2.provider.[provider_name]
SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_FHIRTERMINOLOGYCLIENT_PROVIDER=fhir-terminology-provider
SPRING_SECURITY_OAUTH2_CLIENT_PROVIDER_FHIRTERMINOLOGYPROVIDER_TOKENURI=http://identity.localtest.me/auth/realms/test-issuer/protocol/openid-connect/token
 
# Configure FHIR Terminology Validation Server
VALIDATION_EXTERNALTERMINOLOGY_ENABLED=true
# If set it must match a spring.security.oauth2.client.registration.[client_name] that needs to be configured
VALIDATION_EXTERNALTERMINOLOGY_PROVIDER_FHIRTERMINOLOGYSERVER_OAUTH2CLIENT=fhir-terminology-client
VALIDATION_EXTERNALTERMINOLOGY_PROVIDER_FHIRTERMINOLOGYSERVER_TYPE=FHIR
VALIDATION_EXTERNALTERMINOLOGY_PROVIDER_FHIRTERMINOLOGYSERVER_URL=http://fhir.localtest.me/fhir/
```

:::info
Currently EHRbase supports only one authentication method to be configured that will be applied to all FHIR Terminology Servers.
:::