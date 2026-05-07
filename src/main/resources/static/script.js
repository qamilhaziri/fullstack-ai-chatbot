
    const chatForm = document.getElementById('chat-form');
    const messageInput = document.getElementById('message-input');
    const chatMessages = document.getElementById('chat-messages');

    chatForm.addEventListener('submit',async function(e) {
        e.preventDefault();
        const message = messageInput.value;
        if(!message) return;

        addMessageToChat('User',message);

        messageInput.value = '';

        try {
            const response = await fetchStreamWithRetry('/stream?message=' + encodeURIComponent(message));
            const reader = response.body.getReader();
            let botMessageElement = addMessageToChat('Bot','');
            let contentElement = botMessageElement.querySelector('.message-content');
            await proccessStream(reader,contentElement);
        }catch(error){
            console.error('Error fetching chatbot response: ',error);
            addMessageToChat('System','An error occured while fetching the response.Please try again.');
        }
    });

    async function fetchStreamWithRetry(url,retries = 3) {
        for(let i = 0; i < retries; i++){
            try{
            const response = await fetch(url);
            if(!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response;
            }
            catch(e){
                console.error(`Attempt ${i + 1} failed: ${e.message}`);
                if(i === retries - 1) throw e;
                await new Promise(resolve => setTimeout(resolve,1000));
            }
        }
    }


    async function proccessStream(reader,contentElement) {
        const decoder = new TextDecoder("utf-8");
        try{
            while(true){
                const {done, value} = await reader.read();
                if(done) break;

                contentElement.innerHTML += decoder.decode(value,{stream:true});
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        }catch(error){
            console.error("Error proccessing stream: " ,error);
            contentElement.innerHTML += '<br[Error:Stream interrupted.Please try again.]';
        }
    }

    function addMessageToChat(sender,content){
        const messageElement = document.createElement('div');
        messageElement.className = `${sender.toLowerCase()}-message ${sender === 'User' ? 'bg-blue-100' : 'bg-gray-100'} p-3 rounded-lg`;
        messageElement.innerHTML = `
            <div class="font-bold ${sender === 'User' ? 'text-blue-600' : 'text-green-600'}">${sender}: </div>
            <div class="message-content">${content}</div>`;

        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return messageElement;
    }
