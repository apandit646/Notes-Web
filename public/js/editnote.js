window.addEventListener('load', () => {
    // Retrieve the note data from localStorage
    const notedata = localStorage.getItem('note');

    // Redirect if no note data is found
    if (!notedata) {
        window.location.href = "/notesHistory";
        return; // Prevent further execution
    }

    // Ensure the target element exists and set its value
    const editNoteElement = document.getElementById("editNotee");
    if (editNoteElement) {
        editNoteElement.value = notedata; // Populate the textarea/input with the note data
    } else {
        console.error('Element with ID "editNoteText" not found in the DOM.');
    }
});


const submitBt = document.getElementById('saveNoteBatan');
const getInfo = async (event) => {
    event.preventDefault(); // Prevent default form submission
    const editNote = document.getElementById("editNotee").value;
    console.log(editNote);

    const id = localStorage.getItem('id'); // Ensure the correct key name
    const token = localStorage.getItem('authToken');
    console.log(token) // Check if the token is present

    if (!id || !token) {
        alert('Note ID or token is missing. Please log in and try again.');
        return;
    }

    try {
        await fetch('/api/editnote', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ id:id, editNote:editNote }),
        });
        console.log("success");
        // Redirect to the notes history page
        localStorage.removeItem('note');
        localStorage.removeItem('id');
        window.location.href = "/notesHistory";
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to update the note. Please try again later.');
    }
    

}
submitBt.addEventListener('click', getInfo);
