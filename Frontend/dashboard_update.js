document.addEventListener("DOMContentLoaded", () => {
    const profData = JSON.parse(localStorage.getItem("professor"));

    if (!profData) {
        alert("Professor not logged in. Redirecting to login.");
        window.location.href = "professor_login.html";
        return;
    }

    // Display professor name
    const nameDiv = document.getElementById("name_tl");
    if (nameDiv) {
        nameDiv.textContent = `Welcome, ${profData.name}`;
    }

    // Fetch all spaces created by the professor
    fetch(`http://localhost:8000/professor/spaces/${profData._id}`, {
        method: "GET",
        credentials: "include"
    })
    .then(res => {
        if (!res.ok) throw new Error("Failed to fetch spaces");
        return res.json();
    })
    .then(spaces => {
        const tbody = document.querySelector("#profTable tbody");
        tbody.innerHTML = ""; // Clear default empty row

        if (spaces.length === 0) {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td colspan="6" style="text-align:center;">No spaces created yet</td>`;
            tbody.appendChild(tr);
            return;
        }

        spaces.forEach((space, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${new Date(space.date).toLocaleString()}</td>
                <td>${space.name}</td>
                <td>${space.description}</td>
                <td>${space.numerOfStudents || 0}</td>
                <td><button onclick="viewSpace('${space._id}')">View Space</button></td>
            `;
            tbody.appendChild(tr);
        });
    })
    .catch(error => {
        console.error("Error loading spaces:", error);
        alert("Failed to load spaces.");
    });

    // Add click listener to "Create Space" button
    const createBtn = document.getElementById("cs_btn");
    if (createBtn) {
        createBtn.addEventListener("click", () => {
            window.location.href = "create_space.html";
        });
    }
});

// Optional: Function to handle "View Space" button (can be expanded)
function viewSpace(spaceId) {
    alert("View Space clicked for ID: " + spaceId);
    // You can later redirect to a detailed space view page with:
    // window.location.href = `view_space.html?id=${spaceId}`;
}
