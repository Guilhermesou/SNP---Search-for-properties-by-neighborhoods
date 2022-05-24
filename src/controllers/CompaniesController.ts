import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export default class CompaniesController {

    static async getAllCompanies() {
        return await prisma.companies.findMany();
    }
}