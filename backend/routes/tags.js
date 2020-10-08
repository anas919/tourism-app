const express = require('express');
const multer = require("multer");

const Tag = require('../models/tag');
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
    callback(error, "../backend/images/tags");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    callback(null, name + '-' + Date.now() + '.' +ext);
  }
});


router.post('', checkAuth, multer({storage: storage}).single('image'), (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  const tag = new Tag({
    name: req.body.name,
    imagePath: url + '/images/tags/' + req.file.filename
  });
  tag.save().then(createdTag => {
    res.status(201).json({
      message : 'Tag added successfully',
      tag: {
        ...createdTag,
        id: createdTag._id
      }
    });
  }).catch(error => {
    res.status(500).json({
      message: 'Creating tag failed!'
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
      imagePath = url + '/images/tags/' + req.file.filename
    }
    const tag = new Tag({
      _id: req.body.id,
      name: req.body.name,
      imagePath: imagePath
    });
    Tag.updateOne({_id: req.params.id}, tag).then(result => {
      if (result.nModified > 0) {
        res.status(200).json({message: "Tag Updated successfuly"});
      }else{
        res.status(401).json({message: "Not authorized"});
      }
    }).catch(error => {
      res.status(500).json({
        message: "Couldn\'t update tag!"
      });
    });
  }
);

router.get('', checkAuth, (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const tagQuery = Tag.find();
  let fetchedTags;
  if (pageSize && currentPage) {
    tagQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  tagQuery
    .then(documents => {
      fetchedTags = documents;
      return Tag.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Tag fetched successfully! ",
        tags: fetchedTags,
        maxTags: count
      });
    }).catch(error => {
      res.status(500).json({
        message: 'Fetching tags failed!'
      });
    });
});

router.get('/:id', (req, res, next) => {
  Tag.findById(req.params.id).then(tag =>{
    if (tag) {
      res.status(200).json(tag);
    } else {
      res.status(404).json({message: 'Tag not found:'})
    }
  }).catch(error => {
    res.status(500).json({
      message: 'Fetching tags failed!'
    });
  });
});

router.delete('/:id', checkAuth, (req, res, next) => {
  Tag.deleteOne({_id: req.params.id}).then(result =>{
    if (result.n > 0) {
      res.status(200).json({message: "Deletion successful"});
    }else{
      res.status(401).json({message: "Not authorized"});
    }
  }).catch(error => {
    res.status(500).json({
      message: 'Fetching tags failed!'
    });
  });
});

module.exports = router;
