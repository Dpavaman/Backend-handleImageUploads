const express = require('express');
const fileUpload = require('express-fileupload')
const cloudinary = require('cloudinary');
require('dotenv').config();

const app = express();
cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.API_KEY,
    api_secret : process.env.API_SECRET
})

app.set('view engine', 'ejs')

//middleware
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}))

app.get("/myget", (req, res)=>{
    console.log(req.query);

    res.send(req.query)
})

app.post('/mypost', async (req, res)=>{
    console.log(req.body)
    console.log(req.files)


    let result;
    let imageArray = [];


    // ## Usecase for multiple images

    if(req.files){
        for(let index = 0 ; index < req.files.samplefile.length ; index++){
           result = await cloudinary.v2.uploader.upload(req.files.samplefile[index].tempFilePath, {
                folder : 'users'
            })

            imageArray.push({
                publi_id : result.public_id,
                secure_url : result.secure_url
            })
        }
    }
    
    // ## Simple use case for single image
    
    // let file = req.files.samplefile;
    // result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
    //     folder : 'users'
    // })

    console.log(result)

    const details = {
        firstname : req.body.firstname,
        lastname : req.body.lastname,
        result,
        imageArray
    }
    console.log(details)
    res.send(details)
})

app.get('/mygetform', (req, res)=>{
    res.render('getform')
})
app.get('/mypostform', (req, res)=>{
    res.render('postform')
})

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server is up and running on post ${PORT}`))