function frontUpdate(res){
    document.getElementById("input").style.display="none"
}

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
        //frontend pe show karne k liye yahan ek function daalenge, ya phir let's so some server side rendering
        frontUpdate(res)
        console.log("succesfully submitted and the similarity is",res.similarity)})
      .catch(error => console.error("Error:", error));
}



const btn1=document.getElementById("submit");

btn1.addEventListener("click", sendPostreq);
