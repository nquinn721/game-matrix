import { Service, Model, Store, Loader } from "mobx-store-model";
Service.setBaseUrl("http://localhost:5000");

class MainModel extends Model {
  route = "/";
}

class MainStore extends Store {
  constructor() {
    super(MainModel, "mainmodel");
  }
}

export const Main = new MainStore();

Loader.registerStore(Main);
Loader.init();
