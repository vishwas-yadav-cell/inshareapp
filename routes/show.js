const router = require('express').Router();
const File = require('../models/file');

router.get('/:uuid', async (req, res) => {
    try {
        // finding the file with the given uuid:
        const file = await File.findOne({ uuid: req.params.uuid });

        // if we haven't found any file with the given uuid:
        if (!file) {
            return res.render('download', { error: 'Link has been expired.' });
        }

        // if we found the file with the given uuid:
        res.render('download', {
            uuid: file.uuid,
            fileName: file.filename,
            fileSize: file.size,
            downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`
        });

    } catch (err) {
        // if we get some error during the running of the upper try block code:
        return res.render('download', { error: 'Something went wrong!' });
    }
});

module.exports = router;