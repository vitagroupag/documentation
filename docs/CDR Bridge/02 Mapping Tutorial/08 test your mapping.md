# Test your custom mapping

In order to test your work, you will need a running instance of CDR Bridge with all its components correctly configured. How to get that is beyond the scope of this guide. This page gives an overview of the project and its components, and provides links to some shared environments you might be able to use for that purpose.

Making your specification available to the CDR Bridge involves the following steps:

1. Obtain an OAuth token as a "Domain Expert". Your environment should include a Keycloak instance that is used as authentication and authorization server by all services in the environment. You need to authenticate against this server using credentials for a user with "Domain Expert" role (see this page for more information about roles and scopes in the whole HIP CDR)
2. Make sure your template exists in EHRbase. As mentioned above, you can either upload your template directly to EHRbase using their API or use the Mapping Config Service (the service documents its REST API using OpenAPI and provides a Swagger UI under /swagger-ui/index.html)
3. Upload your custom mapping.

If everything went well, your custom mapping should be available to the CDR Bridge and active. You can check this by listing all custom mappings via the Mapping Config Service. You should now be able to test the mapping as follows:

1. Obtain an OAuth token with a role that has sufficient access rights.
2. Submit a test resource/message to the connector in question (e.g. if you developed a mapping for the FHIR protocol, submit a resource to the FHIR connector)
3. Verify the result. If the mapping was successfully applied, the CDR Bridge should have converted your test data to openEHR and the data should be available in EHRbase. If the source protocol you're testing supports reading, you should be able to map the data back via the same connector.
