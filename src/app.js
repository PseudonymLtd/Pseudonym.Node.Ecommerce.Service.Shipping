const Framework = require('pseudonym.node.ecommerce.library.framework');
const ${{servicename}}Controller = require('./controllers/${{servicename_lowercase}}');

const serviceRunner = new Framework.Service.Runner('${{servicename}} Service');

serviceRunner.RegisterController('/api', new ${{servicename}}Controller());

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

serviceRunner.Start(${{serviceport}});