document.getElementById("codeForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const code = document.getElementById("codeInput").value;
    const roll = document.getElementById("Roll").value;
    const language = document.getElementById("language").value;
    const space_id = document.querySelector("input[name='space_id']").value;

    const response = await fetch("/submit-code", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ code, roll, language, space_id })
    });

    const result = await response.json();
    if (response.status === 200) {
        alert("Code submitted successfully!");
        // Optionally redirect or clear form
    } else {
        alert("Error: " + (result.error || "Submission failed"));
    }
});