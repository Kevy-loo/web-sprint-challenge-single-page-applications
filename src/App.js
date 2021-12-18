import React from "react";
import {Switch, Route, Link} from 'react-router-dom';
import axios from "axios";
import * as yup from 'yup';
import { useState, useEffect } from "react";

const formSchema = yup.object().shape({
  name: yup
  .string()
  .required("name is required")
  .min(2, "name must be at least 2 characters"), 
  dropdown: yup
  .string()
  .required("Please choose a size")
  .oneOf(["firstOption", "secondOption", "thirdOption"]),
  pepperoni: yup.boolean().oneOf([true, false]),
  mushroom: yup.boolean().oneOf([true, false]),
  sausage: yup.boolean().oneOf([true, false]),
  onion: yup.boolean().oneOf([true, false]),
  special: yup.string() 
});

const initialFormState = {
  name: '',
  dropdown: '',
  pepperoni: false,
  mushroom: false,
  sausage: false,
  onion: false,
  special: ''
}

const initialFormErrors = {
  name: '',
  dropdown: '',
  pepperoni: '',
  mushroom: '',
  sausage: '',
  onion: '',
  special: ''
}

const App = () => {

  const [order, setOrder] = useState({});

  const [form, setForm] = useState(initialFormState);


  const [errors, setErrors] = useState(initialFormErrors);
  const [disabled, setDisabled] = useState(true);
  
  const validate = (name, value) => {
    yup
    .reach(formSchema, name)
    .validate(value)
    .then(() => {
      console.log('form is good')
      setErrors({...errors, [name]: ''})
      setDisabled(false)
    })
    .catch((err) => {
      console.log(err.errors)
      setErrors({...errors, [name]: err.errors[0]})
      setDisabled(true)
      console.log('form is not good')
    })
    
  }
  
  
  
  const submitHandler = (evt) => {
    evt.preventDefault();
    axios.post('https://reqres.in/', form)
    .then((res) => {
      console.log(res.data)
      setOrder(res.data)
      setForm(initialFormState)
      
    }).catch(console.log('error'))
  }
  
  
  
  
  const changeHandler = (evt) => {
    const value = evt.target.type === 'checkbox' ? evt.target.checked : evt.target.value;
    setForm({...form, [evt.target.name]: evt.target.value });
    validate(evt.target.name, value)
    
    
    
    
  }

  
  return (
    <>
      <h1>Lambda Eats</h1>
      <nav>
        <Link to="/pizza" id="order-pizza">Order</Link>
      </nav>
      <Switch>
        <Route exact path="/pizza">
          <form id="pizza-form" onSubmit={submitHandler} >
            <label>
              Name
              <input
              onChange={changeHandler} 
              name="name"
              id="name-input" 
              value={form.name} 
              type="text"/>

            </label>
            <label>
              Size?
              <select
              onChange={changeHandler}
              value={form.dropdown}
              name="dropdown"
              id="size-dropdown"
              >
                <option value="firstOption">Small</option>
                <option value="secondOption">Medium</option>
                <option value="thirdOption">Large</option>
              </select>
            </label>

            <label>
              Pepperoni?
              <input
              onChange={changeHandler}
              type="checkbox"
              id="pepperoni"
              name="pepperoni"
              checked={form.pepperoni}
              />
            </label>

            <label>
              Mushroom?
              <input
              onChange={changeHandler}
              type="checkbox"
              id="mushroom"
              name="mushroom"
              checked={form.mushroom}
              />
            </label>

            <label>
              Sausage?
              <input
              onChange={changeHandler}
              type="checkbox"
              id="sausage"
              name="sausage"
              checked={form.sausage}
              />
            </label>

            <label>
              Onion?
              <input
              type="checkbox"
              onChange={changeHandler}
              id="onion"
              name="onion"
              checked={form.onion}
              />
            </label>

            <label>
              Special Instructions?
              <input
              name="special"
              onChange={changeHandler} 
              value={form.special} 
              id="special-text" 
              type="text"/>
            </label>


            <button id="order-button" type="submit" disabled={disabled}>Submit Order</button>

          </form>

        </Route>
      </Switch>
      <p>{order.name}</p>

      <p>You can remove this code and create your own header</p>
    </>
  );
};
export default App;
