---
layout: page
title: Home
permalink: /
---

<!-- Add this to your front matter to load assets -->
<head>
  <link href="{{ '/assets/css/intro-animation.css' | relative_url }}" rel="stylesheet">
</head>

<!-- Intro Animation HTML -->
<div class="intro-animation">
  <div class="white-overlay"></div>
  <div class="intro-text">
    <span class="h">h</span>
    <span class="i">i</span>
  </div>
</div>

<!-- Your Markdown content (wrapped in HTML for the fade-in effect) -->
<div class="page-content" style="opacity:0;">
# Welcome to My Website

Here's what you'll find on my site:

- [Blog](/blog) - My thoughts and articles
- [Projects](/projects) - My projects
- [Resume](/resume) - My professional background
</div>

<!-- Load JS at bottom -->
<script src="{{ '/assets/js/intro-animation.js' | relative_url }}"></script>