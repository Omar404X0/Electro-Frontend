'use client'
import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const API_BASE_URL = "https://electro-backend-2dx5.onrender.com";

interface FormProps {
  chat?: boolean;
  setChat: (value: boolean) => void;
  className?: string;
}

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const Form: React.FC<FormProps> = ({ className, setChat }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: 'أهلاً بك في متجر Electro! كيف يمكنني مساعدتك اليوم؟' }
  ]);
  const [loading, setLoading] = useState<boolean>(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

 const handleSendMessage = async () => {
    const text = inputRef.current?.value.trim();
    if (!text || loading) return;

    const userMessage: Message = { sender: 'user', text };
    setMessages((prev) => [...prev, userMessage]);

    if (inputRef.current) {
      inputRef.current.value = '';
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/products/ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: text,
          history: messages
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.reply) {
          setMessages((prev) => [...prev, { sender: 'ai', text: data.reply }]);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: 'ai', text: 'عذراً، حدث خطأ أثناء الاتصال بالخادم.' }
        ]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'عذراً، تعذر الاتصال بالخادم.' }
      ]);
    } finally {
      setLoading(false);
    }
  };
  return (
    <StyledWrapper
      className={className}
      onClick={(e) => {
        if (e.target === e.currentTarget) setChat(false);
      }}
    >
      <div className="container">
        <div className="nav-bar">
          <a>Electro Ai</a>
          <div className="close" onClick={() => setChat(false)}>
            <div className="line one" />
            <div className="line two" />
          </div>
        </div>

        <div className="messages-area">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message-bubble ${
                msg.sender === 'user' ? 'user-msg' : 'ai-msg'
              }`}
            >
              {msg.text}
            </div>
          ))}

          {loading && (
            <div className="message-bubble ai-msg thinking-bubble">
              <span className="thinking-text">جاري التفكير</span>
              <div className="dots-container">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="sender-area">
          <div className="input-place">
            <input
              ref={inputRef}
              placeholder="أرسل رسالة..."
              className="send-input"
              type="text"
              disabled={loading}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button
              className="send"
              onClick={handleSendMessage}
              disabled={loading}
              aria-label="Send"
            >
              <svg
                className="send-icon"
                version="1.1"
                viewBox="0 0 512 512"
                xmlSpace="preserve"
              >
                <g>
                  <g>
                    <path
                      fill="#ffffff"
                      d="M481.508,210.336L68.414,38.926c-17.403-7.222-37.064-4.045-51.309,8.287C2.86,59.547-3.098,78.551,1.558,96.808 L38.327,241h180.026c8.284,0,15.001,6.716,15.001,15.001c0,8.284-6.716,15.001-15.001,15.001H38.327L1.558,415.193 c-4.656,18.258,1.301,37.262,15.547,49.595c14.274,12.357,33.937,15.495,51.31,8.287l413.094-171.409 C500.317,293.862,512,276.364,512,256.001C512,235.638,500.317,218.139,481.508,210.336z"
                    />
                  </g>
                </g>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const pulse = keyframes`
  0%, 80%, 100% {
    transform: scale(0.6);
    opacity: 0.4;
  }
  40% {
    transform: scale(1.1);
    opacity: 1;
  }
`;

const StyledWrapper = styled.div`
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100dvh;
  padding: 16px;
  box-sizing: border-box;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999999;

  .container {
    width: 100%;
    max-width: 600px;
    height: 520px;
    max-height: 100%;
    background-color: #000000;
    border: 1px solid #27272a;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5),
      0 8px 10px -6px rgba(0, 0, 0, 0.5);
    overflow: hidden;
  }

  .nav-bar {
    width: 100%;
    height: 48px;
    flex-shrink: 0;
    background-color: #09090b;
    border-bottom: 1px solid #27272a;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    box-sizing: border-box;
  }

  .nav-bar a {
    color: #ffffff;
    font-weight: 600;
    white-space: nowrap;
    margin-left: 10px;
    user-select: none;
  }

  .close {
    width: 36px;
    height: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    cursor: pointer;
    border-radius: 6px;
    transition: background 0.2s;
  }

  .close:hover {
    background-color: #27272a;
  }

  .line {
    position: absolute;
    width: 18px;
    height: 2px;
    background-color: #ffffff;
    border-radius: 2px;
  }

  .line.one {
    transform: rotate(45deg);
  }

  .line.two {
    transform: rotate(135deg);
  }

  .messages-area {
    background-color: #0a0a0a;
    width: 100%;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 15px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 10px;
    direction: rtl;
    text-align: right;
  }

  .message-bubble {
    max-width: 75%;
    padding: 10px 14px;
    border-radius: 8px;
    font-size: 14px;
    color: #ffffff;
    word-break: break-word;
  }

  .user-msg {
    background-color: #27272a;
    align-self: flex-end;
    border-bottom-right-radius: 2px;
  }

  .ai-msg {
    background-color: #18181b;
    align-self: flex-start;
    border-bottom-left-radius: 2px;
    border: 1px solid #27272a;
  }

  .thinking-bubble {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #a1a1aa;
    font-size: 13px;
  }

  .dots-container {
    display: flex;
    align-items: center;
    gap: 4px;
    direction: ltr;
  }

  .dot {
    width: 6px;
    height: 6px;
    background-color: #a1a1aa;
    border-radius: 50%;
    animation: ${pulse} 1.4s infinite ease-in-out both;
  }

  .dot:nth-child(1) {
    animation-delay: -0.32s;
  }

  .dot:nth-child(2) {
    animation-delay: -0.16s;
  }

  .sender-area {
    background-color: #09090b;
    width: 100%;
    height: 75px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px solid #27272a;
  }

  .input-place {
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: #18181b;
    border-radius: 8px;
    height: 44px;
    width: 92%;
    padding: 0 10px;
    box-sizing: border-box;
    gap: 8px;
    border: 1px solid #27272a;
  }

  .send-input {
    outline: none;
    border: none;
    background: transparent;
    height: 100%;
    flex: 1;
    min-width: 0;
    color: #ffffff;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    font-size: 14px;
  }

  .send-input::placeholder {
    color: #71717a;
  }

  .send-input:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .send {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
    background-color: #ffffff;
    border: none;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .send:hover:not(:disabled) {
    opacity: 0.85;
  }

  .send:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .send-icon {
    width: 14px;
  }

  .send-icon path {
    fill: #000000;
  }

  @media (max-width: 640px) {
    padding: 10px;

    .container {
      height: min(440px, 100%);
      border-radius: 10px;
    }

    .nav-bar {
      height: 42px;
      padding: 0 6px;
    }

    .nav-bar a {
      font-size: 14px;
      margin-left: 6px;
    }

    .close {
      width: 32px;
      height: 32px;
    }

    .line {
      width: 16px;
    }

    .messages-area {
      padding: 10px;
      gap: 8px;
    }

    .message-bubble {
      max-width: 85%;
      padding: 8px 12px;
      font-size: 13px;
    }

    .sender-area {
      height: 62px;
    }

    .input-place {
      height: 40px;
      width: calc(100% - 20px);
    }

    .send-input {
      font-size: 16px;
    }

    .send {
      width: 30px;
      height: 30px;
    }
  }

  @media (max-height: 520px) {
    padding: 6px;

    .container {
      height: 100%;
    }

    .sender-area {
      height: 54px;
    }

    .input-place {
      height: 38px;
    }
  }
`;

export default Form;