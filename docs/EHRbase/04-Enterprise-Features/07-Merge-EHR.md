---
title: Merge EHR
description: HIP EHRbase provides additional Admin API capabilities, like Merge EHR. The process of merging EHRs involves moving all contributions, compositions, and item tags from the source EHR to the target EHR. In the basic implementation, folders are discarded.
---

# Merge EHR

HIP EHRbase provides a new process of merging EHRs that involves moving all contributions, compositions, and item tags from the source EHR to the target EHR. The REST interface provides operations for merging, retrieving merge details, checking merge status, and obtaining the new EHR ID post-merge. Additionally, the merge operation is covered by event triggers and ATNA logging.

Merging behavior:

* All CONTRIBUTIONs referencing the source EHR are moved to the target EHR
* All COMPOSITIONs referencing the source EHR are moved to the target EHR
* All ITEM_TAGs referencing the source EHR are moved to the target EHR
* In the basic implementation, folders of the source EHR are deleted. CONTRIBUTIONs and AUDIT_DETAILS belonging to the folders are left intact.
* The source EHR including the EHR_STATUS is deleted. CONTRIBUTIONs and AUDIT_DETAILS belonging to EHR_STATUS are left intact.
* An entry documenting the merge is added to ehr_merge_status
* In case of a cascaded merge (e.g. EHR2 merged in EHR1 then EHR1 merged in EHR3 ) the merge history details can be accessed.

:::warning
1. Even if unmerging data is stored for each merge, the unmerge operation is not possible at the moment. It might be added in the future.
2. Folders of the source EHR are deleted.
:::

## Configuration

The Merge EHR operation is available by default as an admin operation. The only configuration for it is the already existing admin api context path configuration.

| Property                 | Env Variable           | Use                                                               | Example          |
|--------------------------|------------------------|-------------------------------------------------------------------|------------------|
| `admin-api.context-path` | `ADMINAPI_CONTEXTPATH` | Configures the Admin API context path for all the admin endpoints | `/rest/admin`    |

## REST API

For merging 2 EHRs and checking on the status checkout the [Merge EHR Admin API](/api/hip-ehrbase/admin#tag/EHR-Merge).