function frontUpdate(res){
    const input=document.getElementById("input")
    
    fetch("./base2.html").then(response => response.text())
    .then(html =>input.innerHTML = html).then(() => {
        const similarity = document.getElementById("similarity")
        const roll = document.getElementById("roll_number");
        const header= document.getElementById("header");
        similarity.innerText = res.similarity + "%";
        roll.innerText = res.similarity_with;
        header.innerText=res.message;
        if (res.similarity >= 80) {
            header.style.color = "red";
        } else {
            header.style.color = "green";
        }
        ;}) 
.catch(error=>input.innerHTML = `<h1>Error loading content: ${error.message}</h1>`);}

function sendPostreq(){
    event.preventDefault() // Prevent the default form submission behavior
    const a=fetch("http://localhost:8000/",{
        method: "POST",
        headers: {
            "content-Type": "application/json"
        },
        body: JSON.stringify({
            "code": document.getElementById("codeInput").value,
            "roll": document.getElementById("Roll").value,
            "language": document.getElementById("language").value,
        })
    }).then(res=>res.json()).then(res=>{
        frontUpdate(res)
        console.log("succesfully submitted and the similarity is",res.similarity,"%")})
      .catch(error => console.error("Error:", error));
}



const btn1=document.getElementById("submit");
btn1.addEventListener("click", sendPostreq);

const btn2= document.getElementById("adminButton");
btn2.addEventListener("click", () => {
    window.location.href = "http://localhost:8000/admin";
});
