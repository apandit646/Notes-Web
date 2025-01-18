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
async function contactBnn(event) {
    event.preventDefault(); // Prevent default form submission

    const email = document.getElementById('conEmail').value.trim();
    const complaint = document.getElementById('conText').value.trim();

    if (!email || !complaint) {
        alert('Please fill in all fields');
        return;
    }

    try {
        const response = await fetch('/api/contactUs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, complaint }),
        });

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

window.addEventListener('load', async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('Token is missing. Please log in again.');
        return;
    }

    try {
        const response = await fetch('/api/notesHistory', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Pass token in the Authorization header
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const notesHistory = await response.json();
        console.log('Notes History:', notesHistory);

        // Render the notes history in the UI
        renderNotesHistory(notesHistory);
    } catch (error) {
        console.error('Error fetching notes history:', error);
        alert('An error occurred while fetching your notes history. Please try again later.');
    }
});

async function renderNotesHistory(notesHistory) {
    const notesHistoryData = document.getElementById('historyTableBody')
    notesHistoryData.innerHTML = '';
    let num =1
    notesHistory.forEach((notes) => {
        const row = document.createElement('tr');
        row.setAttribute('id', `${notes._id.toString()}`);
        row.innerHTML = `
            <td>${num}</td>
            <td>${notes.date}</td>
            <td>${notes.note}</td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="deleteNote('${notes._id.toString()}')">
                    <i class="fas fa-trash"></i>
                </button>
                <button class="btn btn-sm btn-warning mr-2" onclick="editNote('${notes.note}', '${notes._id.toString()},')">
                    <i class="fas fa-edit"></i>
                 </button>
                 
            </td>
            
        `;
        notesHistoryData.appendChild(row);
        num+=1
    })

}


async function deleteNote(noteId) {

    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('Token is missing. Please log in again.');
        return;
    }
    try{
        const response = await fetch('/api/notesHistory',{
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ id:noteId }),
        })
        if (response.ok) {
            alert('Note deleted successfully');
            document.getElementById(noteId).remove();
        }
    }catch (error) {
        console.error('Server error:', response.statusText);
        alert('Failed to delete the note. Please try again later.');
    }
   
}

async function editNote(note, id) {
    localStorage.setItem('note',note);
    localStorage.setItem('id',id);
    window.location.href = '/editnote';
}