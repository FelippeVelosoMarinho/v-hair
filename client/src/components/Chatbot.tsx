import { useState } from "react";
import {
    ChatContainer,
    ChatHeader,
    ChatMessages,
    ChatInputContainer,
    ChatInput,
    SendButton,
} from "./Chatbot.styles";

export default function Chatbot() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { text: input, sender: "user" };
        setMessages([...messages, userMessage]);

        setInput(""); // Limpa o input

        // Simulando resposta da API (substituir com chamada real)
        setTimeout(() => {
            const botMessage = { text: "Resposta do Chatbot!", sender: "bot" };
            setMessages((prev) => [...prev, botMessage]);
        }, 1000);
    };

    return (
        <ChatContainer>
            <ChatHeader>Chatbot</ChatHeader>
            <ChatMessages>
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`p-2 rounded-lg ${msg.sender === "user" ? "bg-blue-500 text-white self-end" : "bg-gray-300"
                            }`}
                    >
                        {msg.text}
                    </div>
                ))}
            </ChatMessages>
            <ChatInputContainer>
                <ChatInput
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Digite sua mensagem..."
                />
                <SendButton onClick={sendMessage}>Enviar</SendButton>
            </ChatInputContainer>
        </ChatContainer>
    );
}
