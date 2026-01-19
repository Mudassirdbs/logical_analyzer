const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI('AIzaSyAn2VFHUlpsHrPcpfUft0x4kYYK_1bo50Y');

async function testGemini() {
    try {
        console.log('Testing Gemini API...');
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = "Analyze this sentence: Maria legge un libro.";

        console.log('Sending prompt...');
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log('Success! Response:', text);
    } catch (error) {
        console.error('ERROR:', error.message);
        console.error('Full error:', error);
    }
}

testGemini();
