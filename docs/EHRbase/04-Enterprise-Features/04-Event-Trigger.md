---
title: Event Trigger
description: The Event Trigger feature allows to define criteria using the Archetype Query Language to extract and forward information to internal and external services whenever storing openEHR compositions. Protocols supported are HTTP and AMQP (RabbitMQ and Kafka).
---

# Event Trigger

For the implementation of diverse processes, HIP CDR has the possibility to create event triggers. For this purpose, criteria can be flexibly defined and linked to actions. For example, when new data is transferred to the platform, the system can automatically check which type of examination is involved and whether a threshold value has been exceeded. This function can be used to support the extraction of data for secondary use or to asynchronously inform systems about the creation of specific data points, for example, an order. For this purpose, the patient ID and selected values can be sent to a receiving system. It is also possible to create a rule to forward all incoming data to an external data warehouse. By supporting HTTP requests and Kafka messages, different systems can be connected via event triggers.

The event-trigger feature allows hooking into composition creation/update. The hook is defined by an event trigger which can run before or after the internal database transaction has completed.

Several mechanisms are supported to propagate an event-trigger message:

- HTTP
- AMQP via RabbitMQ
- Kafka
- Java Logging

:::note
In combination with [multi-tenancy](06-Multi-Tenancy.md), the event triggers are tenant bound.
:::

## Configuration

| Property                          | ENV                              | Use                                                                                                                                                                | Example          |
| --------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------- |
| `event-trigger.enabled`           | `EVENT_TRIGGER_ENABLED`          | Enables the event trigger feature                                                                                                                                  | `true`           |
| `event-trigger.amqp.activate`     | `EVENT_TRIGGER_AMQP_ACTIVATE`    | Enables AMQP(RabbitMQ)  support for event trigger feature                                                                                                          | `true`           |
| `event-trigger.amqp.host`         | `EVENT_TRIGGER_AMQP_HOST`        | AMQP(RabbitMQ) host address                                                                                                                                        | `127.0.0.01`     |
| `event-trigger.amqp.port`         | `EVENT_TRIGGER_AMQP_PORT`        | AMQP(RabbitMQ) host port                                                                                                                                           | `5672`           |
| `event-trigger.amqp.username`     | `EVENT_TRIGGER_AMQP_USERNAME`    | AMQP(RabbitMQ) Username                                                                                                                                            | `guest`          |
| `event-trigger.amqp.password`     | `EVENT_TRIGGER_AMQP_PASSWORD`    | AMQP(RabbitMQ) Password                                                                                                                                            | `guest`          |
| `event-trigger.amqp.virtual-host` | `EVENT_TRIGGER_AMQP_VIRTUALHOST` | AMQP(RabbitMQ) Virtual Host to use                                                                                                                                 | `/`              |
| `eventTrigger.kafka.activate`     | `EVENT_TRIGGER_KAFKA_ACTIVATE`   | Activate Support for Kafka                                                                                                                                         | `true`           |
| `spring.kafka.bootstrap-servers`  | `SPRING_KAFKA_BOOTSTRAPSERVERS`  | Define Kafka Bootstrap Server                                                                                                                                      | `localhost:9092` |
| `eventTrigger.workers`            | `EVENTTRIGGER_WORKERS`           | The number of executor pool workers to use when create / update events happen. Increasing the workers number means multiple triggers can be evaluated in parallel. | `8`              |

## REST API

For managing event triggers through the REST API checkout the [Event Trigger API Definition](/api/hip-ehrbase/enterprise#tag/Event-Trigger)

## Example

The following example shows a event trigger which is intended to fire on composition:

```
{
  "id": "test_composition_trigger",
  "language": {
    "original_language": "ISO_639-1::en"
  },
  "state": "active",
  "author": {
    "date": "2024-01-01T00:00:00.000+00:00",
    "name": "ME",
    "email": "info@vitagroup.ag",
    "organisation": "VitaGroup AG"
  },
  "definition": {
    "mode": "AFTER",
    "data_type": "COMPOSITION",
    "event_type": ["CREATE", "UPDATE", "DELETE"],
    "rules": [
      {
        "high diastolic": {
          "when": {
            "aql": "select c/uid/value as diastolic from EHR e contains COMPOSITION c"
          },
          "then": [
            {
              "notify": {
                "command": "publish",
                "channel": "amqp",
                "exchange": "ex",
                "routing-key": "ex"
              }
            },
            {
              "log": {
                "command": "notify",
                "channel": "logger"
              }
            }
          ]
        }
      }
    ],
    "pre_condition": []
  }
}
```

The next example shows a trigger for ehr-status:

```
{
  "id": "test_ehr_status_trigger",
  "language": {
    "original_language": "ISO_639-1::en"
  },
  "state": "active",
  "author": {
    "date": "2024-01-01T00:00:00.000+00:00",
    "name": "ME",
    "email": "info@vitagroup.ag",
    "organisation": "VitaGroup AG"
  },
  "definition": {
    "mode": "AFTER",
    "data_type": "EHR_STATUS",
    "event_type": ["CREATE", "UPDATE", "HARD_DELETE"],
    "rules": [
      {
        "high diastolic": {
          "when": {
            "aql": "select e/ehr_id/value from EHR e"
          },
          "then": [
            {
              "notify": {
                "command": "publish",
                "channel": "amqp",
                "exchange": "ex",
                "routing-key": "ex"
              }
            },
            {
              "log": {
                "command": "notify",
                "channel": "logger"
              }
            }
          ]
        }
      }
    ],
    "pre_condition": []
  }
}
```


