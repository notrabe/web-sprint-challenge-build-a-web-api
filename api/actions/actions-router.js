// Write your "actions" router here!

const express = require('express');

const Actions = require('./actions-model');

const router = express.Router();

//get all
router.get("/api/actions", (req, res) => {
  Actions.get()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(500).json({
        errorMessage: "get all - not working",
      });
    });
});

//get actions in project
router.get("/api/projects/:id/actions", validID, (req, res) => {
  Actions.get()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(500).json([]);
    });
});

//get by id
router.get("/api/actions/:id", validID, (req, res) => {
  res.status(200).json(req.action);
});
//post
router.post("/api/actions", validAction, (req, res) => {
  Actions.insert(req.body)
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ errorMessage: "project post - something went wrong" });
    });
});

//delete
router.delete("/api/actions/:id", validID, (req, res) => {
  Actions.remove(req.action.id)
    .then((data) => {
      res.status(200).json({ message: "successfully deleted!" });
    })
    .catch((err) => {
      res.status(500).json({
        errorMessage: "delete - something went wrong with the delete",
        error: err,
      });
    });
});

//edit/put
router.put("/api/actions/:id", [validID, validAction], (req, res) => {
  Actions.update(req.params.id, req.body)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json({ error: err });
    });
});

//

//middelware
function validID(req, res, next) {
  Actions.get(req.params.id)
    .then((data) => {
      if (data) {
        req.action = data;
        next();
      } else {
        res
          .status(404)
          .json({ message: "the action with that id does not exist" });
      }
    })
    .catch((err) => {
      res.status(500).json({
        errorMessage: "validID - not working",
        error: err,
      });
    });
}

function validAction(req, res, next) {
  if (!req.body) {
    res.status(400).json("missing action data");
  } else if (!req.body.description || !req.body.notes) {
    res.status(400).json("you're missing something");
  } else {
    next();
  }
}

module.exports = router;