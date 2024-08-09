'use client'; // Marking the component as a Client Component

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation

export default function HomePage() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter(); // Initialize the router

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Directly redirect to the chatbot page without authentication
    router.push('/chatbot'); // Redirect to the chatbot page
  };

  return (
    <div style={styles.container}>
      <div style={styles.formBox}>
        <h1 style={styles.heading}>Headstarter AI</h1>
        <p>Welcome to Headstarter AI Customer Support! Please {isLogin ? 'login' : 'sign up'} to continue.</p>
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label>Email:</label>
            <input type="email" name="email" required style={styles.input} />
          </div>
          <div style={styles.inputGroup}>
            <label>Password:</label>
            <input type="password" name="password" required style={styles.input} />
          </div>
          <button type="submit" style={styles.button}>
            {isLogin ? 'Login' : 'Signup'}
          </button>
        </form>
        <button onClick={toggleForm} style={styles.toggleButton}>
          {isLogin ? "Don't have an account? Signup" : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#F5F5F5', // Light Gray background
  },
  formBox: {
    backgroundColor: '#FFFFFF', // White for the form container
    padding: '2.5rem',
    borderRadius: '8px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    width: '400px',
    textAlign: 'center',
  },
  heading: {
    color: '#002147', // Dark Navy for the heading
    margin: '0',
  },
  inputGroup: {
    marginBottom: '1rem',
    textAlign: 'left',
  },
  input: {
    width: '100%',
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    marginTop: '0.25rem',
  },
  button: {
    backgroundColor: '#F99312', // Bright Blue for the button
    color: '#fff',
    padding: '0.5rem',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
    transition: 'background-color 0.3s',
  },
  toggleButton: {
    marginTop: '1rem',
    backgroundColor: 'transparent',
    color: '#F99312', // Bright Blue for toggle button
    border: 'none',
    cursor: 'pointer',
  },
};

// Add hover effect for button
styles.button[':hover'] = {
  backgroundColor: '#007BB8', // Darker Blue for hover effect
};
