export const fetchAnswerLux = async (query, results) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  const raw = JSON.stringify({
    messages: [
      {
        source: 'BOT',
        text: 'Hi! How can I help you?',
      },
      {
        source: 'USER',
        text: query,
      },
    ],
    notes: {
      currentGoal: 'ANSWER_QUESTION',
      currentStepIndices: [0],
      searchQuery: query,
      queryResult: results,
    },
    version: 'LATEST',
  });

  const requestOptions: RequestInit = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  const chatResponse = await fetch(
    'https://cdn.yextapis.com/v2/accounts/me/chat/gen-answer-demo-bot/message?v=20231211&api_key=be97d1e89f5fa81b1f23018246c9b619',
    requestOptions
  )
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      console.log('error', error);
    });

  return chatResponse.response.message.text;
};
