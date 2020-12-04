// Write your "projects" router here!

const express = require('express')
const { route } = require('../actions/actions-router')

const Projects = require('./projects-model')

const router = express.Router()

router.get("/api/projects", (req, res) => {
    Projects.get()
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        res.status(500).json({
          errorMessage: "get all - not working",
        });
      });
  });

  //get by id
router.get("/api/projects/:id", validID, (req, res) => {
    res.status(200).json(req.project);
  });
  
  //post
  router.post("/api/projects", validPost, (req, res) => {
    Projects.insert(req.body)
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
  router.delete("/api/projects/:id", validID, (req, res) => {
    Projects.remove(req.project.id)
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
  router.put("/api/projects/:id", [validID, validPost], (req, res) => {
    Projects.update(req.params.id, req.body)
      .then((project) => {
        res.status(200).json(project);
      })
      .catch((err) => {
        res.status(400).json({ error: err });
      });
  });
  
  function validID(req, res, next) {
    Projects.get(req.params.id)
      .then((data) => {
        if (data) {
          req.project = data;
          next();
        } else {
          res
            .status(404)
            .json({ message: "the project with that id does not exist" });
        }
      })
      .catch((err) => {
        res.status(500).json({
          errorMessage: "validID - not working",
          error: err,
        });
      });
  }

  function validPost(req, res, next) {
    if (!req.body) {
      res.status(400).json("missing project data");
    } else if (!req.body.name || !req.body.description) {
      res.status(400).json("you're missing the name");
    } else {
      next();
    }
  }

module.exports = router