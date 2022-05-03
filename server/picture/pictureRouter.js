const { Router } = require('express');
const pictureController = require('./pictureController');

const router = Router();

router.get('/', pictureController.test)

router.post('/picture/save', pictureController.savePicture);
router.get('/picture/get/:id', pictureController.getPicture);
router.get('/picture/download/:id', pictureController.downloadPicture);
router.get('/picture/getAll', pictureController.getAllPictures);


module.exports = router;