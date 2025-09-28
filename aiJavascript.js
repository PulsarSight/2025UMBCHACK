// aiJavascript.js (robust popup control + chat flow)
document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const popup     = document.getElementById("chat-popup");
  const toggleBtn = document.getElementById("chat-toggle");
  const closeBtn  = document.getElementById("chat-close");
  const sendBtn   = document.getElementById("send-btn");
  const userInput = document.getElementById("user-input");
  const chatBox   = document.getElementById("chat-box");

  // --- Guard ---
  if (!popup) return;

  // --- Popup controls (force closed by default) ---
  function openPopup()  { popup.classList.add("open");  popup.style.display = "flex"; }
  function closePopup() { popup.classList.remove("open"); popup.style.display = "none"; }

  // Ensure closed on load even if CSS didn’t apply yet
  closePopup();

  toggleBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    if (popup.classList.contains("open")) closePopup(); else openPopup();
  });
  closeBtn?.addEventListener("click", (e) => { e.preventDefault(); closePopup(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closePopup(); });

  // --- Chat helpers ---
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
      // remove last loading bubble if present
      const kids = chatBox.children;
      for (let i = kids.length - 1; i >= 0; i--) {
        if (kids[i].dataset && kids[i].dataset.loading) { chatBox.removeChild(kids[i]); break; }
      }
    }
  }

  // --- Send flow ---
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

  sendBtn?.addEventListener("click", sendMessage);
  userInput?.addEventListener("keypress", e => { if(e.key==="Enter") sendMessage(); });
});
