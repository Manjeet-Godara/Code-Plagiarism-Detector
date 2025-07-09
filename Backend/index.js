const express=require('express');
const cors=require('cors');
const app=express();
app.use(cors());
const User=require('./model1');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const LDF = require('./LdF.js');
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
        let max_similarity = null
        User_same_language.forEach(element => {
            if (element.user !== roll) {
                const similarity = LDF(code, element.code);
                //console.log(`Similarity with ${element.user}: ${similarity}%`);

                    if(max_similarity === null || similarity > max_similarity.similarity) {
                        max_similarity = {
                            similarity: similarity,
                            similarity_with: element.user
                        };
                }}
        })
        console.log(max_similarity.similarity," with",max_similarity.similarity_with )
        if(max_similarity.similarity<80){ 
                
                return res.status(200).json({
                    message: 'Code is plagiarized',
                    similarity:max_similarity.similarity ,
                    similarity_with: max_similarity.similarity_with
                });
            }
        else{
            return res.status(200).json({
                message:"Code is not plagiarized",
                similarity:max_similarity.similarity ,
                similarity_with: max_similarity.similarity_with
            })

        }

    } catch (error) {
        console.error('Error saving code:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(8000, () =>console.log("Server is running on port 8000"));