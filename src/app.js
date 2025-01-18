const express = require('express');
const path = require('path');
const hbs = require('hbs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const { ObjectId } = mongoose.Types; // Import ObjectId from mongoose.Types




const app = express();
const port = process.env.PORT || 5000;



// Define paths for templates and static files
const public_path = path.join(__dirname, '../public');
const template_path = path.join(__dirname, '../templates/views');
const partials_path = path.join(__dirname, '../templates/partials');
console.log(partials_path);
// Set up Handlebars as the view engine and specify the views directory
app.set('view engine', 'hbs');
app.set('views', template_path);
hbs.registerPartials(partials_path);


// Middleware for serving static files
app.use(express.urlencoded({ extends: false }))
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(express.static(public_path));



const algorithm = 'aes-256-cbc';
const secretKey = crypto.createHash('sha256').update(String('your-secret-key')).digest('base64').substr(0, 32);
const iv = crypto.createHash('sha256').update(String('your-fixed-iv')).digest('base64').substr(0, 16);


function encrypt(text) {
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), Buffer.from(iv));
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}
//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
// Function to decrypt data
function decrypt(encryptedText) {
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), Buffer.from(iv));
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}


mongoose.connect('mongodb://localhost:27017/NotesWeb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB...'))
    .catch((err) => console.error('Failed to connect to MongoDB:', err));

// Define schemas
// Schema for sign-in data
const signiSchema = new mongoose.Schema({
    first_name: { type: String },
    last_name: { type: String },
    email: { type: String },
    phone: { type: String },
    age: { type: String },
    password: {
        type: String,
        set: encrypt, // Encrypt the password before saving
        get: decrypt
    },

});

// Schema for complaint data
const complaintSchema = new mongoose.Schema({
    email: { type: String },
    complaint: { type: String }
});

const notesData = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'SigninData', required: true },
    date: { type: String },
    note: { type: String },
});




// Define models
const SigninData = mongoose.model('SigninData', signiSchema);
const ComplaintData = mongoose.model('ComplaintData', complaintSchema);
const NotesData = mongoose.model('NotesData', notesData);
signiSchema.set('toObject', { getters: true })
signiSchema.set('toJSON', { getters: true })

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract Bearer token
    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired token." });
        }
        req.user = user; // Attach user data (including userId) to the request
        next();
    });
};



app.get('/', (req, res) => {
    res.render('index');
});
//signup page sending database
app.post('/api/register', async (req, res) => {
    const { firstName, lastName, email, phone, age, password, confirmPassword } = req.body

    console.log(req.body)
    try {
        if (!firstName || !lastName || !email || !phone || !age || !password || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords don't match" });
        }

        const signupUser = new SigninData({ firstName, lastName, email, phone, age, password });
        // console.log(newUser);

        // Save user to database
        await signupUser.save();
        res.status(200).json({ message: "rigristration  submitted successfully!" });

    } catch (error) {
        console.error("Error saving registration data :", error);
        return res.status(500).json({ message: "Internal server error" });
    }

});

//login page
app.get('/login', (req, res) => {

    res.render('login');
});
app.post('/api/login', async (req, res) => {
    const body = req.body;

    if (!body.email || !body.password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const user = await SigninData.findOne({ email: body.email });

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        console.log(user.password);

        if (user.password !== body.password) { // Ensure decryption matches
            return res.status(401).json({ message: "Incorrect password" });
        }

        // Generate token
        const token = jwt.sign({ id:user._id.toString(), email: user.email }, secretKey, { expiresIn: '3000s' });
         const id = user._id.toString()
        // Return token and other data
        return res.status(200).json({
            message: "Login successful",
            token,
            id,
            redirectTo: "/notes",
            
            
        });
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ message: "Server error" });
    }
});


//contactus
app.get('/contactUs', (req, res) => {
    res.render('contactUs');
});

// data handling
app.post('/api/contactUs', async (req, res) => {
    const { email, complaint } = req.body;

    try {
        if (!email || !complaint) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const complainUser = new ComplaintData({ email, complaint });
        // console.log(newUser);

        // Save user to database
        await complainUser.save();
        res.status(200).json({ message: "Complaint submitted successfully!" });
    } catch (error) {
        console.error("Error saving complaint:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

//about page
app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/notes',  async (req, res) => {
    const specificDate = new Date();
    const year = specificDate.getFullYear();
    const month = String(specificDate.getMonth() + 1).padStart(2, '0');
    const day = String(specificDate.getDate()).padStart(2, '0');
    const dateCurrent = `${year}-${month}-${day}`;

    res.render('notes', { dateCurrent });
});

app.post('/api/notes', authenticateToken, async (req, res) => {
    try {
        const { notes } = req.body;
        const user = req.user;
        console.log(user,"user");

        if (!notes || !notes.trim()) {
            return res.status(400).json({ message: "Note cannot be empty." });
        }

        const specificDate = new Date();
        const formattedDate = specificDate.toISOString().split('T')[0]; // YYYY-MM-DD format

        const noteUserData = new NotesData({
            userId: req.user.id,
            date: formattedDate,
            note: notes.trim(),
        });

        await noteUserData.save();
        res.status(200).json({ message: "Note submitted successfully!" });
    } catch (error) {
        console.error("Error saving note:", error.message);
        res.status(500).json({ message: "Failed to save the note. Please try again later." });
    }
});



app.get('/notesHistory', (req, res) => {
    res.render('notesHistory', {

    });
});

app.get('/api/notesHistory', authenticateToken, async (req, res) => {
    try {
        const user = req.user; // Assuming the middleware sets `req.user`
        const userId = user.id;
        console.log('User ID:', userId);

        const notesHistory = await NotesData.find({ userId: userId });
        console.log('Notes History:', notesHistory);

        res.status(200).json(notesHistory);
    } catch (error) {
        console.error('Error fetching notes history:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.delete('/api/notesHistory',authenticateToken,async(req, res)=>{
    const body = req.body;
    console.log(body);
    const id = body.id;
    console.log(id);
    try {
        await NotesData.findByIdAndDelete(id);
        res.status(200).json({ message: "Note deleted successfully!" });
    } catch (error) {
        console.error("Error deleting note:", error.message);
        res.status(500).json({ message: "Failed to delete the note. Please try again later." });
    }
})

app.get('/editnote',(req, res) => {
    const specificDate = new Date();
    const year = specificDate.getFullYear();
    const month = String(specificDate.getMonth() + 1).padStart(2, '0');
    const day = String(specificDate.getDate()).padStart(2, '0');
    const dateCurrent = `${year}-${month}-${day}`;
    res.render('editnote', { dateCurrent });
});

app.put('/api/editnote', authenticateToken, async(req, res) => {

    const  body = req.body; 
    // Use req.body for PUT requests
    console.log('Notes:', body.editNote);
    const id = body.id;  // Use req.body for PUT requests
    

    // Check for missing data
    if (!body.editNote || !id) {
        return res.status(400).json({ message: "Note and id are required" });
    }
    console.log(typeof(id))
   
    const iduser = id.slice(0, -1)

    console.log(iduser,"<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
    console.log('Hello:', iduser);

    try {

        console.log('inside try ',body.editNote);

        
        // Generate current date in YYYY-MM-DD format
        const specificDate = new Date();
        const year = specificDate.getFullYear();
        const month = String(specificDate.getMonth() + 1).padStart(2, '0');
        const day = String(specificDate.getDate()).padStart(2, '0');
        const dateCurrent = `${year}-${month}-${day}`;
        const objid = new ObjectId(iduser);



        // Update the note
        const updatedNote = await NotesData.findByIdAndUpdate(
             objid,
            { date:dateCurrent , note: body.editNote },
            { new: true } // Return the updated document
        );
        // console.log(updatedNote, "updated note");

        // If the note isn't found
        if (!updatedNote) {
            return res.status(404).json({ message: "Note not found" });
        }

        console.log('Updated Note:', updatedNote);
        // Return the updated note
        res.status(200).json({ message: "updated successfully!" });
    } catch (error) {
        console.log("Error updating note:", error.message);
        res.status(500).json({ message: "Failed to update the note. Please try again later." });
    }
});



// Handle 404 errors
app.get('*', (req, res) => {
    res.render('404error', {
        errorMsg: "404 Accured"

    });
});





// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


