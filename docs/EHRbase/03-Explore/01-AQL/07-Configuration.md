# Configuration

EHRbase comes with some options to customize how the AQL engine behaves.

## Pagination parameters conflict

Configure how EHRbase reacts when there is a conflict of AQL query `LIMIT/OFFSET` clauses and `fetch/offset` query parameters 
during an AQL query execute request by choosing one of the following strategies:
1. `REJECT` - EHRbase rejects the query execution if the AQL query contains a `LIMIT` or `OFFSET` and 
   the `fetch` or `offset` query parameters are also present on the request
2. `MIN_FETCH` - EHRbase will take the minimum value of `LIMIT` and `fetch` and use that one during the query execution;
    If the query AQL also contains the `OFFSET` clause, then the request is rejected.

Strategy the execute AQL query requests use when `LIMIT/OFFSET` are used in combination with `fetch/offset` query params

| Property                             | ENV                                 | Default value | Supported values      |
|--------------------------------------|-------------------------------------|---------------|-----------------------|
| `ehrbase.rest.aql.fetch-precedence`  | `EHRBASE_REST_AQL_FETCHPRECEDENCE`  | `REJECT`      | `REJECT`, `MIN_FETCH` |

## Limit query results by default

To set up data query safeguards EHRbase can be configured with the following limits:
* `ehrbase.rest.aql.default-limit` - when the AQL query or the request don't specify a `LIMIT` and `fetch` the system
  will use the configured default limit
* `ehrbase.rest.aql.max-limit` - a hard constraint for the `LIMIT` clause in any AQL query ran in the system;
  in case a query exceeds it, an error is reported
* `ehrbase.rest.aql.max-limit` - a hard constraint for the `fetch` query parameter in any AQL execute query requests;
  in case a request exceeds it, an error is reported

| Property                         | ENV                             | Default value | Supported values    |
|----------------------------------|---------------------------------|---------------|---------------------|
| `ehrbase.rest.aql.default-limit` | `EHRBASE_REST_AQL_DEFAULTLIMIT` | none          | any positive number |
| `ehrbase.rest.aql.max-limit`     | `EHRBASE_REST_AQL_MAXLIMIT`     | none          | any positive number |
| `ehrbase.rest.aql.max-fetch`     | `EHRBASE_REST_AQL_MAXFETCH`     | none          | any positive number |
