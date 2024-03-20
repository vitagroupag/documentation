---
sidebar_position: 1
title: Create a Template
---

# Create a template (if storage protocol is openEHR)

:::info
If the storage protocol you will be using in your mapping is something other than openEHR, skip this section.
:::

In case you are reusing an existing template, the only thing you need to do is to submit it to the EHRbase instance that will store openEHR data in your environment. This can be done directly using the [EHRbase API](/api/hip-ehrbase/definition)  or using the Mapping Configuration Service. Note that the template needs to be in Operational Template 1.4 (OPT) format for either interface (for more on language versions and formats for templates and archetypes, see here).

In order to develop your own custom template, you can use any of the modelling tools available on the market (see here for a list of options), as long as they support exporting to OPT 1.4. A template library has been created to centralize custom templates developed by vitagroup. The templates included there have been developed using the openEHR [Archetype Designer](https://tools.openehr.org/designer/#/).

:::warning
Note that template IDs should be unique per EHRbase instance. For that reason, the current approach is to define IDs as a combination of a name and a version (e.g. bloodPressure.v2.2.0). Making changes to an existing template amounts to creating a new one with the same name and bumping the version appropriately.
:::

It is beyond the scope of this tutorial to explain the details involved in creating a template. Please discuss with your vitagroup representative for trainings. If you are using the Better Archetype Designer, [here](https://medblocks.com/blog/designing-openehr-templates-using-the-archetype-designer?ref=blog.medblocks.org) is a good introduction.

When you are done creating your template, export it in the appropriate format and submit it to the EHRbase instance as described above. With the template in place, it is time to start working on your custom mapping definition.

