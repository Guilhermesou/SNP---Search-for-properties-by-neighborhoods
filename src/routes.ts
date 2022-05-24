import { Router } from 'express';

const routes = Router()


import NeihborhoodsController from './controllers/NeihborhoodsController';
import PropertiesController from './controllers/PropertiesController';

routes.get("/bairros", NeihborhoodsController.getNeihborhoods);
routes.get("/bairros/:id", NeihborhoodsController.getOneNeihborhood);
routes.get("/bairros/nome/:name", NeihborhoodsController.getNeihborhoodByName);
routes.get("/properties", PropertiesController.getAllProperties);
routes.put("/properties", PropertiesController.executePropertySearch);

routes.use((req, res, next) => {
  res.status(404);
  return res.json({
    success: false,
    payload: null,
    message: `Endpoint not found ${req.path}`,
  });
});

export default routes;