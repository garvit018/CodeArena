const axios = require('axios');

// The source code you want to send (in Python for example)
const code = `print("Hello, World!")`;

// Function to base64 encode the source code
const base64Encode = (code) => {
  return Buffer.from(code).toString('base64');
};

// Base64 encode the source code
const base64Code = base64Encode(code);
console.log("Base64 Encoded Code:", base64Code);

// Function to compile the code using Judge0 API
const compileCode = async (encodedCode) => {
  try {
    // Step 1: Create a submission request to Judge0
    const submissionResponse = await axios.post(
      'https://judge0-ce.p.rapidapi.com/submissions?fields=*',
      {
        language_id: 71, // Language ID for Python
        source_code: encodedCode, // Base64 encoded code
        stdin: "", // Optional, if the code expects input
      },
      {
        headers: {
          'x-rapidapi-key': '8fd792c414msha5b799f22d55532p13345ejsnbc9d95444943', // Replace with your API key
          'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
          'Content-Type': 'application/json',
        },
      }
    );

    const submissionToken = submissionResponse.data.token;
    console.log("Submission Token:", submissionToken);

    // Step 2: Start polling the status of the submission
    await pollSubmissionStatus(submissionToken);

  } catch (error) {
    console.error("Error during submission:", error.message);
  }
};

// Function to check submission status
const pollSubmissionStatus = async (token) => {
  try {
    let statusResponse;
    let statusId;

    // Poll the status until it's completed
    do {
      // Step 3: Check the submission status using the token
      statusResponse = await axios.get(
        `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
        {
          params: {
            base64_encoded: 'true', // Tell the API the output is base64 encoded
            fields: '*',
          },
          headers: {
            'x-rapidapi-key': '8fd792c414msha5b799f22d55532p13345ejsnbc9d95444943', // Replace with your API key
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
          },
        }
      );

      statusId = statusResponse.data.status_id;
      console.log("Current Status ID:", statusId);

      // If not completed, wait for 2 seconds and try again
      if (statusId !== 3) {
        console.log("Submission is still being processed...");
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds before checking again
      }

    } while (statusId !== 3); // Status ID 3 means completed

    // If completed, decode and print the output
    const decodedOutput = Buffer.from(statusResponse.data.stdout, 'base64').toString('utf-8');
    console.log("Output:", decodedOutput);

  } catch (error) {
    console.error("Error checking submission status:", error.message);
  }
};

// Run the function to compile and check the code
compileCode(base64Code);
