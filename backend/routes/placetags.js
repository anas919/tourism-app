const express = require('express');

const Placetag = require('../models/placetag');

const router = express.Router();


router.post('', (req, res, next) => {

  const placetag = new Placetag({
    place_id: req.body.place_id,
    tag_id: req.body.tag_id
  });
  placetag.save().then(createdPlacetag => {
    res.status(201).json({
      message : 'Place added successfully',
      placetag: {
        ...createdPlacetag,
        id: createdPlacetag._id
      }
    });
  }).catch(error => {
    res.status(500).json({
      message: 'Creating a place failed!'
    });
  });
});

router.put('/:id', (req, res, next) => {

    const placetag = new Placetag({
      _id: req.body.id,
      place_id: req.body.place_id,
      tag_id: req.body.tag_id
    });
    console.log(placetag);
    Placetag.updateOne({_id: req.params.id}, placetag).then(result => {
      if (result.nModified > 0) {
        res.status(200).json({message: "Update successful"});
      }else{
        res.status(401).json({message: "Not authorized"});
      }
    }).catch(error => {
      res.status(500).json({
        message: "Couldn\'t update!"
      });
    });
  }
);


router.get('',(req, res, next) => {

  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const tagId = req.query.tag_id;
  const placetagQuery = Placetag.find({ tag_id: tagId }).populate(['place_id', 'tag_id']);
  let fetchedPlacetags;
  if (pageSize && currentPage) {
    placetagQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  placetagQuery
    .then(documents => {
      fetchedPlacetags = documents;
      return Placetag.find({ tag_id: tagId }).count();
    })
    .then(count => {
      res.status(200).json({
        message: "Fetched successfully! ",
        placetags: fetchedPlacetags,
        maxPlacetags: count
      });
    }).catch(error => {
      res.status(500).json({
        message: 'Fetching failed!'
      });
    });
});

router.get('/:id', (req, res, next) => {
  Placetag.findById(req.params.id).then(placetag =>{
    if (placetag) {
      res.status(200).json(placetag);
    } else {
      res.status(404).json({message: 'Not found:'})
    }
  }).catch(error => {
    res.status(500).json({
      message: 'Fetching failed!'
    });
  });
});

router.delete('/:id', (req, res, next) => {
  Placetag.deleteOne({_id: req.params.id}).then(result =>{
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
