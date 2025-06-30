function GetPanelName() {
  const Path = window.location.pathname;
  const Match = Path.match(/\/pages\/(\w+)\.html$/i);
  return Match ? Match[1].toLowerCase() : null;
}

function About(Data) {
  return `<p>${Data.content || "No description found."}</p>`;
}

function Projects(Data) {
  if (!Data.content || !Array.isArray(Data.content)) return "<p>No projects found.</p>";

  let Html = "<ul>";
  Data.content.forEach((Item) => {
    Html += `<li><strong>${Item.name.toUpperCase()}</strong><br>${Item.description}`;
    if (Item.link) {
      if (typeof Item.link === "string") {
        Html += `<br><a href="${Item.link}" class="button-view" target="_blank" rel="noopener">View</a>`;
      } else {
        Html += `<a href="${Item.link.url}" class="button-view" target="_blank" rel="noopener">${Item.link.label || "View"}</a>`;
      }
    }
    Html += "</li>";
  });

  return (Html += "</ul>");
}

function Logs(Data) {
  if (!Data.content || !Array.isArray(Data.content)) return "<p>No logs found.</p>";

  let Html = "<ul>";
  Data.content.slice().reverse().forEach((entry) => {
    Html += `<li><strong>${entry.date}</strong> ${entry.description}</li>`;
  });

  return (Html += "</ul>");
}

function Vault(Data) {
  if (!Data.content || !Array.isArray(Data.content)) return "<p>No vault items found.</p>";

  let Html = "<ul>";
  Data.content.forEach((Item) => {
    Html += `<li><strong>${Item.name}</strong> ${Item.description || ""}`;
    if (Item.link) Html += `<br><a href="${Item.link.url}" class="button-view" target="_blank" rel="noopener">${Item.link.label || "View"}</a>`;
    Html += `</li>`;
  });
  return (Html += "</ul>");
}

function LoadPanel(Data, Panel) {
  let Html = "<p>Panel not found.</p>";
  if (Panel === "about") {
    Html = About(Data.about);
  } else if (Panel === "projects") {
    Html = Projects(Data.projects);
  } else if (Panel === "logs") {
    Html = Logs(Data.logs);
  } else if (Panel === "vault") {
    Html = Vault(Data.vault);
  }
  return Html;
}

document.addEventListener("DOMContentLoaded", () => {
  const Panel = GetPanelName();
  if (!Panel) return;

  fetch("../assets/data/panels.json").then((res) => (res.ok ? res.json() : Promise.reject()))
    .then((Data) => {
      const Content = LoadPanel(Data, Panel);
      const PanelContent = document.getElementById("panel-content");
      if (PanelContent) PanelContent.innerHTML = Content;
    })
    .catch(() => {
      const PanelContent = document.getElementById("panel-content");
      if (PanelContent) PanelContent.innerHTML = "<p>Failed to load content.</p>";
    });
});
