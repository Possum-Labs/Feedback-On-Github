## Welcome to Feedback on Github

Feedback on Github is a simple component to include on your documentation pages; specifically those hosted as Github pages. Not only do we want to solicit feedback, but also to show and integrate that feedback automatically back into the documentation. We want to make that as simple as including some javascript and a tag on the pages that we want to include the feedback integration for.

### Setup

Include the following references

```
<script src="https://code.jquery.com/jquery-3.2.1.min.js" ></script>
<script src="https://code.iconify.design/1/1.0.6/iconify.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>

<script src="https://feedback-on-github.possumlabs.com/src/feedback.js"></script>
<link rel="stylesheet" type="text/css" href="https://feedback-on-github.possumlabs.com/src/feedback.css"></link>
```

and the following javascript

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

and then a simple tag where you wish to include the feedback section

```javascript
<feedback>
```

For the full documentation (and to see it in action) please see http://feedback-on-github.possumlabs.com/