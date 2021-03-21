// import "regenerator-runtime/runtime";
// import { getRemainingDays } from "../src/server/index";
// describe("Testing if the remaining days from today are right you have to change the value of toBe because the date changes too", () => {
//   test("remainingDays", () => {
//     const days = getRemainingDays("2021/03/24");
//     expect(days).toBe(3);
//   });
// });

import "regenerator-runtime/runtime";
import { dateFormat } from "../src/client/js/app.js";
describe("Testing if The input format of a date is reversed correctly", () => {
  test("date", () => {
    const date = dateFormat("22/03/2021");
    expect(date).toBe("2021-03-22");
  });
});
