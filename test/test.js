var supertest = require("supertest");
var should = require("should");


var server = supertest.agent("http://localhost:3000/healthz");


describe("UNIT TEST for healthz api endpoint",function(){

  it("should healthz api endpoint",function(done){

    server
    .get("/")
    .expect("Content-type",/json/)
    .expect(200) // THis is HTTP response
    .end(function(err,res){
      // HTTP status should be 200
      res.status.should.equal(404);
      // Error key should be false.
    //   res.body.error.should.equal(false);
      done();
    });
  });

});