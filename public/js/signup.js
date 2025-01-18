const submitBt = document.getElementById('submitBtnn');
const signup_form = document.getElementById('signup_form');

const getInfo = async (event) => {
    event.preventDefault(); // Prevents default form submission

    const formData = new FormData(signup_form);

    // Convert form data to an object
    const formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });

    // Display form data in the console
    console.log('Form Data:', formObject);

    // Example: send form data to a server
    fetch('/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formObject)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Server Response:', data);
            signup_form.reset();
            
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred!');
        });

};

submitBt.addEventListener('click', getInfo);
