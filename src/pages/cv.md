---
layout: base.njk
title: CV
---

# {{ title }}

{% import "timeline/timeline.njk" as macro with context %}

{{ macro.timeline() }}