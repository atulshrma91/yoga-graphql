import { PrismaClient } from "@connectfinancial/prisma-database";
import { Yoga } from "../../app";
declare class YogaComponentsSingleton {
    private static instance;
    private _prismaClient;
    private _yoga;
    static getInstance(): YogaComponentsSingleton;
    static createInstance(yoga: Yoga): void;
    get prismaClient(): PrismaClient;
    get yoga(): Yoga;
}
export default YogaComponentsSingleton;
