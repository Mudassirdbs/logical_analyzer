const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI('AIzaSyAn2VFHUlpsHrPcpfUft0x4kYYK_1bo50Y');

async function listModels() {
    try {
        console.log('Listing available models...');

        // Try to fetch models using the REST API directly
        const response = await fetch('https://generativelanguage.googleapis.com/v1/models?key=AIzaSyAn2VFHUlpsHrPcpfUft0x4kYYK_1bo50Y');
        const data = await response.json();

        console.log('Available models:');
        data.models.forEach(model => {
            if (model.supportedGenerationMethods?.includes('generateContent')) {
                console.log(`- ${model.name} (supports generateContent)`);
            }
        });
    } catch (error) {
        console.error('ERROR:', error.message);
    }
}

listModels();
