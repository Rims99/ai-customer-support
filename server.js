// server.js
const PORT =8000
const express = require('express')
const cors = express('cors')
const app = express()
app.use(cors())
app.use(express.json())
require('dotenv').config()

const { GoogleGenrativeAI} = require('@google/genrative-ai')
const genAI = new GoogleGenrativeAI(process.env.GEMINI_API_KEY)

app.post('/gemini', async (req,res)=>{
    console.log(req.body.history)
    console.log(req.body.message)
    const model = genAI.getGenrativeModel({model:'gemini-pro'})
    const chat =model.startChat({
        history: req.body.history
    })
    const msg = req.body.message
    const result = await chat.sendMessage(msg)
    const response = await result.response
    const text = response.text()
    res.send(text)
}
)

app.listen(PORT, () => console.log('Listening on port ${PORT}'))

// app.use(bodyParser.json());

// // Existing chatbot endpoint
// app.post('/chatbot', async (req, res) => {
//     const userMessage = req.body.message;

//     try {
//         // Call to the Gemini API
//         const response = await axios.post('https://api.gemini.com/v1/chat', {
//             message: userMessage,
//         }, {
//             headers: {
//                 'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`,
//                 'Content-Type': 'application/json',
//             },
//         });

//         const botReply = response.data.reply; // Adjust this based on the actual response structure
//         res.json({ reply: botReply });
//     } catch (error) {
//         console.error('Error communicating with the Gemini API:', error);
//         res.status(500).json({ error: 'Failed to communicate with the chatbot service' });
//     }
// });

// New feedback endpoint
// app.post('/feedback', (req, res) => {
//     const { feedback } = req.body;
//     console.log('Feedback received:', feedback);

//     // You can add logic to save feedback to a file, database, or just console log it
//     res.status(200).send({ message: 'Feedback received' });
// });

