const express = require ('express')
const uuid = require("uuid")

const port = 3000
const app = express ()
app.use(express.json())

/*
        - Query Params -> meusite.com/users?name=fulco&age=32 // Filtros  [aplica-se normalmente no URL]
        - Route Params -> /users/2          // Buscar, deletar ou atualizar algo específico
        - Request Body -> {"name":"Fulco", "age":}    // O Request no body é no formato json!
     const { name, age } = request.query     // <-Destructuring Assigment ( desconstruindo variaveis )

     - GET -> Buscar informação no back-end
     - POST -> Criar informação bno back-end
     - PUT / PATCH -> Alterar/Atualizar informação no back-end
     - DELETE -> Deletar informação no back-end

     - Middleware -> INTERCEPTADOR -> Tem o poder de parar ou alterar dados da requisição

*/ 

const users = []

const checkUserId = ( request, response, next) => {       // <- isso é um MIDLLEWARE (request,response,next) as rotas também são.
    const { id } = request.params
    
    const index = users.findIndex(user => user.id === id)
    
    if(index < 0){
        return response.status(404).json({ error: "User not found"})
    }

    request.userIndex = index
    request.userId = id
  
    next()
}

app.get('/users', (request, response) => {
    return response.json(users)
})  

app.post('/users', (request, response) => {

    const { name, age } = request.body
   
    const user = { id: uuid.v4(), name, age }
   
    users.push(user)
    
    return response.status(201).json(user)
})  

app.put('/users/:id',checkUserId, (request, response) => {
    const { name, age } = request.body
    const index = request.userIndex
    const id = request.userId

    const updatedUser = { id, name, age }


    users[index] = updatedUser

    return response.json(updatedUser)
})

app.delete('/users/:id',checkUserId, (request, response) => {
 
     const index = request.userIndex

    users.splice(index,1)
    
    return response.status(204).json()
})  


app.listen(3000, () => {
    console.log (`Server Started On Port ${port} ⚓`)
})