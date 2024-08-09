'use client'; // Marking the component as a Client Component

import React, { useState } from 'react';
import { TextField, Button, Box, List, ListItem, ListItemText, Divider } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';

// Predefined questions and answers
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
    // Check if the query exists in the predefined knowledge base
    const predefinedAnswer = knowledgeBase[query];
    if (predefinedAnswer) {
      addMessage(predefinedAnswer, 'bot');
    } else {
      // Query OpenAI API for a response
      const openAIResponse = await queryOpenAI(query);
      addMessage(openAIResponse, 'bot');
    }
  };

  const queryOpenAI = async (query) => {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/completions',
        {
          model: 'text-davinci-003', // or another model of your choice
          prompt: query,
          max_tokens: 150, // Adjust the max_tokens based on your needs
          temperature: 0.7, // Adjust the temperature based on desired creativity
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, // Use your OpenAI API key from .env.local
          },
        }
      );
      return response.data.choices[0].text.trim();
    } catch (error) {
      console.error('Error querying OpenAI API:', error);
      return "Sorry, I couldn't retrieve an answer for that right now.";
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
          <Box style={styles.chatBox}>
            <div style={styles.chatWindow}>
              {messages.map((msg, index) => (
                <div key={index} style={msg.type === 'user' ? styles.userMessage : styles.botMessage}>
                  {msg.text}
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
                    borderColor: '#F99312', // Change this to your desired outline color
                  },
                }}
                InputLabelProps={{
                  style: { color: '#F99312' }, // Change label color
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
    color: '#FFFFFF',
  },
  headerDescription: {
    margin: '5px 0 0 0',
    fontSize: '16px',
    color: '#FFFFFF',
  },
  startButtonContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  startButton: {
    backgroundColor: '#FFFFFF',
    color: '#F99312',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
    height: '50px',
    width: '400px',
    borderRadius: '20px',
    fontSize: '15px',
    marginBottom: '30px',
  },
  chatContainer: {
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
  },
  predefinedQuestionsContainer: {
    width: '30%',
    padding: '20px',
    backgroundColor: '#F5F5F5',
    borderRadius: '8px',
    marginRight: '20px',
  },
  predefinedQuestionsHeader: {
    fontSize: '18px',
    color: '#F99312',
    marginBottom: '10px',
  },
  predefinedQuestionText: {
    color: '#333',
  },
  chatBox: {
    display: 'flex',
    flexDirection: 'column',
    width: '70%',
  },
  chatWindow: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#F5F5F5',
    marginBottom: '10px',
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
    marginTop: '10px',
  },
  input: {
    flex: 1,
    marginRight: '10px',
    padding: '0px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#FFFFFF',
    height: '30px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#F99312',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    height: '50px',
  },
};

export default Chatbot;
