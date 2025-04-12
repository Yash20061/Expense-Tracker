    const API_KEY = "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";
    const API_URL = "https://openrouter.ai/api/v1/chat/completions";

    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSend = document.getElementById('chatbotSend');

    function insertExample(question) {
      chatbotInput.value = question;
      chatbotInput.focus();
      
    }

    function addMessage(text, sender) {
      const messageElement = document.createElement('div');
      messageElement.classList.add('message', `${sender}-message`);
      
      // Simple markdown formatting
      let formattedText = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n\n/g, '<br><br>')
        .replace(/\n/g, '<br>');
      
      messageElement.innerHTML = formattedText;
      chatbotMessages.appendChild(messageElement);
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function showTypingIndicator() {
      const typingElement = document.createElement('div');
      typingElement.classList.add('typing-indicator');
      typingElement.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
      `;
      chatbotMessages.appendChild(typingElement);
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
      return typingElement;
    }

    function removeTypingIndicator(typingElement) {
      if (typingElement && typingElement.parentNode) {
        typingElement.parentNode.removeChild(typingElement);
      }
    }

    // Send message to OpenRouter API
    async function sendMessage() {
      const message = chatbotInput.value.trim();
      if (!message) return;

      // Add user message to chat
      addMessage(message, 'user');

      // Clear input but keep focus
      chatbotInput.value = '';
      chatbotInput.focus();

      // Show typing indicator
      const typingElement = showTypingIndicator();

      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": window.location.href,
            "X-Title": "ExpensePro Assistant"
          },
          body: JSON.stringify({
            model: "openai/gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: `You are ExpenseBot, the AI assistant for ExpensePro - a professional expense management platform. 
                Your role is to help users with expense tracking, budgeting, reports, and financial insights.
                Keep responses concise, professional yet friendly, and focused on expense management topics.
                Provide clear, actionable advice and format responses for readability.`
              },
              { role: "user", content: message }
            ]
          })
        });

        removeTypingIndicator(typingElement);

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        const reply = data.choices[0].message.content;
        addMessage(reply, 'bot');
      } catch (error) {
        removeTypingIndicator(typingElement);
        console.error('Error calling chatbot API:', error);
        addMessage("Sorry, I'm having trouble responding right now. Please try again later.", 'bot');
      }
    }


    chatbotSend.addEventListener('click', sendMessage);
    chatbotInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });

    chatbotInput.focus();

    chatbotInput.addEventListener('input', () => {
      chatbotSend.disabled = !chatbotInput.value.trim();
    });