const path = require('path');

const Framework = require('pseudonym.node.ecommerce.library.framework');
const ShippingController = require('./controllers/shipping');

const serviceRunner = new Framework.Service.Runner('Shipping Service');

serviceRunner.RegisterInfoHealthCheck(new Framework.Service.FileSystemAccessHealthCheck([
    __dirname,
    path.join(__dirname, 'data', 'shipping')
]));

serviceRunner.RegisterController('/api', new ShippingController());

serviceRunner.RegisterPostProcessor((request, response, complete) => {
    return request.app.authenticator.Logout(request, err => {
        if (err) {
            request.app.logger.warn(`Error destroying session: ${err.toString()}`);
            return complete(err);
        }
        else {
            request.app.logger.info('Session Destroyed');
            return complete();
        }
    })
});

serviceRunner.Start(3003);