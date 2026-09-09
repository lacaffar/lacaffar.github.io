# lacaffar.github.io

Personal site for Luke Caffarey. Static HTML and CSS, no build step and no JavaScript.

The site is deliberately presented as in progress: project pages are marked as drafts,
each one carries a "still to write" list, and projects without a page appear on the index
as stubs rather than being padded out with detail that is not true.

- `index.html` : the project index and the about block
- `projects/*.html` : one page per project
- `assets/css/site.css` : the whole design system
- `assets/covers/` : project cover art

`projects/windpack.html` is the one fully written page: season one narrative, the
subsystem build, what broke, and the year two plan. Its photos are cut by
`.claude/make_windpack_photos.py` from 1600px sources staged in `assets/photos/`.
The team's own site is <https://windpack.club>.

`projects/rocket-avionics.html` is **unlisted**: it is not linked from the index and is
marked `noindex`. It goes back on the index once the project has flown.

Unreferenced cover art currently in `assets/covers/`: `wind-engineering.svg`,
`rocket-avionics.svg`, `ge-vernova-brand.jpg`. The first two illustrated claims that are
no longer on the site; the third is company branding and should not come back.

Serve locally with `python -m http.server 8011`.
