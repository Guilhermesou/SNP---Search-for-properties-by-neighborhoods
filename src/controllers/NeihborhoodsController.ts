import { PrismaClient } from "@prisma/client";
import { Request, Response, Application } from "express";
("express");
const prisma = new PrismaClient();

export default class NeihborhoodsController {
  static async getNeihborhoods(req: Request, res: Response) {
    const bairros = await prisma.district
      .findMany({
        select: {
          id: true,
          name: true,
          location: true,
        },
        
      })
      .catch((e: any) => {
        throw e;
      })
      .finally(async () => {
        await prisma.$disconnect();
      });
    const valores_medios = await prisma.property.groupBy({
      by: ["districtId"],
      _avg: {
        price: true,
      },
    });
    

    const mappedNeigh = bairros.map((bairros: any) => {
      
      return {
        ...bairros,
        average: valores_medios.find(
          (id: { districtId: string }) => bairros.id === id.districtId
        )?._avg.price,
      };
    });
    res.header("Access-Control-Allow-Origin", "*");
    res.json({
      success: true,
      payload: mappedNeigh,
    });
  }

  static async getOneNeihborhood(req: Request, res: Response) {
    res.status(200).send({ message: "Implementing this route" });
  }

  static async getDistrictByName(name: string) {
    const bairro = await prisma.district
      .findFirst({
        where: {
          name: {
            contains: name,
            mode: "insensitive"
          }
        },
        select: {
          id: true,
          name: true,
        },
      })
      .catch((e: any) => {
        throw e;
      })
      .finally(async () => {
        await prisma.$disconnect();
      });
      return bairro;
  }

  static async getNeihborhoodByName(req: Request, res: Response) {
    try {
      const { name } = req.params;
      const bairro = await NeihborhoodsController.getDistrictByName(name);
      console.log(bairro)
      res.status(200).json(bairro);
      
    } catch (error: any) {
      console.log(error)
      res.status(404).json({ message: "District not found!" });
    }
  }
}
