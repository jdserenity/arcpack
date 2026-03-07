const container = document.getElementById("extensions");

const storageKeys = [
  ...EXTENSIONS.map((e) => e.id),
  ...EXTENSIONS.flatMap((e) =>
    (e.settings || []).map((setting) => getSettingStorageKey(e, setting.key))
  ),
];

// Build UI for each micro extension.
chrome.storage.local.get(
  storageKeys,
  (stored) => {
    for (const ext of EXTENSIONS) {
      const enabled = stored[ext.id] !== false;

      const card = document.createElement("div");
      card.className = "ext-card";
      const settingsHtml = (ext.settings || [])
        .map((setting) => {
          const storageKey = getSettingStorageKey(ext, setting.key);
          const value = stored[storageKey] ?? setting.defaultValue ?? "";
          const placeholder = setting.placeholder || "";
          return `
            <label class="ext-setting-row">
              <span class="ext-setting-label">${setting.label}</span>
              <input
                class="ext-setting-input"
                type="text"
                data-setting-key="${storageKey}"
                value="${escapeHtml(value)}"
                placeholder="${escapeHtml(placeholder)}"
              />
            </label>
          `;
        })
        .join("");

      card.innerHTML = `
        <div class="ext-main">
          <div class="ext-info">
            <span class="ext-name">${ext.name}</span>
            <span class="ext-version">v${ext.version}</span>
            <div class="ext-desc">${ext.description}</div>
          </div>
          <label class="toggle">
            <input type="checkbox" data-id="${ext.id}" ${enabled ? "checked" : ""} />
            <span class="slider"></span>
          </label>
        </div>
        ${settingsHtml ? `<div class="ext-settings">${settingsHtml}</div>` : ""}
      `;

      card.querySelector("input[type='checkbox']").addEventListener("change", (e) => {
        chrome.storage.local.set({ [ext.id]: e.target.checked });
      });

      card.querySelectorAll(".ext-setting-input").forEach((input) => {
        const saveSetting = () => {
          chrome.storage.local.set({ [input.dataset.settingKey]: input.value.trim() });
        };
        input.addEventListener("change", saveSetting);
        input.addEventListener("blur", saveSetting);
      });

      container.appendChild(card);
    }
  }
);

function getSettingStorageKey(ext, settingKey) {
  return `${ext.id}.settings.${settingKey}`;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
