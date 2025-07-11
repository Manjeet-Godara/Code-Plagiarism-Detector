function sendPostreq_prof(){
    event.preventDefault(); // Prevent the default form submission behavior
    const a = fetch("http://localhost:8000/professor/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "name": document.getElementById("name").value,
            "email": document.getElementById("email").value,
            "password": document.getElementById("password").value,
        })
    }).then(res => res.json()).then(res => {
        frontUpdate(res);
        console.log("Successfully submitted and the response is", res.message);
    })
    .catch(error => console.error("Error:", error));
}


const btn1 = document.getElementById("submit");
btn1.addEventListener("click", sendPostreq_prof);