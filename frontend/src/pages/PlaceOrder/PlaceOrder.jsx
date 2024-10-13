import React, { useContext, useState , useEffect } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const PlaceOrder = () => {

  const {getTotalCartAmount , token , food_list , cartItems , url} = useContext(StoreContext)

  const [data , setData] = useState({
    firstName:"",
    lastName:"",
    email:"",
    street:"",
    city:"",
    zipcode:"",
    country:"",
    phone:""
  })

  const [payment_type , setPayment_type] = useState("stripe");

  const onchangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({...data , [name]:value}));
  }

  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];
    food_list.map((item)=>{
      if(cartItems[item._id]>0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    })

    let orderData = {
      address:data,
      items: orderItems,
      amount: getTotalCartAmount() + 40,
      payment_type:payment_type,
    }

    let response = await axios.post(url + "/api/order/place" , orderData , {headers:{token}});
    if(response.data.success) {
      const {session_url} = response.data;
      const {redirect_url} = response.data;
      if(redirect_url)
      {
        window.location.replace(redirect_url)
      }
      else{
        window.location.replace(session_url);
      }
    }
    else {
      alert("Error");
    }
    

    
  }

  const navigate = useNavigate();


  useEffect(() => {
    return () => {
      if(!token) {
        navigate('/cart')
      }
      else if(getTotalCartAmount()===0)
      {
        navigate('/cart')
      }
    }
  }, [token])
  

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className='title' > Delivery Information </p>
        <div className="multi-fields">
          <input required name='firstName' onChange={onchangeHandler} value={data.firstName} type="text" placeholder='First name' />
          <input required name='lastName' onChange={onchangeHandler} value={data.lastName} type="text" placeholder='Last Name' />
        </div>
        <input required name='email' onChange={onchangeHandler} value={data.email} type="email" placeholder='Email address' />
        <input required name='street' onChange={onchangeHandler} value={data.street} type="text" placeholder='Street' />
        <div className="multi-fields">
          <input required name='city' onChange={onchangeHandler} value={data.city} type="text" placeholder='City' />
          <input required name='state' onChange={onchangeHandler} value={data.city} type="text" placeholder='State' />
        </div>
        <div className="multi-fields">
          <input required name='zipcode' onChange={onchangeHandler} value={data.zipcode} type="text" placeholder='Pin code' />
          <input required name='country' onChange={onchangeHandler} value={data.country} type="text" placeholder='Country' />
        </div>
        <input required name='phone' onChange={onchangeHandler} value={data.phone} type="text" placeholder='Phone' />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
            <h2>Cart Totals</h2>
            <div>
              <div className="cart-total-details">
                <p>Subtotal</p>
                <p>{getTotalCartAmount() }Rs</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <p>Delivery Fee</p>
                <p>{getTotalCartAmount()===0?0:40}Rs</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <b>Total</b>
                <b>{getTotalCartAmount()===0?0:getTotalCartAmount()+40}Rs</b>
              </div>
              <div className='payment-type' >
              <label onClick={() => setPayment_type("cod")}>
                <input name="payment-type" type="radio" />
                <span class="custom-radio"></span> 
                COD (Cash on delivery)
              </label>
              <label onClick={() => setPayment_type("stripe")}>
                <input name="payment-type" type="radio" defaultChecked />
                <span class="custom-radio"></span> 
                Stripe (Credit/Debit)
              </label>
              </div>
              <button type='submit' >PROCEED TO PAYMENT</button>
            </div>
          </div>
        </div>
    </form>
  )
}

export default PlaceOrder