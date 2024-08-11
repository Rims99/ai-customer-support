"use client"; // Marking the component as a Client Component

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
    setMessages((prevMessages) => [
      ...prevMessages,
      { text, type, feedback: type === 'bot' ? <FeedbackButtons /> : null }
    ]);
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


  // Feedback Buttons Component with Emojis
  const FeedbackButtons = () => {
    const [selected, setSelected] = useState(null);

    const handleClick = (feedback) => {
      setSelected(feedback);
      handleFeedback(feedback);
    };

    return (
      <div style={styles.feedbackContainer}>
        <Button
          variant="outlined"
          style={selected === 'like' ? styles.selectedButton : styles.feedbackButton}
          onClick={() => handleClick('like')}
        >
          👍 Like
        </Button>
        <Button
          variant="outlined"
          style={selected === 'dislike' ? styles.selectedButton : styles.feedbackButton}
          onClick={() => handleClick('dislike')}
        >
          👎 Dislike
        </Button>
      </div>
    );
  };

  // Handle feedback submission
  const handleFeedback = async (feedback) => {
    try {
      await axios.post('/feedback', { feedback });
      console.log('Feedback submitted:', feedback);
    } catch (error) {
      console.error('Error submitting feedback:', error);
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
                  {msg.feedback} {/* This is where feedback buttons with emojis should appear */}
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
    width: '100%',
  },
  predefinedQuestionsContainer: {
    width: '30%',
    paddingRight: '20px',
  },
  predefinedQuestionsHeader: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  predefinedQuestionText: {
    fontSize: '16px',
  },
  chatBox: {
    width: '70%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  chatWindow: {
    flexGrow: 1,
    padding: '10px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
    marginBottom: '10px',
    backgroundColor: '#f0f0f0',
    overflowY: 'auto',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#f0f0f0',
    padding: '10px',
    borderRadius: '15px',
    marginBottom: '10px',
    maxWidth: '60%',
    textAlign: 'right',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#F99312',
    color: '#FFFFFF',
    padding: '10px',
    borderRadius: '15px',
    marginBottom: '10px',
    maxWidth: '60%',
    textAlign: 'left',
  },
  form: {
    display: 'flex',
    flexDirection: 'row',
  },
  input: {
    flex: 1,
    marginRight: '10px',
  },
  button: {
    backgroundColor: '#F99312',
    color: '#FFFFFF',
  },
  feedbackContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '10px',
  },
  feedbackButton: {
    margin: '0 5px',
    backgroundColor: '#FFFFFF',
    color: '#F99312',
    borderColor: '#F99312',
  },
  selectedButton: {
    margin: '0 5px',
    backgroundColor: 'green', // Change to green when selected
    color: '#FFFFFF',
  },
};

export default Chatbot;


