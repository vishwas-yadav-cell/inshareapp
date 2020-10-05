const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const File = require('../models/file');
const { v4: uuid4 } = require('uuid');

// file-configuration like destination(path) and filename and store in our uploads folder:
let storage = multer.diskStorage({
    // destination:
    destination: (req, file, cb) => cb(null, 'uploads/'),

    // filename:
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

let upload = multer({
    // storage variable:
    storage,

    // size limit of the file:
    limit: { fileSize: 100000 * 100 },
}).single('myfile'); //myfile is a key identifier

router.post('/', (req, res) => {

    // Store file
    upload(req, res, async (err) => {
        // Validate request:->

        // if no file:
        if (!req.file) {
            return res.json({ error: 'All fields are required.' });
        }

        // if got some error:
        if (err) {
            return res.status(500).send({ error: err.message });
        }

        // Store into Database:
        const file = new File({
            filename: req.file.filename,
            uuid: uuid4(),
            path: req.file.path,
            size: req.file.size,
        });

        // saving the data into database:
        const response = await file.save();

        // Response -> link
        return res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` });
    })

});

// email sending route:
router.post('/send', async(req,res)=>{
    const {uuid, emailTo, emailFrom} = req.body;

    if (!emailTo || !emailFrom || !uuid) {
        return res.status(422).send({error:"All fields are required."});
    }

    const file = await File.findOne({uuid:uuid});

    // if (file.sender) {
    //     return res.status(422).send({error:'Email already sent.'});
    // }

    file.sender = emailFrom;
    file.receiver = emailTo;

    const response = await file.save();

    // send email:
    const sendMail = require('../services/emailService');

    sendMail({
        from: emailFrom,
        to:emailTo,
        subject:'inShare file sharing',
        text:`${emailFrom} shared a file with you.`,
        html:require('../services/emailTemplate')({
            emailFrom:emailFrom,
            downloadLink:`${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size: parseInt(file.size/1000)+' KB',
            expires:'24 hours'
        })
    });

    return res.send({success:true});
});

module.exports = router;