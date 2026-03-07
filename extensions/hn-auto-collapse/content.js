// HN Auto Collapse v0.0.3
// Show the first 5 top-level comments and the first direct reply to each.
// Collapse everything else.
let topLevelCount = 0;
let currentTopLevelIndex = 0;
let firstReplyShown = false;

document.querySelectorAll("tr.athing.comtr").forEach((commentRow) => {
  const indent = commentRow.querySelector("td.ind img")?.width || 0;
  const toggle = commentRow.querySelector("a.togg");
  if (!toggle || !toggle.textContent.trim().match(/^\[[-–]\]$/)) return;

  if (indent === 0) {
    topLevelCount++;
    currentTopLevelIndex = topLevelCount;
    firstReplyShown = false;
    if (topLevelCount <= 5) return;
  } else if (indent === 40 && currentTopLevelIndex <= 5 && !firstReplyShown) {
    firstReplyShown = true;
    return;
  }

  toggle.click();
});
