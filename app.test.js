const app = require("./app")
const request = require('supertest');


beforeEach(()=>{
    // console.log("clean up run..")
    app.resetTodos()
})

describe("health check up ",()=>{
    test("test api call", async()=>{
        const response = await request(app).get("/test")

        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({result:"test api successfully."})
    })
})

describe(" GET /todos api" ,()=>{

    test("return the empty list of todos at first time ",async ()=>{
        const resp = await request(app).get("/todos")
     
        expect(resp.statusCode).toBe(200)
        expect(resp.body).toEqual([])
    })

    test("return todos after create some",async()=>{
       await request(app).post("/todos").send({ title: 'A'})
        await request(app).post("/todos").send({ title: 'B'})

        const response = await request(app).get("/todos")
        // console.log(response.body)
        expect(response.status).toBe(200)
      
        expect(response.body).toHaveLength(2);
        expect(response.body[0].title).toBe('A')
    })
})



describe("GET /todos/:id",()=>{
    test("return one todo ",async()=>{
        await request(app).post("/todos").send({title:"Learn ci"})

        const resp = await request(app).get("/todos/1")

        expect(resp.status).toBe(200)
        expect(resp.body.title).toBe("Learn ci")
    })


    test("return 404 for todo that do not exit",async()=>{
        const resp = await request(app).get("/todos/999")

        expect(resp.status).toBe(404)
        expect(resp.body.error).toBe("Todo not found")
    })

})



describe("POST /todos",()=>{
    test("create todo", async()=>{
        const resp = await request(app).post("/todos").send({title:"Learn testing",isDone:false,Id:1})

        // console.log(resp.status,resp.body)
        expect(resp.status).toBe(201)
        expect(resp.body).toEqual({title:"Learn testing",isDone:false,Id:1})
    })

    test("reject an empty title", async()=>{
         const resp = await request(app).post("/todos").send({title:""})

         expect(resp.status).toBe(400)
         expect(resp.body.error).toBe("Title is required")
    })

    test('rejects a missing title', async () => {
    const res = await request(app).post('/todos').send({});

    expect(res.statusCode).toBe(400);
  });
})



describe("DELETE /todos/:id",()=>{
    test("deletes todos ",async()=>{
      const cr =  await request(app).post("/todos").send({title:"Learn Testing"})

      

        const response = await request(app).delete("/todos/1")

        expect(response.status).toBe(204)

        const check = await request(app).get("/todos/1")
        
        expect(check.status).toBe(404)
    })

    test("returns 404 when deleting a missing todo", async()=>{
        const resp = await request(app).delete("/todos/888")
        expect(resp.status).toBe(404)
    })
})

