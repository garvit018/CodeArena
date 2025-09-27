import React from "react";
import "./Workspace.css";

function ProblemDescription({ details }) {
  // Check if the examples and constraints exist and split the text into the appropriate structure.
  const examples = details.examples?.map((example) => {
    const parts = example.split("\n");
    const input = parts.find((part) => part.startsWith("Input:"))?.replace("Input:", "").trim();
    const output = parts.find((part) => part.startsWith("Output:"))?.replace("Output:", "").trim();
    const explanation = parts.find((part) => part.startsWith("Explanation:"))?.replace("Explanation:", "").trim();

    return { input, output, explanation };
  });

  const constraints = details.constraints || [];

  return (
    <div className="problem-desc-container">
      <div className="problem-desc-heading">Description</div>
      <div className="desc-title">
        {details.order}. {details.title}
      </div>
      <div className="desc-difficult" style={{ color: "green" }}>
        {details.difficulty}
      </div>
      <div className="companies-container">
        <div className="problem-companies">Companies</div>
      </div>
      <div className="problem-description">{details.description}</div>

      {/* Example Handling */}
      <div className="problem-examples">
        {examples && examples.length > 0 ? (
          examples.map((example, index) => (
            <div className="example-container" key={index}>
              <div className="example-no">Example {index + 1}:</div>
              <div className="example-desc">
                <strong>Input:</strong> {example.input} <br />
                <strong>Output:</strong> {example.output}
                <br />
                <strong>Explanation:</strong> {example.explanation}
              </div>
            </div>
          ))
        ) : (
          <div>No examples available for this problem.</div>
        )}
      </div>

      {/* Constraints Handling */}
      <div className="constraints-container">
        <div className="constraints">Constraints:</div>
        {constraints.length > 0 ? (
          <ul>
            {constraints.map((constraint, index) => (
              <li key={index}>{constraint}</li>
            ))}
          </ul>
        ) : (
          <div>No constraints available for this problem.</div>
        )}
      </div>
    </div>
  );
}

export default ProblemDescription;
