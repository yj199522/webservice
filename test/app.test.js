const app = require('../app')
// const axios = require('axios');
const request = require("supertest");



// test("GET /healthz", async () => {
//     // expect(1).toBe(1)
// // const post = await Post.create({ title: "Post 1", content: "Lorem ipsum" });

// await expect(app).get("/healthz")
//     .expect(200)
// //     .then((response) => {
// //     // Check type and length
// //     expect(Array.isArray(response.body)).toBeTruthy();
// //     expect(response.body.length).toEqual(1);

// //     // Check data
// //     expect(response.body[0]._id).toBe(post.id);
// //     expect(response.body[0].title).toBe(post.title);
// //     expect(response.body[0].content).toBe(post.content);
//     // });
// });

// describe('Sample Test', () => {
//     it('should test that true === true', () => {
//       expect(true).toBe(true)
//     })
//   })

// describe('Post Endpoints', () => {
// it('should create a new post', async () => {
//     const res = await expect(app)
//     .get('/healthz')
//     expect(res.statusCode).toEqual(200)
// })
// })

// jest.mock('axios');
// mockedAxios.get.mockResolvedValue(fakeResp)
// const axiosSpy = spyOn(mockedAxios, 'get')
// const result = await Users.all()
// expect(result).toEqual(fakeResp)

describe("GET /healthz", () => {
    test("Testing GET API", async() => {
        const response = await request(app).get("/healthz");
        expect(response.body).toEqual("server responds with 200 OK if it is healhty.");
        expect(response.statusCode).toBe(200);
    });
});