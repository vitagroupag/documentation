# Status and metrics

:::warning
The status and metrics endpoints can contain critical and sensitive information on the running ehrbase instance that could serve possible attackers to identify vulnerabilities. 
Please ensure to use a solid security config on the EHRbase server or disable the metrics and status endpoints in production environments with sensitive data.
:::

The Status and Metric endpoints are provided by Spring-Boot-Actuator to expose additional information on the running EHRbase server including metrics on the usage of the API since last boot.

The Status and Metric endpoints provide additional information which is useful in environments that use a bunch of microservices that rely on each other as in cloud orchestration like Kubernets. The status endpoint can support the management of these complex systems by providing liveness and readiness endpoints which allow orchestration tools to check whether the EHBase service is running and if it capable of serving incoming requests.

Additional metrics allow to identify bottlenecks in connections between services as between EHRbase service and a connected database server if the connection metric shows very long durations for communications or if the connection pool limit is exhausted. Another possible use case could be detection of attacks against the EHRbase service due to a high occurrence of authorization client errors. As you see there are many things you can do with these endpoints.

The Status and Metrics API interface is available at the `/management` resource which will be appended to the base URL of the ehrbase instance. E.g. if EHRbase is running at `https://api.ehrbase.org` the status API and all sub endpoints are available at `https://api.ehrbase.org/ehrbase/management`.

## Security

Since the Status and Metric endpoints provide such valuable information they are secured by EHRbase integrated security solutions. If you are using at least the Basic Auth method to secure incoming requests the endpoints are only available for users with the Admin-Role.

If you want to access specific metric and health endpoint from a statistics and management service ensure not sending the passwords in clear text. For Basic Auth encode them into a Base64 string as described here: EHRbase Security docs.

:::warning
All auth methods can be attacked easily if you do not use HTTPS encrypted communication outside trusted networks as internal VPN or secured cloud system networks. Ensure to secure your environment properly.

Access to the endpoints can further be configured for specific use cases:
* Admin Only - only authenticated users with the admin role are allowed access
* Private - any authenticated user is allowed access
* Public - any user, authenticated or not is allowed access

The above access can be configured for both Basic and Oauth2 security types, only when XACML is not enabled. More details on the [Security page](04-Security.md#management).
:::

## Configuration

By default, all status and metric endpoints are disabled in EHRbase. To opt-in endpoints you should start the EHRbase with an environment variable per endpoint you want to enable.

| ENV                                      | Usage                                                 | Value to set   |
|------------------------------------------|-------------------------------------------------------|----------------|
| `MANAGEMENT_ENDPOINT_ENV_ENABLED`        | Enable /management/env endpoint from actuator.        | `true`/`false` |
| `MANAGEMENT_ENDPOINT_HEALTH_ENABLED`     | Enable /management/health endpoint from actuator.     | `true`/`false` |
| `MANAGEMENT_HEALTH_DB_ENABLED`           | Enables the DB health indicator.                      | `true`/`false` |
| `MANAGEMENT_ENDPOINT_INFO_ENABLED`       | Enable /management/info endpoint from actuator.       | `true`/`false` |
| `MANAGEMENT_ENDPOINT_METRICS_ENABLED`    | Enable /management/metrics endpoint from actuator.    | `true`/`false` |
| `MANAGEMENT_ENDPOINT_PROMETHEUS_ENABLED` | Enable /management/prometheus endpoint from actuator. | `true`/`false` |


Additionally, you can configure the following actuator settings if required:

| ENV                                        | Usage                                                                                                                                   | Value to set                                                  |
|--------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------|
| `MANAGEMENT_ENDPOINT_HEALTH_PROBES_ENABLE` | Enable Kubernetes probe endpoints /management/health/liveness and /management/health/readiness explicit in non Kubernetes environments. | `true`/`false`                                                |
| `MANAGEMENT_ENDPOINTS_WEB_EXPOSUSE`        | Expose enabled endpoint to clients. Only set if required.                                                                               | `"env", "health", "info", "metrics", "prometheus", "loggers"` |
| `MANAGEMENT_ENDPOINTS_WEB_BASEPATH`        | Change base path for all endpoints.                                                                                                     | `/management`                                                 |
| `MANAGEMENT_SERVER_PORT`                   | Configure the port on which the endpoints are exposed. This can be useful for running the management endpoints on an internal port.     | `8080`                                                        |
 
Everything above is from the default [Spring Actuator Configuration](https://docs.spring.io/spring-boot/reference/actuator/).
Specific to EHRbase there is the security configuration for management endpoints. See [Security](04-Security.md#management) for more.