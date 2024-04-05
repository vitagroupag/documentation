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

## Parameters / Environment Variables

| Parameter                        | Env Variable                    | Usage                                                                                                                                                              | Example          |
|----------------------------------|---------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------|
| `spring.rabbitmq.host`           | `SPRING_RABBITMQ_HOST`          | RabbitMQ host address                                                                                                                                              | `127.0.0.01`     |
| `spring.rabbitmq.port`           | `SPRING_RABBITMQ_PORT`          | RabbitMQ host port                                                                                                                                                 | `5672`           |
| `spring.rabbitmq.username`       | `SPRING_RABBITMQ_USERNAME`      | RabbitMQ Username                                                                                                                                                  | `guest`          |
| `spring.rabbitmq.password`       | `SPRING_RABBITMQ_PASSWORD`      | RabbitMQ Password                                                                                                                                                  | `guest`          |
| `spring.rabbitmq.virtual-host`   | `SPRING_RABBITMQ_VIRTUALHOST`   | RabbitMQ Virtual Host to use                                                                                                                                       | `/`              |
| `eventTrigger.kafka.activate`    | `EVENTTRIGGER_KAFKA_ACTIVATE`   | Activate Support for Kafka                                                                                                                                         | `true`           |
| `spring.kafka.bootstrap-servers` | `SPRING_KAFKA_BOOTSTRAPSERVERS` | Define Kafka Bootstrap Server                                                                                                                                      | `localhost:9092` |
| `Eventtrigger.workers`           | `EVENTTRIGGER_WORKERS`          | The number of executor pool workers to use when create / update events happen. Increasing the workers number means multiple triggers can be evaluated in parallel. | `8`              |

## Event Trigger REST API

A REST API allows managing Triggers using Create, Update, and Delete operations.

### Create Event Trigger

```http
POST {{ehrbase-url}}/ehrbase/plugin/event-trigger/service HTTP/1.1
Host: localhost:8080
Accept: application/json, text/javascript
Content-Type: application/json

{
    "id": "simple_test_trigger_bp.v1",
    "state": "active",
    ...
}

HTTP/1.1 200 OK
Vary: Accept
```

### Retrieve Event Trigger

```http
GET {{ehrbase-url}}/ehrbase/plugin/event-trigger/service/{{event_trigger_id}} HTTP/1.1
Host: localhost:8080

HTTP/1.1 200 OK
Vary: Accept
```

### Retrieve all Event Triggers

```http
GET {{ehrbase-url}}/ehrbase/plugin/event-trigger/service/ HTTP/1.1
Host: localhost:8080

HTTP/1.1 200 OK
Vary: Accept
```

### Update Event Trigger

```http
PUT {{ehrbase-url}}/ehrbase/plugin/event-trigger/service/{{event_trigger_id}}?activate=false HTTP/1.1
Host: localhost:8080

HTTP/1.1 200 OK
Vary: Accept
```

### Delete Event Trigger

```http
DELETE {{ehrbase-url}}/ehrbase/plugin/event-trigger/service/{{event_trigger_id}} HTTP/1.1
Host: localhost:8080

HTTP/1.1 200 OK
Vary: Accept
```
