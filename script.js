(function () {
  "use strict";
  const data = window.SITE_CONTENT;
  if (!data) return;

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const scholarSearch = (title) => "https://scholar.google.com/scholar?q=" + encodeURIComponent(title);

  const featured = data.publications.filter((item) => item.feature);
  const featuredTarget = document.getElementById("featured-publications");
  const featuredFragment = document.createDocumentFragment();
  featured.forEach((item) => {
    const card = el("article", "featured-card");
    const art = el("div", "featured-art");
    art.setAttribute("aria-hidden", "true");
    art.append(el("span", "", item.feature));
    const body = el("div", "featured-body");
    body.append(el("p", "featured-meta", item.journal.split(" · ")[0] + " / " + item.year));
    body.append(el("h3", "", item.title));
    body.append(el("p", "", "First-author publication"));
    card.append(art, body);
    featuredFragment.append(card);
  });
  if (featuredTarget) featuredTarget.replaceChildren(featuredFragment);

  const publicationTarget = document.getElementById("publication-list");
  const filterButtons = [...document.querySelectorAll(".filter-button")];
  function renderPublications(filter) {
    const publications = data.publications.filter((item) => filter === "all" || item.type === filter);
    const fragment = document.createDocumentFragment();
    publications.forEach((item) => {
      const row = el("article", "publication-item");
      row.append(el("span", "publication-year", String(item.year)));
      const main = el("div");
      const title = el("h3", "", item.title);
      const details = el("p", "", item.journal);
      if (item.status) details.append(el("span", "status", item.status));
      main.append(title, details);
      row.append(main);
      if (item.status) {
        row.append(el("span", ""));
      } else {
        const link = el("a", "", "↗");
        link.href = scholarSearch(item.title);
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.setAttribute("aria-label", "Find " + item.title + " on Google Scholar");
        row.append(link);
      }
      fragment.append(row);
    });
    publicationTarget.replaceChildren(fragment);
  }
  filterButtons.forEach((button) => button.addEventListener("click", () => {
    filterButtons.forEach((other) => {
      const active = other === button;
      other.classList.toggle("active", active);
      other.setAttribute("aria-pressed", String(active));
    });
    renderPublications(button.dataset.filter);
  }));
  if (publicationTarget) renderPublications("first");

  function renderExpandable(targetId, items, initialCount, createItem, moreText, lessText) {
    const target = document.getElementById(targetId);
    if (!target) return;
    const button = el("button", "more-button", moreText);
    button.type = "button";
    button.setAttribute("aria-expanded", "false");
    let expanded = false;
    function render() {
      const fragment = document.createDocumentFragment();
      items.slice(0, expanded ? items.length : initialCount).forEach((item) => fragment.append(createItem(item)));
      target.replaceChildren(fragment);
      button.textContent = expanded ? lessText : moreText;
      button.setAttribute("aria-expanded", String(expanded));
    }
    target.after(button);
    button.addEventListener("click", () => { expanded = !expanded; render(); });
    render();
  }

  renderExpandable("patent-list", data.patents, 4, (item) => {
    const row = el("article", "patent-item");
    row.append(el("span", "tag", item.status));
    row.append(el("h3", "", item.title));
    row.append(el("p", "", item.number + " · " + item.date));
    return row;
  }, "View all 8 patent records ↓", "Show fewer ↑");

  renderExpandable("project-list", data.projects, 3, (item) => {
    const row = el("article", "project-item");
    row.append(el("span", "tag", item.period));
    row.append(el("h3", "", item.title));
    row.append(el("p", "", item.role));
    return row;
  }, "View all projects ↓", "Show fewer ↑");

  const awardTarget = document.getElementById("awards-list");
  const awardFragment = document.createDocumentFragment();
  data.awards.forEach((item) => {
    const card = el("article", "award-item");
    card.append(el("span", "", item.year));
    card.append(el("h3", "", item.title));
    awardFragment.append(card);
  });
  if (awardTarget) awardTarget.replaceChildren(awardFragment);

  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.getElementById("primary-nav");
  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });
  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open menu");
  }));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("open")) {
      nav.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.focus();
    }
  });

  document.getElementById("copyright-year").textContent = String(new Date().getFullYear());
}());
