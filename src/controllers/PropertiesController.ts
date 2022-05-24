import { Prisma, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { IpcNetConnectOpts } from "net";
import Scrapper from "../scrapper";
import sites from "../sites";
import NeihborhoodsController from "./NeihborhoodsController";

const prisma = new PrismaClient();

interface IWebsiteData {
  id: string;
  nome: string;
  url_base: string;
  url_imoveis: string;
  district: string;
  state: string;
  tags: {
    property_tags: string[];
    card_body: string;
    neighborhood_tag: string;
    price_tag: string;
    property_url_tag: string;
  };
}

type IPropertyData = {
  district: string;
  price: number;
  url: string;
};

export default class PropertiesController {
  static async getAllProperties(req: Request, res: Response) {
    try {
      const allProperties = await prisma.property.findMany();
      res.status(200).json(allProperties);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  static async checkIfPropertyAlredyExists(url: string) {
    try {
      const response = await prisma.property.findFirst({
        where: {
          url: url,
        },
      });
      if (response !== null) {
        return true;
      }
      return false;
    } catch (error) {
      return error;
    }
  }

  static async searchPropertiesInWebsites() {
    try {
      const response = await Promise.all(sites.map((item) => Scrapper(item)));
      
      return response.flat();
    } catch (error) {
      return error;
    }
  }

  static async insertProperty() {
    try {
      const websitesContent =
      await this.searchPropertiesInWebsites() as IPropertyData[];

      websitesContent.map(async (property: IPropertyData) => {
        const neighborhood_id = await NeihborhoodsController.getDistrictByName(
          property.district
        );
        const result = await this.checkIfPropertyAlredyExists(property.url);

        if (result !== true && property.price !== 0 && neighborhood_id) {
          let propertyDataWithDistrictId: Prisma.propertyCreateInput = {
            district: {
              connect: { id: neighborhood_id?.id },
            },
            price: property.price,
            url: property.url,
          };

          await prisma.property.create({
            data: propertyDataWithDistrictId,
          });
        }
      });

      await prisma.$disconnect();
      return { message: "Property inserted!" };
    } catch (error) {
      return error;
    }
  }

  static async executePropertySearch(req: Request, res: Response) {
    try {
      const searchResponse = await PropertiesController.insertProperty();
      res.json(searchResponse);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "An error has ocurred" });
    }
  }
}
