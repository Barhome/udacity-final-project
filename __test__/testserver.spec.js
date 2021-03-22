import "regenerator-runtime/runtime";
const app = require("../src/server/index");
const request = require("supertest");

// describe("test status and response", () => {
//   it("gets the test endpoint", async (done) => {
//     const response = await request(app).get("/test");

//     expect(response.status).toBe(200);
//     expect(response.body.message).toBe("pass!");
//     done();
//   });
// });

describe("POST /postUserInputs", () => {
  it("tests if it responds with json", (done) => {
    request(app)
      .post("/postUserInputs")
      .send({ destinationCity: "Cairo", destinationCountry: "Egypt" })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });
});
