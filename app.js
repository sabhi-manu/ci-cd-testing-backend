const express = require("express")

const app = express()
app.use(express.json())

let todos = []
let nextID=1

// use to reset the data each time when test take place

 app.resetTodos =()=>{
    todos=[]
    nextID=1
}

app.get("/test",(req,res)=>{
    res.status(200).json({
        result:"test api successfully."
    })
})

app.get("/todos",(req,res)=>{
    res.status(200).json(todos)
})

app.get("/todos/:id",(req,res)=>{
    const todo = todos.find((t)=>t.Id==Number(req.params.id))

    if(!todo){
       return res.status(404).json({error:'Todo not found'})
    }

    res.json(todo)
})



app.post("/todos",(req,res)=>{
    const {title} = req.body
    if(typeof title != "string" || title.trim() === ''){
        return res.status(400).json({ error: 'Title is required' });
    }

    const todo = {Id:nextID++,title,isDone:false}
     todos.push(todo)
     res.status(201).json(todo)
})



app.delete("/todos/:id", (req, res) => {
  const index = todos.findIndex((t) => t.Id === Number(req.params.id))
  if (index === -1) {
    return res.status(404).json({ error: 'Todo not found' })
  }

  todos.splice(index, 1)
  res.status(204).send()
})

module.exports=app
