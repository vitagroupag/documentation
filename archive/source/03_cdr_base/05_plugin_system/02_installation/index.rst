.. _plugin_system_installation:

************
Installation
************

Typically, EHRbase (and HIP CDR) is provided using Docker containers or by HELM Charts. In both cases,
please ensure that credentials for the artifact repository (vitagroup Harbor) have been provided as
part of the contract agreements.

EHRbase is delivered as a single Docker container including all plugins
(Please note that for the current release of EHRbase running on YugabyteDB, only ATNA Logging
and Event Trigger Plugins are packaged).

To set parameters of EHRbase and the plugins, the default environment
variables can be overwritten. Check next example (which assumes you pulled or created an
image named ehrbase/ehrbase):

.. code-block:: bash

    docker run -e DB_URL=jdbc:postgresql://ehrdb:5432/ehrbase \
           -e DB_USER=foouser \
           -e DB_PASS=foopass \
           -e SERVER_NODENAME=what.ever.org \
           ehrbase/ehrbase

Note that while there are parameters for the plugin system, these are rarely of use for the installation
as these are set as default values of the docker image provided.

+-----------------------------------+----------------------------------+------------------------------------------------------------------------+--------------------+
| Parameter                         | Env Variable                     | Use                                                                    | Example            |
+===================================+==================================+========================================================================+====================+
| plugin-manager.enable             | PLUGIN_MANAGER_ENABLE            | Enable and disable plugins                                             | "true"             |
+-----------------------------------+----------------------------------+------------------------------------------------------------------------+--------------------+
| manager.plugin-dir                | PLUGIN_MANAGER_PLUGIN_DIR        | Directory of the plugins                                               | "/plugin_dir"      |
+-----------------------------------+----------------------------------+------------------------------------------------------------------------+--------------------+
| plugin-manager.plugin-config-dir  | PLUGIN_MANAGER_PLUGIN_CONFIG_DIR | Directory of the plugin configuration file (containing default values) | /plugin_config_dir |
+-----------------------------------+----------------------------------+------------------------------------------------------------------------+--------------------+

Here you can find some example settings for common use cases for the usage of EHRbase Docker containers. You can also use the environent
variables with the normal .jar execution by setting the variables according to your operating system.

Use BASIC auth
--------------

Run the docker image with this setting:

.. code-block:: bash

    docker run --network ehrbase-net --name ehrbase -e SECURITY_AUTHTYPE=BASIC \
    -e SECURITY_AUTHUSER=myuser -e SECURITY_AUTHPASSWORD=ThePasswordForUser \
    -e SECURITY_AUTHADMINUSER=myadmin -e SECURITY_AUTHADMINPASSWORD=SecretAdminPassword \
    -d -p 8080:8080 ehrbase/ehrbase:latest

This will set the used authentication method to BASIC auth and all requests against the EHRbase
must be provided with the Authorization header set to `Basic %username%:%password%` whereas the
username and password must be encoded with base64.

.. note::

  Ensure you use an encrypted connection over https otherwise the username and password can be
  descripted easily

Use OAuth2
----------

Run the docker image with this setting.

.. code-block:: bash

  docker run --network ehrbase-net --name ehrbase -e SECURITY_AUTHTYPE=OAUTH \
  -e SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_ISSUERURI=https://keycloak.example.com/auth/realms/ehrbase \
  -d -p 8080:8080 ehrbase/ehrbase:latest

You have to prepare the authentication server including a valid client at the target server to
get this setup run.


