import "regenerator-runtime/runtime";
import { dateFormat } from "../src/client/js/app.js";
describe("Testing if The input format of a date is reversed correctly", () => {
  test("date", () => {
    const date = dateFormat("22/03/2021");
    expect(date).toBe("2021-03-22");
  });
});
