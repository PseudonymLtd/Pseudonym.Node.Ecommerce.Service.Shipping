const path = require('path');

const Framework = require('pseudonym.node.ecommerce.library.framework');
const ShippingController = require('./controllers/shipping');

const serviceRunner = new Framework.Service.Runner('Shipping Service');

serviceRunner.RegisterController('/api', new ShippingController());

serviceRunner.RegisterPostProcessor((request, response, complete) => {
    return request.Environment.Authenticator.Logout(request, err => {
        if (err) {
            request.Environment.Logger.Warn(`Error destroying session: ${err.toString()}`);
            return complete(err);
        }
        else {
            request.Environment.Logger.Info('Session Destroyed');
            return complete();
        }
    })
});

serviceRunner.Start(3003);