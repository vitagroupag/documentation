---
sidebar_position: 3
---


# Context Information

To simplify the input, the flat format offers the option to set context values which set default values in the RM-tree.

```json
{
 "ctx/language": "de",
 "ctx/territory": "US",
 "ctx/time": "2021-04-01T12:40:31.418954+02:00",
 "ctx/composer_name": "Silvia Blake",
 "ctx/composer_id": "123",
 "ctx/id_namespace": "HOSPITAL-NS",
 "ctx/id_scheme": "HOSPITAL-NS",
 "ctx/work_flow_id|id": "567",
 "ctx/work_flow_id|id_scheme": "HOSPITAL-NS",
 "ctx/work_flow_id|namespace": "HOSPITAL-NS",
 "ctx/work_flow_id|type": "ORGANISATION",
 "ctx/participation_name:0": "Dr. Marcus Johnson",
 "ctx/participation_function:0": "requester",
 "ctx/participation_mode:0": "face-to-face communication",
 "ctx/participation_id:0": "199",
 "ctx/participation_identifiers:0": "issuer1::assigner1::id1::PERSON;issuer2::assigner2::id2::PERSON",
 "ctx/participation_name:1": "Lara Markham",
 "ctx/participation_function:1": "performer",
 "ctx/participation_id:1": "198",
 "ctx/participation_identifiers:1|issuer:0": "issuer3",
 "ctx/participation_identifiers:1|assigner:0": "assigner3",
 "ctx/participation_identifiers:1|id:0": "id3",
 "ctx/participation_identifiers:1|type:0": "PERSON",
 "ctx/participation_identifiers:1|issuer:1": "issuer4",
 "ctx/participation_identifiers:1|assigner:1": "assigner4",
 "ctx/participation_identifiers:1|id:1": "id4",
 "ctx/participation_identifiers:1|type:1": "PERSON",
 "ctx/health_care_facility|name": "Hospital",
 "ctx/health_care_facility|id": "9091"
 }
```

### Composer

```json
{
 "ctx/composer_name": "Silvia Blake",
 "ctx/composer_id": "123",
 "ctx/id_namespace": "HOSPITAL-NS",
 "ctx/id_scheme": "HOSPITAL-NS"
 }
```

```json
{
 "ctx/composer_self": true,
 "ctx/composer_id": "123",
 "ctx/id_namespace": "HOSPITAL-NS",
 "ctx/id_scheme": "HOSPITAL-NS"
 }
```

- **composer_name:** Sets composer to party identified and sets the name.
- **composer_self:** Sets composer to party_self.
- **composer_id:** Sets composer.external_ref.id.value and sets it to party identified unless composer_self is set to true.

### ID Namespace and ID Scheme

```json
{
 "ctx/composer_id": "123",
 "ctx/id_namespace": "HOSPITAL-NS",
 "ctx/id_scheme": "HOSPITAL-NS"
 }
```

- **id_namespace:** Default namespace for external references: OBJECT_REF.namespace.
- **id_scheme:** Default scheme for external references: OBJECT_REF.id.scheme.

### Language and Territory

```json
{
 "ctx/language": "de",
 "ctx/territory": "US"
 }
```

- **language:** Sets the default language for ENTRY.language && COMPOSITION.language.
- **territory:** Sets the default territory for COMPOSITION.territory.

### Workflow ID

```json
{
 "ctx/work_flow_id|id": "567",
 "ctx/work_flow_id|id_scheme": "HOSPITAL-NS",
 "ctx/work_flow_id|namespace": "HOSPITAL-NS",
 "ctx/work_flow_id|type": "ORGANISATION"
 }
```

- Sets the default for ENTRY.workflowId.
- Work_flow_id|id_scheme can be left out if ctx/id_scheme is set.
- Work_flow_id|namespace can be left out if ctx/namespace is set.

### Participation

```json
{
 "ctx/participation_name:0": "Dr. Marcus Johnson",
 "ctx/participation_function:0": "requester",
 "ctx/participation_mode:0": "face-to-face communication",
 "ctx/participation_id:0": "199",
 "ctx/participation_identifiers:0": "issuer1::assigner1::id1::PERSON;issuer2::assigner2::id2::PERSON",
 "ctx/participation_name:1": "Lara Markham",
 "ctx/participation_function:1": "performer",
 "ctx/participation_id:1": "198",
 "ctx/participation_identifiers:1|issuer:0": "issuer3",
 "ctx/participation_identifiers:1|assigner:0": "assigner3",
 "ctx/participation_identifiers:1|id:0": "id3",
 "ctx/participation_identifiers:1|type:0": "PERSON",
  "ctx/participation_identifiers:1|issuer:1": "issuer4",
  "ctx/participation_identifiers:1|assigner:1": "assigner4",
  "ctx/participation_identifiers:1|id:1": "id4",
  "ctx/participation_identifiers:1|type:1": "PERSON"
 }

* sets the default for EVENT_CONTEXT.participations && ENTRY.otherParticipations
* participation_identifiers can be set in a compact or non compat form.

```markdown
health_care_facility
--------------------------------------------------------

```json
{
 "ctx/health_care_facility|name": "Hospital",
 "ctx/health_care_facility|id": "9091",
 "ctx/id_namespace": "HOSPITAL-NS",
 "ctx/id_scheme": "HOSPITAL-NS"
}
```

set the default for `COMPOSITION.context.healthCareFacility`

time
--------------------------------------------------------

```json
{
 "ctx/time": "2021-04-01T12:40:31.418954+02:00"
}
```

* set the default time for `ACTION.time`, `COMPOSITION.context.startTime`, `OBSERVATION.history.origin`
* `EVENT.time` will be set to `history.origin` (plus offset if set to a minimum in the template)
* `ctx/time` will be set to `now()` if not set explicitly

end_time
--------------------------------------------------------

```json
{
 "ctx/end_time": "2021-05-01T12:40:31.418954+02:00"
}
```

* set the default time `COMPOSITION.context.endTime`

history_origin
--------------------------------------------------------

```json
{
 "ctx/history_origin": "2021-05-01T12:40:31.418954+02:00"
}
```

* set the default time for `OBSERVATION.history.origin`
* `EVENT.time` will be set to `history.origin` (plus offset if set to a minimum in the template)

action_time
--------------------------------------------------------

```json
{
 "ctx/action_time": "2021-05-01T12:40:31.418954+02:00"
}
```

* set the default time for `ACTION.time`

activity_timing
--------------------------------------------------------

```json
{
 "ctx/activity_timing": "R4/2022-01-31T10:00:00+01:00/P3M"
}
```

* set the default for `ACTIVITY.timing`

provider
--------------------------------------------------------

```json
{
 "ctx/provider_name": "Silvia Blake",
 "ctx/provider_id": "123",
 "ctx/id_namespace": "HOSPITAL-NS",
 "ctx/id_scheme": "HOSPITAL-NS"
}
```

* set the default `PARTY_IDENTIFIED` for `ENTRY.provider`

action_ism_transition_current_state
--------------------------------------------------------

```json
{
 "ctx/action_ism_transition_current_state": "completed"
}
```

```json
{
 "ctx/action_ism_transition_current_state": "532"
}
```

* set the default for `ACTION.ismTransition.currentState`
* either value or code is accepted

instruction_narrative
--------------------------------------------------------

```json
{
 "ctx/instruction_narrative": "Human readable instruction narrative"
}
```

* set the default for `INSTRUCTION.narrative`

location
--------------------------------------------------------

```json
{
 "ctx/location": "Lab B2"
}
```

* set the default for `COMPOSITION.context.location`

setting
--------------------------------------------------------

```json
{
 "ctx/setting": "other care"
}
```

```json
{
 "ctx/setting": "238"
}
```

* set the default for `COMPOSITION.context.setting`
* either value or code is accepted
* `ctx/setting` will be set to "other care" if not set explicitly  

link
--------------------------------------------------------

```json
{
 "ctx/link:0|type": "problem",
 "ctx/link:0|meaning": "problem related note",
 "ctx/link:0|target": "ehr://ehr.network/347a5490-55ee-4da9-b91a-9bba710f730e"
}
```

* set the default for `LOCATABLE.links`
```