const express = require('express');
const multer = require("multer");

const Place = require('../models/place');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    callback(error, "../backend/images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    callback(null, name + '-' + Date.now() + '.' +ext);
  }
});

router.post('', checkAuth, multer({storage: storage}).single('image'), (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  console.log('here is the title'+req.body.title);
  console.log('here is the title');
  const place = new Place({
    city: req.body.city,
    start_date: req.body.start_date,
    longitude: req.body.longitude,
    title: req.body.title,
    country: req.body.country,
    latitude: req.body.latitude,
    owner_id: req.userData.userId,
    imagePath: url + '/images/' + req.file.filename
  });
  place.save().then(createdPlace => {
    res.status(201).json({
      message : 'Place added successfully',
      place: {
        ...createdPlace,
        id: createdPlace._id
      }
    });
  }).catch(error => {
    res.status(500).json({
      message: 'Creating a place failed!'
    });
  });
});

router.put(
  '/:id',
  checkAuth,
  multer({ storage: storage }).single('image'),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + '://' + req.get("host");
      imagePath = url + '/images/' + req.file.filename
    }
    const place = new Place({
        _id: req.body.id,
        city: req.body.city,
        start_date: req.body.start_date,
        longitude: req.body.longitude,
        title: req.body.title,
        country: req.body.country,
        latitude: req.body.latitude,
        owner_id: req.userData.userId,
        imagePath: imagePath
    });
    Place.updateOne({_id: req.params.id, owner_id: req.userData.userId}, place).then(result => {
      if (result.nModified > 0) {
        res.status(200).json({message: "Updated successfully"});
      }else{
        res.status(401).json({message: "Not authorized"});
      }
    }).catch(error => {
      res.status(500).json({
        message: "Couldn\'t update the place!"
      });
    });
  }
);


router.get('',(req, res, next) => {

  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const placeQuery = Place.find();
  let fetchedPlaces;
  if (pageSize && currentPage) {
    placeQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  placeQuery
    .then(documents => {
      fetchedPlaces = documents;
      return Place.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Places fetched successfully! ",
        places: fetchedPlaces,
        maxPlaces: count
      });
    }).catch(error => {
      res.status(500).json({
        message: 'Fetching places failed!'
      });
    });
});


router.get('/:id', (req, res, next) => {
  Place.findById(req.params.id).then(place =>{
    if (place) {
      res.status(200).json(place);
    } else {
      res.status(404).json({message: 'Place not found:'})
    }
  }).catch(error => {
    res.status(500).json({
      message: 'Fetching places failed!'
    });
  });
});

router.delete('/:id', checkAuth, (req, res, next) => {
  Place.deleteOne({_id: req.params.id, owner_id: req.userData.userId}).then(result =>{
    if (result.n > 0) {
      res.status(200).json({message: "Deletion successful"});
    }else{
      res.status(401).json({message: "Not authorized"});
    }
  }).catch(error => {
    res.status(500).json({
      message: 'Fetching places failed!'
    });
  });
});


module.exports = router;
