import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { load } from "cheerio";
import { Request, Response } from "express";
const prisma = new PrismaClient();

function checkIfAlreadyHaveTextInArray(array: [], text: never) {
    return array.includes(text);
  }
  
  function checkIfTagTextIsvalid(text: any) {
    if (
      typeof(text) === "number" ||
      (text !== null &&
      text !== "" &&
      text.includes("\n") === false &&
      text.length < 200)
    ) {
      return true;
    }
    return false;
  }
  
  function checkIfTagIsMoneyAndReturnFloatNumber(text = "") {
    if (text.includes("R$") === true){
      const moneyValue = text.replace(/[^0-9]/g,'');
      return parseFloat(moneyValue);
    }
    return text;
  }
  
  async function genericSearchProperty() {
    const data = {
      propertyTag: ".listar_destaques",
      propertyNameTags: [
        "h2",
        "h3",
        "p > span",
        "div",
        "h1 > strong",
        "div > p",
        "p",
        "dt",
        "dd",
        ".detalhe",
        ".detalhe2",
        "div > strong"
      ],
      propertyPaginationTags: [""],
      websiteUrl:
        "https://www.amazoniaimoveis.com.br/imoveis/imoveis.php",
    };
  
    const properties: any[][] = [];
    let next = true;
    if (next === true) {
      await axios(data.websiteUrl).then((pageContent: { data: any; }) => {
        const $ = load(pageContent.data);
  
        $(data.propertyTag, pageContent.data).each(function () {
          const prevData: [] = [];
          
          data.propertyNameTags.map((tag) => {
            const textoDaTag = $(this).find(tag).last().text();
            const hrefAttr = $(this).find("a").first().attr("href");
            const title = $(this).find("a").first().attr("title");
  
            if (
              checkIfTagTextIsvalid(hrefAttr) &&
              checkIfAlreadyHaveTextInArray(prevData, hrefAttr) === false
            ) {            
              prevData.push(hrefAttr);
              prevData.push(title);
            }
            const value = checkIfTagIsMoneyAndReturnFloatNumber(textoDaTag);
            console.log("Valor: " + value + "\nTipo: " + typeof(value))
            if (
              checkIfTagTextIsvalid(value) &&
              checkIfAlreadyHaveTextInArray(prevData, value) === false
            ) {
              prevData.push(value);
            }
          });
  
          /*if (prevData.length !== 0) {
            
          }*/
          properties.push(prevData);
        });
        next = false;
      });
    }
    return properties;
  }

export default class PropertiesController {
    
    static async insertProperty(req: Request, res: Response) {
        const data = req.body;
        await prisma.property.createMany({
            data: data,
            
        }
        ).catch((error: Error) => {
            res.status(500).send({error});
        }).finally(async () => {
            await prisma.$disconnect();
        });
        res.status(201).send({message: 'Dados inseridos com sucesso!'})
    }
}