var t = require('tap').test;
var sinon = require('sinon');
var rewire = require('rewire');


var createUserCLI = rewire('../../../lib/user/create');


var create_stub = sinon.stub().callsArgWith(1, null, {user:{id:'name'}, email:'name@famo.us'});
var login_stub = sinon.stub().callsArgWith(1, null, {});
var inquirer_stub = {
    prompt: sinon.stub().callsArgWith(1, {login:true})
};
var error_stub = {
    message: sinon.spy()
};


createUserCLI.__set__('createUser', create_stub);
createUserCLI.__set__('login', login_stub);
createUserCLI.__set__('inquirer', inquirer_stub);
createUserCLI.__set__('famouserror', error_stub);

t(function(t) {
    t.plan(3);


    t.type(createUserCLI, 'function', "bin/user/create module should export a function");

    
    t.test(function(t) {
        t.plan(3);

        createUserCLI();

        setTimeout(function() {
            t.ok(inquirer_stub.prompt.called, "inquirer prompt called for user data");
            t.ok(create_stub.called, "createUser hub-sdk should be called");
            t.ok(login_stub.called, "login hub-sdk should be called");
        }, 100);
    }); 


     t.test(function(t) {
        t.plan(3);

        inquirer_stub.prompt.reset();
        login_stub.reset();
        inquirer_stub.prompt.callsArgWith(1, {});
        createUserCLI.__set__('inquirer', inquirer_stub);

        createUserCLI();

        setTimeout(function() {
            t.ok(inquirer_stub.prompt.called, "inquirer prompt called for user data");
            t.ok(create_stub.called, "createUser hub-sdk should be called");
            t.ok(!login_stub.called, "login hub-sdk should not be called when user declines login prompt");
        }, 100);
    }); 
});
