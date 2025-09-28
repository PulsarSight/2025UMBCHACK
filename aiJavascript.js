// aiJavascript.js (popup chat, finance-safe system prompt, OpenAI backend)
document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const toggleBtn = document.getElementById("chat-toggle");
  const popup = document.getElementById("chat-popup");
  const closeBtn = document.getElementById("chat-close");
  const sendBtn = document.getElementById("send-btn");
  const userInput = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");

  // Helpers
  function addMessage(role, text){
    const wrap = document.createElement("div");
    wrap.className = `chat-msg ${role}`;
    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.textContent = text;
    wrap.appendChild(bubble);
    chatBox.appendChild(wrap);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
  function setLoading(on){
    if(on){
      sendBtn.disabled = true;
      addMessage("ai","…thinking");
      chatBox.lastChild.dataset.loading = "1";
    }else{
      sendBtn.disabled = false;
      const last = chatBox.lastChild;
      if(last && last.dataset && last.dataset.loading) chatBox.removeChild(last);
    }
  }

  // Toggle popup
  if (toggleBtn) toggleBtn.addEventListener("click", () => popup.classList.toggle("open"));
  if (closeBtn)  closeBtn.addEventListener("click", () => popup.classList.remove("open"));
  document.addEventListener("keydown", (e)=>{ if(e.key==="Escape") popup.classList.remove("open"); });

  // Send
  async function sendMessage(){
    const text = (userInput.value || "").trim();
    if(!text) return;
    addMessage("you", text);
    userInput.value = "";
    setLoading(true);

    const systemMessage = {
      role: "system",
      content: [
        "You are a friendly finance explainer for a classroom investing simulation.",
        "- Provide short, clear explanations of definitions and mechanics (e.g., inflation, APY vs APR, dividends, fees).",
        "- Do NOT give personalized investment advice or make recommendations.",
        "- Keep replies under 120 words unless the user asks for more.",
      ].join("\n")
    };

    try{
      const res = await fetch("http://localhost:3000/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [systemMessage, { role:"user", content:text }] })
      });
      const data = await res.json();
      setLoading(false);
      if(data && data.reply) addMessage("ai", data.reply);
      else addMessage("ai", "⚠️ Error: No reply from server.");
    }catch(err){
      setLoading(false);
      console.error(err);
      addMessage("ai", "⚠️ Error connecting to AI server.");
    }
  }

  if (sendBtn) sendBtn.addEventListener("click", sendMessage);
  if (userInput) userInput.addEventListener("keypress", e => { if(e.key==="Enter") sendMessage(); });
});
