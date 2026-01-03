import styled from "styled-components";

export const ChatContainer = styled.div`
  width: 100%;
  max-width: 500px;
  height: 600px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  background-color: #ffffff;
`;

export const ChatHeader = styled.div`
  background-color: #4f46e5; /* Azul Tailwind */
  color: white;
  padding: 12px 16px;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
`;

export const ChatMessages = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ChatInputContainer = styled.div`
  display: flex;
  padding: 12px;
  border-top: 1px solid #ddd;
  background-color: #f9f9f9;
`;

export const ChatInput = styled.input`
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 8px;
  outline: none;
  font-size: 16px;
`;

export const SendButton = styled.button`
  background-color: #4f46e5;
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  margin-left: 8px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: #4338ca;
  }
`;
