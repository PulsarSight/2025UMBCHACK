function playGame() {
  alert("Play button clicked! (This could start your game)");
}

function showInstructions() {
  alert("Instructions: Here's how you play...");
}

function toggleMission() {
  const mission = document.getElementById("mission");
  mission.classList.toggle("hidden");
}

function playGame() {
  alert("Play button clicked! (This could start your game)");
}

function openInstructions() {
  const popup = document.getElementById("instructionsPopup");
  popup.classList.add("show");
}

function closeInstructions() {
  const popup = document.getElementById("instructionsPopup");
  popup.classList.remove("show");
}