const submitBt = document.getElementById('buttonLogin');
const signup_form = document.getElementById('loginForm');

const getInfo = async (event) => {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData(signup_form);
    const formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formObject),
        });

        const result = await response.json();

        if (response.ok) {
            // Store token in localStorage
            localStorage.setItem('authToken', result.token);
            console.log('Token stored:', result.token);
            localStorage.setItem('id', result.id);

            // Redirect user
            window.location.href = result.redirectTo;
        } else {
            alert(result.message || 'Login failed');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};


submitBt.addEventListener('click', getInfo);
