const { response,request } = require('express')
const express = require('express')
const cors = require('cors')
const morgan = require('morgan');

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('build'))

//En ollut täysin varma mitä kaikkia tokeneita tähän haluttiin, koska osa palauttaa vain numeroita. 
app.use(morgan(`:method :url :status :total-time[4] ms :body`))

morgan.token('body', function(request) {
  let body = JSON.stringify(request.body)
  //console.log(body)
  return body;
});

let persons = [
      
    {    
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },  {    
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"    

    },{    
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"    

    },{    
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"    

    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
}) 

app.get('/api/persons/:id', (request, response) => {
    
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);
    
    if (person) {    
        response.json(person);
     } else {    
         response.status(404).end();
}})


app.get('/info', (req, res) => {
    let date = new Date();
    res.send(`<p>Phonebook has info for ${persons.length} people</p> <br>
    ${date.toString()}`)
}) 

function nameCheck(name) {
  let returnValue = 0;
  let i =0;
  while (returnValue !== true && i < persons.length) {
    returnValue = persons[i].name === name;
    i++;
  }
  return returnValue;
}

app.post('/api/persons', (request, response) => {
    let body = request.body

    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }

    let nameCheckResult = nameCheck(body.name);
    //console.log(nameCheckResult)
    if (nameCheckResult === true) {
        return response.status(400).json({ 
          error: 'name must be unique' 
        })
      }
  
    const person = {
        id: Math.floor(Math.random()*1000000),
        name: request.body.name,
        number: request.body.number
    }
  
    persons = persons.concat(person)
    //console.log(persons)
    response.json(person)
  })

app.delete('/api/persons/:id', (req,res) => {

    let delID =  Number(req.params.id);
    //console.log(delID, typeof(delID))
    persons = persons.filter(person => person.id !== delID)
    res.status(204).end()
  
   
}); 
        
const PORT = process.env.PORT || "https://puhelinluettelo-backend-310.herokuapp.com/"
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})