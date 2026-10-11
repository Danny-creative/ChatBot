const API_KEY ='AQ.Ab8RN6KW8rRcpxAg4Qkq2XxGAue3Ql9YYfdXhtU2W9LmC_RLHg';

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`;

const chatMessage = document.getElementById('chatMessage');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');


async function generateResponse(prompt) {
    // Sends POST request to the Gemini API endpoint with the API key appended to the URL
    const response = await fetch (`${API_URL}?key=${API_KEY}`, {

        // Specifies the HTTP mothod (POST) to send data the API.
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },

        // The body of the request, covertubg the user's message into the format required by the API
        body:JSON.stringify({
            contents: [
                {
                    parts:[
                        {
                            // The user's input('prompt') is inserted into the request payload
                            text: prompt
                        }
                    ]
                }
            ]
        })
    });

    if(!response.ok) {
    throw new Error('Failed to give response')
};

const data = await response.json();

return data.candidates[0].content.parts[0].text;
}

// Defines a function `cleanMarkdown` to remove any markdown formatting(like headers, bold text. etc) from the response
function cleanMarkdown(text) {

    return text
        // Removes any markdown headers(e.g , #, ##, ###).
        .replace(/#{1,6}\s?/g, '')

        // Removes bold formatting(double strikes **).
        .replace(/\*\*/g, '')

        // Limits excessive newlines to a maximum of two (replaces more than two newlines with two).
        .replace(/\n{3,}/g, '\n\n')

        // Removes any white space from the start and end of the string
        trim();
}


function addMessage (message, isUser) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message')

    messageElement.classList.add(isUser?'user-message':'bot-message')
    
    const profileImage = document.createElement('img')
    profileImage.classList.add('profile-image')

    profileImage.src = isUser? 'user-picture-svgrepo-com.svg' : 'robot-svgrepo-com.svg';

    profileImage.alt = isUser? 'user' : 'bot';

    const messageContent = document.createElement('div')
    messageContent.classList.add('message-content');

        messageContent.textContent = message

        messageElement.appendChild(profileImage)
        messageElement.appendChild(messageContent)

        chatMessage.appendChild(messageElement)
}

async function handleUserInput() {
    const userMessage = userInput.value.trim();

    if(userMessage) {
        addMessage(userMessage, true)

        userInput.value = '';

        sendBtn.disabled = true;
        userInput.disabled = true;
    }

    try {
        const botMessage = await generateResponse(userMessage)
        addMessage(cleanMarkdown(botMessage), false)
    } catch (error) {
        console.error(error)
        addMessage('Sorry, I am unable to give response, Please try later')
    }
    finally{
        sendBtn.disabled = false;
        userInput.disabled = false;
        userInput.focus();
    }
}

sendBtn.addEventListener('click', handleUserInput);

userInput.addEventListener('keydown', (e) => {
    const userMessage = e.target.value.trim();

    if(e.key === "Enter" && userMessage) {
        handleUserInput(e);
    }
});