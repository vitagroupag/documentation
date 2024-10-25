# Item Tags

:::warning
This is an experimental feature.
:::

## Introduction

openEHR is in the process of specifying tags, which, amongst other use-cases, could be used to handle annotations.
A draft of a data model has already been defined, consensus concerning REST API or AQL binding has not yet been reached.
Therefore, the implementation is based on/inspired by these efforts.

The Data Model is based on the development version of the openEHR-RM spec for tags (ITEM_TAG): [EHR Information Model](https://specifications.openehr.org/releases/RM/development/ehr.html#tags) [Common Information Model](https://specifications.openehr.org/releases/RM/development/common.html#tags). 

## Configuration

| ENV                                          | .yml                                          | Value to set                        | Default                   |
|----------------------------------------------|-----------------------------------------------|-------------------------------------|---------------------------|
| `EHRBASE_REST_EXPERIMENTAL_TAGS_ENABLED`     | `ehrbase.rest.experimental.tags.enabled`      | `true`/`false`                      | `false`                   |
| `EHRBASE_REST_EXPERIMENTAL_TAGS_CONTEXTPATH` | `ehrbase.rest.experimental.tags.context-path` | Context for the item_tags endpoints | `/rest/experimental/tags` |

## REST API

For managing Item Tags through the REST API checkout the [Item Tag API Definition](/api/hip-ehrbase/tags).
