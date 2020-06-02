---
layout: default
title: Introduction
nav_order: 1
---
## Welcome to Feedback on GitHub

Feedback on GitHub is a simple component to include on your documentation pages---specifically, those hosted as GitHub pages. Not only do we want to help encourage feedback, but also to automatically display and integrate that feedback back into the documentation. We hope to make enabling feedback as quick as including some JavaScript and an HTML tag on the documentation pages that need it.

### Setup

Include the following references

```
<script src="https://code.jquery.com/jquery-3.2.1.min.js" ></script>
<script src="https://code.iconify.design/1/1.0.6/iconify.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>

<script src="https://feedback-on-github.possumlabs.com/src/feedback.js"></script>
<link rel="stylesheet" type="text/css" href="https://feedback-on-github.possumlabs.com/src/feedback.css"></link>
```

and the following JavaScript

```javascript
$(function() {
    feedbackOnGithub.init(
        {
            username:"Possum-Labs",
            repo:"Feedback-On-Github"
        }
    );
});
```

and then a custom tag where you wish to include the feedback section

```javascript
<feedback>
```

Please note some styles are overwritten on our site, and we try to make that easy. For the default styles, please see our [sample page](https://feedback-on-github.possumlabs.com/src/sample.html).

### Videos

#### PossumLabs Feeback on GitHub: Intro

<iframe width="560" height="315" src="https://www.youtube.com/embed/rqaFJrvGyjg" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

<feedback>
