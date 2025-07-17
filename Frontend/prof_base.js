//this is to be completed as to be updated accoding to the space details in it
function sendPostreq_prof(event){
    event.preventDefault()
    fetch("http://localhost:8000/professor/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
            "name": document.getElementById("name").value,
            "email": document.getElementById("email").value,
            "password": document.getElementById("password").value,
        })
    }).then(async res => {
        console.log(res.status)
        const data = await res.json();
        if (res.status == 200) {
            // Initiate GET request to server-rendered EJS dashboard
            window.location.href = `http://localhost:8000/professor/dashboard/${data._id}`;
        } else {
            alert("Error: " + data.message);
        }
    }) 
    .catch(error => console.error("Error:", error));
}

const btn1 = document.getElementById("submit");
if(btn1){ 
    btn1.addEventListener("click", sendPostreq_prof); 
}



