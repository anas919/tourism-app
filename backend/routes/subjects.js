const express = require('express');

const Subject = require('../models/subject');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();


router.post('', checkAuth, (req, res, next) => {
  
  const subject = new Subject({
    name: req.body.name,
    teacher_id: req.userData.userId
  });
  subject.save().then(createdSubject => {
    res.status(201).json({
      message : 'Subject added successfully',
      subject: {
        ...createdSubject,
        id: createdSubject._id
      }
    });
  }).catch(error => {
    console.log(error);
    res.status(500).json({
      message: 'Creating a subject failed!'
    });
  });
});

router.put('/:id', checkAuth, (req, res, next) => {

    const subject = new Subject({
      _id: req.body.id,
      name: req.body.name,
      teacher_id: req.userData.userId
    });
    Subject.updateOne({_id: req.params.id, teacher_id: req.userData.userId}, subject).then(result => {
      if (result.nModified > 0) {
        res.status(200).json({message: "Update successful"});
      }else{
        res.status(401).json({message: "Not authorized"});
      }
    }).catch(error => {
      res.status(500).json({
        message: "Couldn\'t update subject!"
      });
    });
  }
);


router.get('', checkAuth, (req, res, next) => {

  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const subjectQuery = Subject.find({ teacher_id: req.userData.userId });
  let fetchedSubjects;
  if (pageSize && currentPage) {
    subjectQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  subjectQuery
    .then(documents => {
      fetchedSubjects = documents;
      return Subject.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Subjects fetched successfully! ",
        subjects: fetchedSubjects,
        maxSubjects: count
      });
    }).catch(error => {
      res.status(500).json({
        message: 'Fetching subjects failed!'
      });
    });
});


router.get('/:id', (req, res, next) => {
  Subject.findById(req.params.id).then(subject =>{
    if (subject) {
      res.status(200).json(subject);
    } else {
      res.status(404).json({message: 'Subject not found:'})
    }
  }).catch(error => {
    res.status(500).json({
      message: 'Fetching subjects failed!'
    });
  });
});

router.delete('/:id', checkAuth, (req, res, next) => {
  Subject.deleteOne({_id: req.params.id, teacher_id: req.userData.userId}).then(result =>{
    if (result.n > 0) {
      res.status(200).json({message: "Deletion successful"});
    }else{
      res.status(401).json({message: "Not authorized"});
    }
  }).catch(error => {
    res.status(500).json({
      message: 'Fetching subjects failed!'
    });
  });
});


module.exports = router;
