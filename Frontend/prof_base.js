//this is to be completed as to be updated accoding to the space details in it
function sendPostreq_prof(event){
    event.preventDefault()
    const a = fetch("http://localhost:8000/professor/login", {
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
            localStorage.setItem("professor", JSON.stringify(data));
            window.location.href = "prof_dashboard.html";}
        else{
            alert("Error: "+data.message);
}
}) 
    .catch(error => console.error("Error:", error));
}

// function for create a new space page
function createSpace(event) {
    event.preventDefault();
    const a=fetch("http://localhost:8000/professor/create",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
            "name":document.getElementById("spaceName").value,
            "description":document.getElementById("description").value
            
    })

}).then(async res => {
    console.log(res.status)
    if (res.status == 200) {
        window.location.href = "prof_dashboard.html";
    }
    else{
        const data= await res.json()
        alert("Error: "+data.message);
    }
}).catch(error => console.error("Error:", error));
}



const btn1 = document.getElementById("submit");
if(btn1){ 
btn1.addEventListener("click", sendPostreq_prof); }



