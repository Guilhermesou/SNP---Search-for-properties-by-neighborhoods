import { Router } from 'express';

const routes = Router()


import NeihborhoodsController from './controllers/NeihborhoodsController';

routes.get("/bairros", NeihborhoodsController.getNeihborhoods);
routes.get("/bairros/:id", NeihborhoodsController.getOneNeihborhood);

routes.use((req, res, next) => {
  res.status(404);
  return res.json({
    success: false,
    payload: null,
    message: `Endpoint not found ${req.path}`,
  });
});

export default routes;