import '../imports/startup/accounts-config.js';
import '../imports/ui/body.js';


Router.configure({
    layoutTemplate: 'main'
});

Router.route('/register', {
	name: 'register',
});
Router.route('/account', {
	name: 'account',
});
Router.route('/buscador', {
	name: 'buscador',
});

Router.route('/', {
	name: 'home',
    template: 'home'
});

