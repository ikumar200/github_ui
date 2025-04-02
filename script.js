async function fetchGitHubProfile() {
    const username = document.getElementById("username").value;
    const profileCard = document.getElementById("profile-card");
    const errorMessage = document.getElementById("error-message");
    const loading = document.getElementById("loading");

    if (!username) {
        showError("Please enter a GitHub username!");
        return;
    }

    // Reset UI
    profileCard.classList.remove("visible");
    errorMessage.style.display = "none";
    loading.style.display = "block";

    try {
        const response = await fetch(`github-api-sigma-ochre.vercel.app/github/${username}`);
        const data = await response.json();

        loading.style.display = "none";

        if (response.status === 404 || !data.name) {
            showError("User not found. Please check the username and try again.");
            return;
        }

        // Populate profile data
        document.getElementById("avatar").src = data.avatar || 'https://via.placeholder.com/150';
        document.getElementById("name").textContent = data.name || username;
        document.getElementById("bio").textContent = data.bio || "No bio available";
        document.getElementById("repos").textContent = data.repos || "0";
        document.getElementById("followers").textContent = data.followers || "0";
        document.getElementById("following").textContent = data.following || "0";
        document.getElementById("profile-link").href = data.profileUrl || `https://github.com/${username}`;

        // Show profile with animation
        setTimeout(() => {
            profileCard.classList.add("visible");
        }, 50);

    } catch (error) {
        loading.style.display = "none";
        console.error("Error fetching profile:", error);
        showError("Failed to fetch profile. Please try again later.");
    }
}

function showError(message) {
    const errorMessage = document.getElementById("error-message");
    errorMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    errorMessage.style.display = "block";
    
    // Add shake animation
    errorMessage.style.animation = "none";
    setTimeout(() => {
        errorMessage.style.animation = "shake 0.5s";
    }, 10);
}

// Add shake animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20%, 60% { transform: translateX(-5px); }
        40%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Allow searching with Enter key
document.getElementById("username").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        fetchGitHubProfile();
    }
});
