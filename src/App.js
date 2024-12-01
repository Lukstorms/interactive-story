// src/App.js
import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "./App.css";

function App() {
  const [storyType, setStoryType] = useState("");
  const [userInput, setUserInput] = useState("");
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const storyOptions = [
    "Fantasia Medieval",
    "Faroeste",
    "Cyberpunk",
    "Terror",
    "Espaço Sideral",
  ];

  const startStory = async (type) => {
    setStoryType(type);
    const initialPrompt = `Quero começar uma história no estilo ${type}.`;
    await sendMessageToServer(initialPrompt);
  };

  const sendMessageToServer = async (message) => {
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/chat", {
        message,
      });
      const assistantResponse = response.data.response;

      setConversation((prev) => [
        ...prev,
        { role: "user", content: message },
        { role: "assistant", content: assistantResponse },
      ]);
    } catch (error) {
      console.error("Error communicating with the server:", error);
    }
    setIsLoading(false);
  };

  const handleOptionClick = async (option) => {
    await sendMessageToServer(option);
  };

  return (
      <div className="App">
        <h1>Histórias Interativas</h1>
        {!storyType && (
            <div>
              <h2>Escolha o tipo de história para começar:</h2>
              {storyOptions.map((option) => (
                  <button
                      key={option}
                      onClick={() => startStory(option)}
                      className="story-option"
                  >
                    {option}
                  </button>
              ))}
            </div>
        )}
        {storyType && (
            <div>
              <h2>História no estilo: {storyType}</h2>
              <div className="conversation">
                {conversation.map((entry, index) => (
                    <div
                        key={index}
                        className={`message ${entry.role}`}
                    >
                      {entry.role === "assistant" ? (
                          <ReactMarkdown>
                            {entry.content}
                          </ReactMarkdown>
                      ) : (
                          <p>{entry.content}</p>
                      )}
                    </div>
                ))}
              </div>
              <div className="input-area">
                <h3>Digite sua resposta ou escolha uma opção abaixo:</h3>
                {isLoading ? (
                    <p>Carregando...</p>
                ) : (
                    <div>
                                <textarea
                                    placeholder="Digite sua resposta"
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    rows="3"
                                />
                      <button
                          onClick={() => {
                            sendMessageToServer(userInput);
                            setUserInput("");
                          }}
                      >
                        Enviar
                      </button>
                    </div>
                )}
              </div>
            </div>
        )}
      </div>
  );
}

export default App;
