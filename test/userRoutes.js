var should = require('should'); 
var request = require('superagent');  
 
describe('user routing', function() {
  var url = 'http://localhost:3000';
  var agent = request.agent();
  var credential = {
    email: 'test@ten20.com',
    password: 'test'
  };

  before(function(done) {
    // wait for server start up
    setTimeout(done, 2000);
  });

  it('should redirect to signin form before authenticated', function(done) {
    request.get(url + '/user')
    .end(function(res) {
      res.should.have.status(200);
      res.redirects[0].should.equal('http://localhost:3000/#signin');
      done();
    });
  });

  it('should create an account success', function(done){
    var credential = {
      email: 'test@ten20.com',
      password: 'test'
    };

    request.post(url + '/signup')
    .send(credential)
    .set('Content-Type', 'application/json')
    .end(function(res) {
      res.should.have.status(200);
      res.body.should.have.property('message');
      res.body.message.should.not.equal('server interal error!');
      done();
    });
  });

  it('should signin success', function(done){
    agent.post(url + '/signin')
    .send(credential)
    .end(function(res) {
      res.should.have.status(200);
      res.body.should.have.property('message');
      res.body.message.should.equal('');
      done();
    });
  });

  it('should get user page success', function(done){
    agent.get(url + '/user')
    .end(function(res) {
      res.should.have.status(200);
      res.text.should.include('activeTracker.current.elevation');
      done();
    });
  });


  it('should get user info success', function(done){
    agent.get(url + '/user/info')
    .end(function(res) {
      res.should.be.json;
      res.should.have.status(200);
      res.body.should.have.property('email');
      res.body.should.have.property('_id');
      done();
    });
  });

  it('should logout success', function(done){
    agent.get(url + '/signout')
    .end(function(res) {
      res.should.have.status(200);
      res.type.should.equal('text/html');
      res.redirects[0].should.equal('http://localhost:3000/');
      done();
    });
  });

  it('should redirect to signin form after signout', function(done) {
    agent.get(url + '/user')
    .end(function(res) {
      res.should.have.status(200);
      res.type.should.equal('text/html');
      res.redirects[0].should.equal('http://localhost:3000/#signin');
      done();
    });
  });
});
