$$('.awards-result-chron').map((el) => {
  const ceremony = {
    awards: [],
    year: el
      .querySelector('.result-group-title .nominations-link')
      .textContent.split(' (')[0],
  };

  el.querySelectorAll('.subgroup-awardcategory-chron').forEach((categoryEl) => {
    const category = categoryEl
      .querySelector('.result-subgroup-title')
      ?.textContent.trim();
    const nominees = [];
    categoryEl.querySelectorAll('.result-details').forEach((entryEl) => {
      const won = !!entryEl.querySelector('.glyphicon-star');
      const name = entryEl
        .querySelector('.awards-result-nominationstatement a')
        ?.textContent.trim();
      const film = entryEl
        .querySelector('.awards-result-film a')
        ?.textContent.trim();
      nominees.push({ name, film, won });
    });
    console.log({ category, nominees });
    ceremony.awards.push({ category, nominees });
  });

  return ceremony;
});
