const path = require('path');
const express=require('express');
const cors=require('cors');
const app=express();
app.use(cors({
  origin: 'http://127.0.0.1:5500',  
  credentials: true
}));
//console.log("ENV PORT:", process.env.PORT);
const User=require('./Models/User.js');
const Professor=require('./Models/professor.js');
const Space=require('./Models/Space.js');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const LDF = require('./LdF.js');
app.use(express.static(path.join(__dirname, '../Frontend')));

//to redirect to frontend student page
app.get("/student_signIn/:spaceId", async (req, res) => {
    const spaceId = req.params.spaceId;
    // Render the EJS form and pass spaceId to it
    res.render("student_input", { spaceId });
});

//post request to save code

app.post('/submit-code', async (req, res) => {
    try {
        const { code, roll, language, space_id } = req.body;
        if (!code || !roll || !language || !space_id) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        // Create new user (without space_id)
        const user = await User.create({ user: roll, code, language });

        // Get all users in this space and filter by language
        const space = await Space.findById(space_id).populate('studentIds');
        const User_same_space_language = (space.studentIds || []).filter(u => u.language === language);

        if (User_same_space_language.length <= 1) {
            await Space.findByIdAndUpdate(space_id, {
                $push: { studentIds: user._id },
                $inc: { numerOfStudents: 1 }
            });
            return res.render("student_result_page", {
                similarity: "N/A",
                similarity_with: "Nothing to compare with"
            });
        }

        let max_similarity = {
            similarity: 0,
            similarity_with: "none"
        };
        let flagged = false;
        let code2 = "";
        let roll2 = "";
        for (const element of User_same_space_language) {
            if (element.user !== roll) {
                const similarity = LDF(code, element.code);
                if (max_similarity === null || similarity > max_similarity.similarity) {
                    max_similarity = {
                        similarity: similarity,
                        similarity_with: element.user
                    };
                    code2 = element.code;
                    roll2 = element.user;
                    if (similarity >= 80) {
                        flagged = true;
                        break;
                    }
                }
            }
        }

        await User.findByIdAndUpdate(user._id, {
            similarity: max_similarity.similarity,
            similarity_with: max_similarity.similarity_with,
            flagged: flagged
        });

        await Space.findByIdAndUpdate(space_id, {
            $push: { studentIds: user._id },
            $inc: { numerOfStudents: 1 }
        });

        res.render("student_result_page", {
            similarity: max_similarity.similarity,
            similarity_with: max_similarity.similarity_with
        });
    } catch (error) {
        console.error('Error saving code:', error);
        res.status(500).json({ error: "Internal server error" });
    }})

// GET request for viewing users in a space (for the View Space button)
app.get('/space/:spaceId/view', async (req, res) => {
    try {
        const spaceId = req.params.spaceId;
        // Find the space and populate the studentIds array with user documents
        const space = await Space.findById(spaceId).populate('studentIds');
        if (!space) {
            return res.status(404).send("Space not found");
        }
        const users = space.studentIds || [];
        // For each user, find the user they are similar with and attach their _id
        users.forEach(user => {
            const compareUser = users.find(u => u.user === user.similarity_with);
            user.similarity_with_id = compareUser ? compareUser._id : '';
        });
        // Separate flagged and non-flagged users
        const flagged = users.filter(u => u.flagged);
        const nonFlagged = users.filter(u => !u.flagged);
        res.render('prof_user_list', { flagged, nonFlagged });
    } catch (err) {
        console.error("Error fetching users for this space:", err);
        res.status(500).send("Error fetching users for this space");
    }
}); 


app.set("view engine", "ejs");
app.set("views", path.resolve("./"));


// get request to compare two codes side by side
app.get('/compare/:id1/:id2', async (req, res) => {
    try {
        const { id1, id2 } = req.params;
        const user1 = await User.findById(id1);
        const user2 = await User.findById(id2);
        if (!user1 || !user2) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Calculate similarity if needed
        const similarity = LDF(user1.code, user2.code);
        res.status(200).render("compare", {
            roll1: user1.user,
            code1: user1.code,
            roll2: user2.user,
            code2: user2.code,
            similarity: similarity
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Code for professor registration


app.post('/professor/login', async (req, res) => {
    console.log("Received request to create professor");          //don't render a page here, just set the cookie and return a response and then use that data in the frontend
    const {name,email, password} = req.body;    
    console.log(name,email,password)                  // or just send a success message and redirect to a new page and do whatever you want in the frontend
    const a=await Professor.findOne({email});
    //console.log(a.name)
    if (a){
        if (password==a.password){
            res.status(200).json(a)
        console.log("User already exists");
        }
        else{
            res.status(401).json({message:"wrong password"});
            console.log("wrong password")
        }
    }
    else{
    Professor.create({name, email, password})
    .then(professor => {
       
        res.status(200).json({professor});
    })
    .catch(error => {
        console.error("Error creating professor:", error);
        res.status(500).json({message:"Internal Server Error"});
    }
    );}
     }); 

//to get spaces created 
app.get("/professor/spaces/:profId", async (req, res) => {
    try {
        const professor = await Professor.findById(req.params.profId).populate("spaces_created");
        if (!professor) {
            return res.status(404).json({ message: "Professor not found" });
        }
        res.json(professor.spaces_created);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

//to get the professor dashboard
app.get('/professor/dashboard/:profId', async (req, res) => {
    try {
        const professor = await Professor.findById(req.params.profId).populate("spaces_created");
        if (!professor) {
            return res.status(404).send("Professor not found");
        }
        res.render("prof_dashboard", { professor, spaces: professor.spaces_created });
    } catch (err) {
        res.status(500).send("Server error");
    }
});

// Correct GET route for rendering the create_space page
app.get('/professor/:profId/create_space', async (req, res) => {
    const profId = req.params.profId;
    res.render("create_space", { profId });
});

// Handle space creation POST request
app.post('/professor/:profId/create_space', async (req, res) => {
    try {
        const { name, description, date } = req.body; // include date from form
        const profId = req.params.profId;
        const space = await Space.create({
            name,
            description,
            profId,
            numerOfStudents: 0,
            date
        });
        // Add space to professor's spaces_created array
        await Professor.findByIdAndUpdate(profId, { $push: { spaces_created: space._id } });
        res.redirect(`/professor/dashboard/${profId}`);
    } catch (err) {
        res.status(500).send("Error creating space");
    }
});

// 
const PORT= process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));