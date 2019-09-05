const Framework = require('pseudonym.node.ecommerce.library.framework');
const Shipping = require('../models/shipping');

module.exports = class ShippingController extends Framework.Service.Controller {
    constructor() {
        super('Shipping Controller');

        this.Get('/shipping', (request, response, next) => {
            Shipping.FetchAll((data, err) => {
                if (err !== undefined) { return next(err); }
                response.Ok(data);
            });
        });

        this.Get('/shipping/:id', (request, response, next) => {
            var id = parseInt(request.params.id);
        
            Shipping.Fetch(id, (data, err) => {
                if (err !== undefined) { return next(err); }
                response.Ok(data);
            });
        });

        this.Post('/shipping', (request, response, next) => {
            const shippingIds = request.body;
        
            if (shippingIds.length === 0) { 
                return response.BadRequest('Body did not contain an shipping Ids.');
            }
            
            Shipping.FetchAll((data, err) => {
                if (err !== undefined) { return next(err); }
        
                const filteredshipping = data.filter(p => shippingIds.includes(p.Id));
                const unfoundIds = shippingIds.filter(id => !filteredshipping.map(p => p.Id).includes(id));
        
                if (unfoundIds.length > 0) {
                    response.Partial(filteredshipping, unfoundIds.map(id => `No shipping was found for supplied Id '${id}'`));
                }
                else {
                    response.Ok(filteredshipping);
                }
            });
        });

        this.Put('/shipping', (request, response, next) => {

            const newShipping = new Shipping(
                request.body.name,
                request.body.window,
                request.body.price);
        
            newShipping.Save((data, err) => {
                if (err !== undefined) { return next(err); }
        
                this.Logger.info(`Added new shipping:`);
                console.info(newShipping);
        
                return response.Ok(newShipping, {
                    itemName: data.Name,
                    identifier: data.Id
                });
            });
        });

        this.Put('/shipping/:id', (request, response, next) => {
            var id = parseInt(request.params.id);
        
            Shipping.Fetch(id, (shipping, err) => {
                if (err !== undefined) { return next(err); }
                
                shipping.Name = request.body.name;
                shipping.Window = request.body.window;
                shipping.Price = request.body.price;
        
                shipping.Save((data, err) => {
                    if (err !== undefined) { 
                        return next(err); 
                    }
                    else {
                        this.Logger.info('updated shipping:');
                        console.info(data);
        
                        return response.Ok(data);
                    }
                });
            });
        });

        this.Delete('/shipping/:id', (request, response, next) => {
            var id = parseInt(request.params.id);
        
            Shipping.Fetch(id, (shipping, err) => {
                if (err !== undefined) { return next(err); }
                
                Shipping.Delete((existed, err) => {
                    if (err !== undefined && existed) { 
                        return next(err); 
                    }
                    else if (!existed) {
                        return response.Partial(shipping, {
                            UnexpectedBehaviour: `Record with Id ${request.params.id} has already been deleted, or never existed.`
                        });
                    }
                    else {
                        this.Logger.info(`removed shipping:`);
                        console.info(shipping);
        
                        return response.Ok(shipping);
                    }
                });
            });
        });
    }
}