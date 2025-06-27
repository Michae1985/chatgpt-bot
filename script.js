async function sendMessage() {
  const input = document.getElementById("userInput");
  const chatbox = document.getElementById("chatbox");
  const userMessage = input.value;

  chatbox.innerHTML += `<p><strong>Dig:</strong> ${userMessage}</p>`;
  input.value = "";

  const response = await fetch("http://localhost:3000/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: userMessage }),
  });

  const data = await response.json();
  chatbox.innerHTML += `<p><strong>ChatGPT:</strong> ${data.reply}</p>`;
}