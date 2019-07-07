import express from 'express';

// CRUD - Create, Read, Update, Delete
const projects = [
    {
        id: "1",
        title: 'Novo projeto',
        tasks: ['Nova tarefa']
    }
];

class App {
    constructor() {
        this.server = express();

        this.middlewares();

        this.server.use((req, res, next) => {
            console.time(this.newMethod());
            console.log(`Método ${req.method}; URL ${req.url}`);

            next();

            console.timeEnd('Request');
        });


        this.server.get('/projects', (req, res) => {
            return res.json(projects);
        });

        this.server.get('/projects/:id', this.checkProjectInArray, (req, res) => {
            //const name = req.query.name;
            return res.json(req.project);
        });

        this.server.post('/projects', this.checkProjectExists, (req, res) => {
            const { id, title, tasks } = req.body;

            projects.push({
                id, 
                title, 
                tasks,
            });

            return res.json(projects);
        });

        this.server.put('/projects/:id', this.checkProjectExists, this.checkProjectInArray,  (req, res) => {
            const { id } = req.params;
            const { id: identifier , title, tasks } = req.body; 

            projects[id] = {
                id: identifier, 
                title, 
                tasks
            };

            return res.json(projects);
        });

        this.server.delete('/projects/:id', this.checkProjectInArray, (req, res) => {
            const { id } = req.params;

            projects.splice(id, 1);

            return res.send( req.project);
        });

        this.server.post('/projects/:id/tasks', this.checkTaskExists, (req, res) => {
            const { task } = req.body; 

            const { id } = req.params; 

            projects[id].tasks.push(task);

            return res.send(task);
        });

    }

    newMethod() {
        return 'Request';
    }

    middlewares() {
        this.server.use(express.json());
    }

    checkTaskExists(req, res, next) {
        if(!req.body.task) {
            return res.status(400).json({ error: 'Task is required'});
        }

        return next();
    }

    checkProjectExists(req, res, next) {
        if(!req.body.title) {
            return res.status(400).json({ error: 'Project title is required'});
        }

        return next();
    }

    checkProjectInArray(req, res, next) {

        const project = projects[req.params.id];

        if(!project) {
            return res.status(400).json({ error: 'Project does not exists'});
        }

        req.project = project;

        return next();
    }

}

export default new App().server;