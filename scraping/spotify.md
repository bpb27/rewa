Go to https://open.spotify.com/show/1lUPomulZRPquVAOOd56EW

run this (nb class names might change on builds)

```js
$$('.hTRqaN61SDG95erQGMmx').map((el) => ({
  title: el
    .querySelector('.bG5fSAAS6rRL8xxU5iyG')
    .textContent.split('With')[0]
    .replace('‘', '')
    .replace('’', '')
    .trim(),
  hosts: el
    .querySelector('.bG5fSAAS6rRL8xxU5iyG')
    .textContent.split('With')[1]
    .trim()
    .split(' and ')
    .map((i) => i.split(','))
    .flat()
    .map((i) => i.trim())
    .filter((i) => i),
  date: el.querySelector('.qfYkuLpETFW3axnfMntO').firstChild.textContent,
  url: el.querySelector('a').href,
}));
```
