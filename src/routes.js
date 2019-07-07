import { Router } from 'express';

import ProjectController from './app/controllers/ProjectController';
import TaskController from './app/controllers/TaskController';

const routes = new Router();

routes.get('/projects', ProjectController.list);

routes.post('/projects/:id/tasks', TaskController.store);

routes.post('/projects', ProjectController.store);

routes.delete('/projects/:id', ProjectController.delete);

routes.put('/projects/:id', ProjectController.update);

export default routes;
