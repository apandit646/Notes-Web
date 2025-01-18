// Logout Functionality
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear token or session data
        localStorage.removeItem('authToken');
        alert('Logged out successfully!');
        window.location.href = '/login'; // Redirect to login page
    }
}

// Contact Form Submission
async function contactBnn(event){
    event.preventDefault(); // Prevent default form submission

    const email = document.getElementById('conEmail').value.trim();
    const complaint = document.getElementById('conText').value.trim();

    if (!email || !complaint) {
        alert('Please fill in all fields');
        return;
    }
    console.log("Email", email, complaint,"com");
    try {
        const response = await fetch('/api/contactUs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, complaint }),
        });
        console.log(response)
        if (response.ok) {
            alert('Complaint submitted successfully!');
            document.getElementById('contactForm').reset(); // Reset the form
        } else {
            console.error('Server error:', response.statusText);
            alert('An error occurred. Please try again later.');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('An unexpected error occurred. Please try again.');
    }
}

// Save Notes Functionality
document.getElementById('saveNoteBtn').addEventListener('click', async (event)=> {
    event.preventDefault();

    const noteContent = document.getElementById('textCon');
    const notes = noteContent.value.trim();
    
    console.log(notes);
    if (!notes) {
        alert('Note cannot be empty.');
        return;
    }

    try {
        const token = localStorage.getItem('authToken'); 
        console.log(token)// Fetch token for authentication
        const response = await fetch('/api/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Pass token in the Authorization header
            },
            body: JSON.stringify({ notes }),
        });

        if (response.ok) {
            alert('Note saved successfully!');
            noteContent.value = ''; // Clear the textarea
        } else {
            console.error('Server error:', response.statusText);
            alert('Failed to save the note. Please try again later.');
        }
    } catch (error) {
        console.error('Error submitting note:', error);
        alert('An unexpected error occurred. Please try again.');
    }
});


