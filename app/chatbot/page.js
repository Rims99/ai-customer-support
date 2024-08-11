'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, List, ListItem, ListItemText, Divider } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';
import ThumbsUpIcon from '@mui/icons-material/ThumbUp';
import ThumbsDownIcon from '@mui/icons-material/ThumbDown';

const knowledgeBase = {
  "What is Headstarter AI?": "Headstarter AI is a platform that offers a 7-week software engineering fellowship aimed at helping individuals kickstart their careers in tech.",
  "What is the Headstarter 7-week SWE Fellowship?": "The Headstarter 7-week SWE Fellowship is an intensive program designed to provide practical software engineering experience.",
  "How can I apply for the fellowship?": "You can apply for the fellowship by visiting the Headstarter AI website and filling out the application form.",
  "What is the fellowship curriculum like?": "The curriculum includes hands-on projects, mentorship, and workshops focused on modern software engineering practices.",
  "What are the benefits of joining the fellowship?": "Benefits include gaining real-world experience, networking opportunities, and the potential for job placements.",
  "Who are some successful alumni of the program?": "Some successful alumni include Jane Doe, who is now a software engineer at Google, and John Smith, who works at Facebook."
};

const predefinedQuestions = Object.keys(knowledgeBase);

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [conversationStarted, setConversationStarted] = useState(false);

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (input.trim()) {
      addMessage(input, 'user');
      await handleQuery(input);
      setInput('');
    }
  };

  const startConversation = () => {
    setConversationStarted(true);
    addMessage("Start Conversation", 'user');
    setTimeout(() => {
      addMessage('Welcome! How can I assist you today?', 'bot');
    }, 1000);
  };

  const handlePredefinedQuestionClick = async (question) => {
    addMessage(question, 'user');
    await handleQuery(question);
  };

  const addMessage = (text, type) => {
    setMessages((prevMessages) => [...prevMessages, { text, type }]);
  };

  const handleQuery = async (query) => {
    const predefinedAnswer = knowledgeBase[query];
    if (predefinedAnswer) {
      addMessage(predefinedAnswer, 'bot');
    } else {
      const geminiResponse = await queryGemini(query);
      addMessage(geminiResponse, 'bot');
    }
  };

  const queryGemini = async (query) => {
    try {
      const response = await axios.post('http://localhost:8000/gemini', { message: query });
      const data= await response.text()
      // return response.data.reply; 
      setChatHistory(oldChatHistory => [...oldChatHistory , {
        role: 'assistant',
        parts: input
      },
      {
        role: 'user',
        parts: query
      }
    ])
    setMessages("")
    } catch (error) {
      console.error('Error communicating with the backend:', error);
      return 'Sorry, I could not retrieve a response at the moment.';
    }
  };

  const handleFeedback = async (messageIndex, feedback) => {
    const message = messages[messageIndex].text;
    try {
      await axios.post('http://localhost:3000/feedback', { message, feedback });
      addMessage(`Thank you for your feedback!`, 'bot');
    } catch (error) {
      console.error('Error sending feedback:', error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.headerTitle}>
          <ChatIcon style={styles.icon} />
          Headstarter Chatbot
        </h2>
        <p style={styles.headerDescription}>
          Hello, Welcome to Headstarter Chatbot of Headstarter AI. How can I assist you?
        </p>
      </div>

      {!conversationStarted ? (
        <div style={styles.startButtonContainer}>
          <Button
            variant="contained"
            onClick={startConversation}
            style={styles.startButton}
            endIcon={<SendIcon style={{ marginLeft: '16px' }} />}
          >
            Start Conversation
          </Button>
        </div>
      ) : (
        <div style={styles.chatContainer}>
          <Box style={styles.predefinedQuestionsContainer}>
            <h3 style={styles.predefinedQuestionsHeader}>Select a Question</h3>
            <List>
              {predefinedQuestions.map((question, index) => (
                <React.Fragment key={index}>
                  <ListItem button onClick={() => handlePredefinedQuestionClick(question)}>
                    <ListItemText primary={question} style={styles.predefinedQuestionText} />
                  </ListItem>
                  {index < predefinedQuestions.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Box>

          <Divider orientation="vertical" flexItem style={styles.verticalDivider} />

          <Box style={styles.chatBox}>
            <div style={styles.chatWindow}>
              {messages.map((msg, index) => (
                <div key={index} style={msg.type === 'user' ? styles.userMessage : styles.botMessage}>
                  {msg.text}
                  {msg.type === 'bot' && (
                    <div style={styles.feedbackContainer}>
                      <Button
                        variant="outlined"
                        size="small"
                        color="success"
                        startIcon={<ThumbsUpIcon />}
                        onClick={() => handleFeedback(index, 'like')}
                      >
                        Like
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        startIcon={<ThumbsDownIcon />}
                        onClick={() => handleFeedback(index, 'dislike')}
                      >
                        Dislike
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <form onSubmit={handleSubmit} style={styles.form}>
              <TextField
                variant="outlined"
                label="Type your message..."
                value={input}
                onChange={handleInputChange}
                style={styles.input}
                InputProps={{
                  style: {
                    borderColor: '#F99312',
                  },
                }}
                InputLabelProps={{
                  style: { color: '#F99312' },
                }}
              />
              <Button type="submit" variant="contained" color="primary" style={styles.button}>
                <SendIcon />
              </Button>
            </form>
          </Box>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    padding: '20px',
    backgroundColor: '#FFFFFF',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    position: 'sticky',
    top: 0,
    backgroundColor: '#F99312',
    color: '#FFFFFF',
    padding: '20px',
    borderRadius: '8px',
    zIndex: 1,
    marginBottom: '10px',
  },
  headerTitle: {
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    fontSize: '24px',
  },
  icon: {
    marginRight: '15px',
    fontSize: '36px',
  },
  headerDescription: {
    margin: 0,
    marginTop: '5px',
    fontSize: '16px',
  },
  startButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  startButton: {
    backgroundColor: '#F99312',
    color: '#FFFFFF',
    padding: '10px 20px',
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
  },
  chatContainer: {
    display: 'flex',
    height: '100%',
    justifyContent: 'space-between',
  },
  predefinedQuestionsContainer: {
    width: '30%',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    padding: '10px',
    maxHeight: 'calc(100vh - 200px)',
    overflowY: 'auto',
  },
  predefinedQuestionsHeader: {
    margin: 0,
    fontSize: '18px',
    color: '#F99312',
  },
  predefinedQuestionText: {
    color: '#000000',
  },
  verticalDivider: {
    margin: '0 20px',
  },
  chatBox: {
    width: '70%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  chatWindow: {
    flex: 1,
    overflowY: 'auto',
    padding: '10px',
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    marginBottom: '10px',
    border: '1px solid #F99312',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#F99312',
    color: '#FFFFFF',
    padding: '10px 15px',
    borderRadius: '8px',
    margin: '5px 0',
    maxWidth: '60%',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    color: '#333',
    padding: '10px 15px',
    borderRadius: '8px',
    margin: '5px 0',
    maxWidth: '60%',
    border: '1px solid #F99312',
  },
  form: {
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    marginRight: '10px',
  },
  button: {
    backgroundColor: '#F99312',
    color: '#FFFFFF',
    padding: '10px',
  },
  feedbackContainer: {
    marginTop: '10px',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
  },
};

export default Chatbot;
