var express = require('express');
var router = express.Router();
var Page = require('../models/page');
var mongoose = require('mongoose');

/* GET user listing. */
router.get('/pages', function(req, res) {

  var query = {};

  if (req.query) {
    if (req.query.search) {
      query = {
        $text: {
          $search: req.query.search
        }
      };
    } else {
      query = req.query;
    }
  }

  Page.find(query, function(err, pages) {
    if (err) {
      res.status(500)
        .json(err);
      return;
    }
    res.status(200)
      .json(pages);
  });

});

router.get('/pages/:id', function(req, res) {

  Page.findById(req.params.id, function(err, page) {
    if (err) {
      res.status(500)
        .json(err);
      return;
    }

    if (!page) {
      res.status(400)
        .json({
          message: 'Not Found',
          error: 'BadRequest'
        });
      return;
    }

    res.status(200)
      .json(page);

  });
});

router.post('/pages/add', function(req, res) {

  Page.create(req.body, function(err, page) {

    if (err) {
      res.status(500)
        .json(err);
      return;
    }

    res.status(200)
      .json({
        id: page._id,
        success: true,
        message: 'Successfully created page'
      });

  });

});

module.exports = router;
