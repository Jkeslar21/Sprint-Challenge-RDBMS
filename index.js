const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const knexConfig = {
    client: 'sqlite3',
    connection: {
      filename: './data/project_tracker.sqlite3',
    },
    useNullAsDefault: true, // needed for sqlite
  };
  const db = knex(knexConfig);
  
  const server = express();
  
  server.use(helmet());
  server.use(express.json());

  // Project Routes
  server.post('/api/projects', (req, res) => {
      db('projects')
      .insert(req.body)
      .then(ids => {
          const id = ids[0];
          db('projects')
            .where({ id })
            .first()
            .then(project => {
                res.status(201).json(project);
            })
            .catch(err => {
                res.status(500).json(err)
            })
      })
  })

  server.get('/api/projects', (req, res) => {
    db('projects').then(project => {
        res.status(200).json(project)
    }).catch(err => {
        res.status(500).json(err)
    })
})
  
server.get('/api/projects/:id/actions', (req, res) => {
    const id = req.params.id
    db('projects')
      .where({id})
      .then(project => {
        db('actions')
          .where({project_id: id})
          .then(actions => res.status(200).json({...project[0], actions}))
      })
      .catch(err  => res.status(500).json(err))
  })

// Action Routes

  server.post('/api/actions', (req, res) => { 
    db('actions')
    .insert(req.body)
    .then(id => {
        res.status(201).json(id)
    })
    .catch(err => {
        res.status(500).json(err)
    })
})

server.get('/api/actions', (req, res) => {
    db('actions').then(action => {
        res.status(200).json(action)
    }).catch(err => {
        res.status(500).json(err)
    })
})

server.listen(2100, () =>
  console.log(`\n** Jungle on http://localhost:2100 **\n`)
);

