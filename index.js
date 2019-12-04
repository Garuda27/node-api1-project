// implement your API here
const express = require("express");

const db = require("./data/db.js");

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
    res.send({api: "running"});
})

server.get("/api/users", (req, res) => {
    
    db.find()
      .then(users => {
        res.status(200).json(users);
      })
      .catch(error => {
        console.log("error on GET /users", error);
        res
          .status(500)
          .json({ errorMessage: "The users information could not be retrieved." });
      });
  });

  server.post('/api/users', (req, res) => {
    const userData = req.body
    const { name, bio } = userData
    if (!name || !bio) {
        res
            .status(400)
            .json({ errorMessage: 'Request is empty - need name and bio.' })
    } else if (name && bio) {
        db.insert(req.body)
            .then(user => {
        db.findById(user.id)
            .then(foundUser => {
                res.status(200).json(foundUser);
          })
          .catch(() => {
            json
              .status(500)
              .json({ message: 'There was an error retrieving the user' });
          });
      })
      .catch(() => {
        res.status(500).json({
          error: 'There was an error while saving the user to the database'
        });
      });
  }
});

server.get("/api/users/:id", (req, res) => {
    // const userData = req.body;
    const { id } = req.params

    db.findById(id)
        .then(user => {
        if (!user) {
            res.status(404).json({
                message: 'The user with the specified ID does not exist.'
            })
        } else {
                res.status(200).json(user)
            }
        })
        .catch(() => {
            res
                .status(500)
                .json({ error: 'The user information could not be retrieved.' })
        })
  })


  server.delete("/api/users/:id", (req, res) => {
    const id = req.params.id;
  
    db.remove(id)
      .then(removed => {
        if (removed) {
          res.status(200).json({ message: "users removed successfully", removed });
        } else {
          res.status(404).json({ message: "The user with the specified ID does not exist." });
        }
      })
      .catch(error => {
        console.log("error on DELETE /users/:id", error);
        res.status(500).json({ errorMessage: "The user could not be removed" });
      });
  });

  server.put('/api/users/:id', (req, res) => {    
    const { id } = req.params;    
    const user = req.body;
    const { name, bio } = user;
    if (!name || !bio) {
        res
          .status(400)
          .json({ errorMessage: 'Please provide name and bio for the user.' });
      }
      db.update(id, user)
      .then(updatedUser => {        
        if (!updatedUser) {
          res
            .status(404)
            .json({ message: 'The user with the specified ID does not exist.' });
        } else {
          res
            .status(200)
            .json({ message: 'The user information was updated successfully' });
        }
      })
      .catch(() => {
        res
          .status(500)
          .json({ error: 'The user information could not be modified.' });
      });
  });  


const port = 4000;
server.listen(port, () =>
  console.log(`\n ** API running on port ${port} **\n`)
);