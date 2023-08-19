import { PrismaClient } from "@connectfinancial/prisma-database";
import { Yoga } from "../../app";

class YogaComponentsSingleton {
  private static instance: YogaComponentsSingleton;
  private _prismaClient: PrismaClient;
  private _yoga: Yoga;

  public static getInstance(): YogaComponentsSingleton {
    if (!YogaComponentsSingleton.instance) {
      throw new Error("You need to create an instance first.");
    }
    return YogaComponentsSingleton.instance;
  }

  static createInstance(yoga: Yoga) {
    if (!YogaComponentsSingleton.instance) {
      YogaComponentsSingleton.instance = new YogaComponentsSingleton();
    }
    YogaComponentsSingleton.instance._yoga = yoga;
    YogaComponentsSingleton.instance._prismaClient = yoga.prisma;
  }

  get prismaClient(): PrismaClient {
    if (YogaComponentsSingleton.instance) {
      return this._prismaClient;
    }
  }

  get yoga(): Yoga {
    if (YogaComponentsSingleton.instance) {
      return this._yoga;
    }
  }
}

export default YogaComponentsSingleton;
