const path = require('path');
const express=require('express');
const cors=require('cors');
const app=express();
app.use(cors());
const User=require('./model1');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const LDF = require('./LdF.js');
app.use(express.static(path.join(__dirname, '../Frontend')));
//post request to save code

app.post('/', async (req, res) => {
    try {
        const { code, roll, language } = req.body;
        //console.log(code, roll, language);
        if (!code || !roll || !language) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const a= await User.create({
            user: roll,
            code: code,
            language: language})
        
        console.log('Code saved successfully:');

        const User_same_language = await User.find({ language: language });
        let max_similarity = {
            similarity: 0,
            similarity_with: "none"
        };
        let flagged=false
        for (const element of User_same_language) {
            if (element.user !== roll) {
                const similarity = LDF(code, element.code);
                if (max_similarity === null || similarity > max_similarity.similarity) {
                    max_similarity = {
                        similarity: similarity,
                        similarity_with: element.user
                    };
                    if (similarity >= 80) {
                        flagged=true;
                        break;
                    }
                }
            }
        }
        // After finding max_similarity
        await User.findByIdAndUpdate(a._id, {
            similarity: max_similarity.similarity,
            similarity_with: max_similarity.similarity_with,
            flagged: flagged
});
        console.log(max_similarity.similarity," with",max_similarity.similarity_with )
        if(max_similarity.similarity<80){ 
                
                return res.status(200).json({
                    message: 'Code is not plagiarized',
                    similarity:max_similarity.similarity ,
                    similarity_with: max_similarity.similarity_with
                });
            }
        else{
            return res.status(200).json({
                message:"Code is plagiarized",
                similarity:max_similarity.similarity ,
                similarity_with: max_similarity.similarity_with 
            })

        }

    } catch (error) {
        console.error('Error saving code:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.set("view engine", "ejs");
app.set("views", path.resolve("./"));

//get request to see the flagged users

app.get('/admin', async (req, res) => {
    try {
        const users = await User.find({ flagged: true });
        if (users.length === 0) {
            return res.status(200).json({ message: 'No flagged users' });
        }
        res.status(200).render("admin",{
            users:users
        });
    } catch (error) {
        console.error('Error fetching flagged users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// get request to compare two codes side by side
app.get('/compare/:id1/:id2', async (req, res) => {
    try {
        const { id1, id2 } = req.params;
        const user1 = await User.findById(id1);
        const user2 = await User.findById(id2);
        if (!user1 || !user2) {
            return res.status(404).json({ error: 'User not found' });
        }
        else{
            res.status(200).render("compare", {
                code1: user1.code,
                code2: user2.code,
                similarity: LDF(user1.code, user2.code),
        })}}catch (error) {res.status(500).json({ error: 'Internal server error' });}})

app.get('/compare', async (req, res) => {
    try {
        const { roll1, roll2 } = req.query;
        const user1 = await User.findOne({ user: roll1 });
        const user2 = await User.findOne({ user: roll2 });
        if (!user1 || !user2) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).render("compare", {
            code1: user1.code,
            code2: user2.code,
            roll1:user1.user,
            roll2:user2.user,
            similarity: LDF(user1.code, user2.code),
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});



app.listen(8000, () =>console.log("Server is running on port 8000"));