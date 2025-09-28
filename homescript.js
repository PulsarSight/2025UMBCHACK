function playGame() {
  window.location.href = "buyPage.html"; // replace with teammate’s filename
}

function showInstructions() {
  alert("Instructions: Here's how you play...");
}

function toggleMission() {
  const mission = document.getElementById("mission");
  mission.classList.toggle("hidden");
}

function openInstructions() {
  const popup = document.getElementById("instructionsPopup");
  popup.classList.add("show");
}

function closeInstructions() {
  const popup = document.getElementById("instructionsPopup");
  popup.classList.remove("show");
}