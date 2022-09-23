import React, { Component, Fragment } from 'react';
import Header from './components/Header'
import PizzaForm from './components/PizzaForm'
import PizzaList from './containers/PizzaList'
class App extends Component {

  state = {
    pizzas: [],
    pizzaToEdit: {
      id: null,
      vegetarian: false,
      topping: '',
      size: ''
    }
  }

  componentDidMount() {
    fetch("http://localhost:3000/pizzas")
    .then((resp) => resp.json())
    .then(pizzas => this.setState({pizzas}))
}

editPizza = (pizza) => {
  this.setState({pizzaToEdit: pizza})
}

onChange = (event) => {
  const target = event.target
  const value = target.value
  const name = target.name
  this.setState({
    pizzaToEdit: {...this.state.pizzaToEdit, [name]: value }
  })
}

onSubmit = () => {
  const {pizzas, pizzaToEdit} = this.state
  fetch(`http://localhost:3000/pizzas/${pizzaToEdit.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({...pizzaToEdit})
  })
  .then(res=> res.json())
  .then(newPizza => {
      let pizzaIndex = pizzas.findIndex(pizza => pizza.id === newPizza.id)
      let newPizzas = [...pizzas]
      newPizzas[pizzaIndex] = newPizza
      this.setState({pizzas: newPizzas,
        pizzaToEdit: {
          id: null,
          vegetarian: false,
          topping: "",
          size: ""
        }
      })
    })
}

  render() {
    return (
      <Fragment>
        <Header/>
        <PizzaForm {...this.state.pizzaToEdit} onSubmit={this.onSubmit} onChange={this.onChange}/>
        <PizzaList pizzas={this.state.pizzas} editPizza={this.editPizza}/>
      </Fragment>
    );
  }
}

export default App;
