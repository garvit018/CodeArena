import React from "react";

function ProblemDescription({ details }) {
  const parseExamples = (rawExamples = []) => {
    const parsed = [];
    let pendingInput = "";
    let pendingExplanation = "";

    for (const raw of rawExamples) {
      const text = String(raw || "").trim();
      if (!text) continue;

      const inputMatch = text.match(
        /Input:\s*(.*?)(?=\s*Output:|\s*Explanation:|$)/i,
      );
      const outputMatch = text.match(/Output:\s*(.*?)(?=\s*Explanation:|$)/i);
      const explanationMatch = text.match(/Explanation:\s*(.*)$/i);

      const input = inputMatch ? inputMatch[1].trim() : "";
      const output = outputMatch ? outputMatch[1].trim() : "";
      const explanation = explanationMatch ? explanationMatch[1].trim() : "";

      if (input && output) {
        parsed.push({ input, output, explanation });
        pendingInput = "";
        pendingExplanation = "";
        continue;
      }

      if (input && !output) {
        pendingInput = input;
        pendingExplanation = explanation || "";
        continue;
      }

      if (!input && output && pendingInput) {
        parsed.push({
          input: pendingInput,
          output,
          explanation: pendingExplanation || explanation,
        });
        pendingInput = "";
        pendingExplanation = "";
        continue;
      }

      if (input || output || explanation) {
        parsed.push({ input, output, explanation });
      }
    }

    return parsed;
  };

  const examples = parseExamples(details.examples || []);

  const constraints = details.constraints || [];

  return (
    <div className="bg-gray-800 rounded-xl p-6 text-white max-h-full overflow-y-auto">
      <h1 className="text-2xl font-bold mb-4 text-white">
        Problem Description
      </h1>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-white mb-2">
          {details.order}. {details.title}
        </h2>
        <span className="inline-block px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-full">
          {details.difficulty}
        </span>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-300 mb-2">Companies</h3>
        <div className="text-gray-400">
          Frequently asked by top tech companies
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-300 mb-3">
          Description
        </h3>
        <p className="text-gray-200 leading-relaxed">{details.description}</p>
      </div>

      {/* Example Handling */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-300 mb-3">Examples</h3>
        {examples && examples.length > 0 ? (
          examples.map((example, index) => (
            <div
              className="bg-gray-700 rounded-lg p-4 mb-4 border border-gray-600"
              key={index}
            >
              <h4 className="text-green-400 font-semibold mb-2">
                Example {index + 1}:
              </h4>
              <div className="space-y-2 text-gray-200">
                <div>
                  <strong className="text-blue-400">Input:</strong>{" "}
                  <code className="bg-gray-600 px-2 py-1 rounded text-sm">
                    {example.input}
                  </code>
                </div>
                <div>
                  <strong className="text-green-400">Output:</strong>{" "}
                  <code className="bg-gray-600 px-2 py-1 rounded text-sm">
                    {example.output}
                  </code>
                </div>
                {example.explanation && (
                  <div>
                    <strong className="text-yellow-400">Explanation:</strong>{" "}
                    <span className="text-gray-300">{example.explanation}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-400 italic">
            No examples available for this problem.
          </div>
        )}
      </div>

      {/* Constraints Handling */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-300 mb-3">
          Constraints
        </h3>
        {constraints.length > 0 ? (
          <ul className="list-disc list-inside space-y-1 text-gray-200">
            {constraints.map((constraint, index) => (
              <li key={index} className="text-sm">
                {constraint}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-400 italic">
            No constraints available for this problem.
          </div>
        )}
      </div>
    </div>
  );
}

export default ProblemDescription;
