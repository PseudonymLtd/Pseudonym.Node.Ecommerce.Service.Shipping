const Framework = require('pseudonym.node.ecommerce.library.framework');
const dataStore = new Framework.Data.FileDataStore('shipping');

module.exports = class Shipping extends Framework.Models.DataModel
{
    constructor(name, window, price) {
        super();
        this.name = name;
        this.window = window;
        this.price = parseFloat(price);
    }

    get Name() {
        return this.name;
    }

    set Name(value) {
        return this.name = value;
    }

    get Window() {
        return this.window;
    }

    set Window(value) {
        return this.window = value;
    }

    get Price() {
        return this.price;
    }

    set Price(value) {
        return this.price = parseFloat(value);
    }

    Delete(callback) {
        return dataStore.Delete(this.Id, callback);
    }

    Save(callback) {
        return dataStore.Save(this.Id, this, callback);
    }

    static FetchAll(callback) {
        return dataStore.FetchAll(Shipping.Mapper, callback);
    }

    static Fetch(id, callback) {
        return dataStore.Fetch(id, Shipping.Mapper, callback);
    }

    static Mapper(rawJson) {
        const dataObj = JSON.parse(rawJson);
        const obj = new Shipping(dataObj.name, dataObj.window, dataObj.price);
        obj.Id = dataObj.id;
        return obj;
    }
}