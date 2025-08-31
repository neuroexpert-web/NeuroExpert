// Альтернативная функция для работы с Together AI
export async function getTogetherResponse(prompt, apiKey, history = []) {
  const messages = history.length > 0 ? history : [];
  
  if (messages.length === 0 || messages[0].role !== 'system') {
    messages.unshift({
      role: 'system',
      content: 'You are a helpful AI assistant.'
    });
  }
  
  messages.push({
    role: 'user',
    content: prompt
  });

  const response = await fetch('https://api.together.xyz/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO',
      messages: messages,
      temperature: 0.7,
      max_tokens: 2048
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Together API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  
  return {
    text: data.choices[0].message.content,
    updatedHistory: [...messages, {
      role: 'assistant',
      content: data.choices[0].message.content
    }]
  };
}