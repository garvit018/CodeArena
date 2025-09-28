import axios from "axios";

const code = `print("Hello, World!")`;

const base64Encode = (code) => Buffer.from(code).toString("base64");

const base64Code = base64Encode(code);
console.log("Base64 Encoded Code:", base64Code);

const compileCode = async (encodedCode) => {
  try {
    const submissionResponse = await axios.post(
      "https://judge0-ce.p.rapidapi.com/submissions?fields=*",
      {
        language_id: 71, // Python
        source_code: encodedCode,
        stdin: "",
      },
      {
        headers: {
          "x-rapidapi-key":
            "71dd2f88a9mshb19930106ac79bcp175f1ejsnc92887140ab7",
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
          "Content-Type": "application/json",
        },
      }
    );

    const submissionToken = submissionResponse.data.token;
    console.log("Submission Token:", submissionToken);

    await pollSubmissionStatus(submissionToken);
  } catch (error) {
    console.error("Error during submission:", error.message);
  }
};

const pollSubmissionStatus = async (token) => {
  try {
    let statusResponse;
    let statusId;

    do {
      statusResponse = await axios.get(
        `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
        {
          params: {
            base64_encoded: "true",
            fields: "*",
          },
          headers: {
            "x-rapidapi-key":
              "71dd2f88a9mshb19930106ac79bcp175f1ejsnc92887140ab7",
            "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
          },
        }
      );

      statusId = statusResponse.data.status_id;
      console.log("Current Status ID:", statusId);

      if (statusId !== 3) {
        console.log("Submission is still being processed...");
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    } while (statusId !== 3);

    const decodedOutput = Buffer.from(
      statusResponse.data.stdout,
      "base64"
    ).toString("utf-8");
    console.log("Output:", decodedOutput);
  } catch (error) {
    console.error("Error checking submission status:", error.message);
  }
};

compileCode(base64Code);
