// aiJavascript.js
document.addEventListener("DOMContentLoaded", () => {
  const sendBtn = document.getElementById("send-btn");
  const userInput = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");

  // Add messages to chat box
  function addMessage(sender, text) {
    const msg = document.createElement("div");
    msg.className = sender === "You" ? "text-right mb-2" : "text-left mb-2";
    msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // Send message to backend
  async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    addMessage("You", text);
    userInput.value = "";

    const loadingMsg = document.createElement("div");
    loadingMsg.innerHTML = `<strong>AI:</strong> Loading response...`;
    chatBox.appendChild(loadingMsg);
    chatBox.scrollTop = chatBox.scrollHeight;

    const systemMessage = {
      role: "system",
      content: `
        You are a finance assistant for a simulation game.
        - Provide short, informative answers about financial concepts.
        - Do NOT give investment advice.
        - Keep answers concise.
      `
    };

    try {
      const res = await fetch("http://localhost:3000/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [systemMessage, { role: "user", content: text }]
        })
      });

      const data = await res.json();
      chatBox.removeChild(loadingMsg);

      if (data.reply) addMessage("AI", data.reply);
      else addMessage("AI", "⚠️ Error: No reply from server.");
    } catch (err) {
      chatBox.removeChild(loadingMsg);
      addMessage("AI", "⚠️ Error connecting to AI server.");
      console.error(err);
    }
  }

  // Event listeners
  sendBtn.addEventListener("click", sendMessage);
  userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });
});
