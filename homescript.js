// Navigate to the buy page
function playGame() {
  window.location.href = "buyPage.html";
}

// Collapsible sections (Mission & Instructions) use the same animation
function toggleMission() {
  const el = document.getElementById("mission");
  if (el) el.classList.toggle("show");
}
function toggleInstructions() {
  const el = document.getElementById("instructions");
  if (el) el.classList.toggle("show");
}

// Backwards-compat shims (if old handlers are still referenced)
function openInstructions(){ toggleInstructions(); }
function closeInstructions(){ toggleInstructions(); }
