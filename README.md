## Welcome to Feedback on GitHub

Feedback on GitHub is a simple component to include on your documentation pages. Not only do we want to help make it easier to ask for feedback, but we also want to automatically display and integrate that feedback directly into the documentation. We hope to make enabling feedback as quick as including some JavaScript and an HTML tag on the documentation pages that need it.

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

For the full documentation (and to see it in action) please see http://feedback-on-github.possumlabs.com/
