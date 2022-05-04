import { PrismaClient } from "@prisma/client";
import { Request, Response, Application } from "express"; 'express';
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
                orderBy: {
                    name: "asc",
                },
            })
            .catch((e: any) => {
                throw e;
            })
            .finally(async () => {
                await prisma.$disconnect();
            });
        const valores_medios = await prisma.property
            .groupBy({
                by: ["districtId"],
                _avg: {
                    value: true,
                },
            })
            .catch((e: any) => {
                throw e;
            })
            .finally(async () => {
                await prisma.$disconnect();
            });

        const mappedNeigh = bairros.map((bairros: any, idx: any) => {
            return {
                ...bairros,
                average: valores_medios.find((id: { districtId: any; }) => idx === id.districtId)?._avg.value,
            };
        });
        res.header("Access-Control-Allow-Origin", "*");
        res.json({
            success: true,
            payload: mappedNeigh,
        });
    }

    static async getOneNeihborhood(req: Request , res: Response) {
        res.status(200).send({message: "Implementing this route"})
    }

    
}


