import classes from "./Cart.module.css";
import Modal from "../UI/Modal";
import { useContext,useState } from "react";
import CartContext from "../store/cart-context";
import CartItem from "./CartItem";
import Checkout from "./Checkout";
import React from "react";

const Cart = (props)=>{
    const [isCheckout,setIsCheckout]=useState(false);
    const [isSubmitting,setIsSubmitting]=useState(false);
    const [didSubmit,setDidSubmit]=useState(false);
    const cartCtx = useContext(CartContext);

    const totalAmount = cartCtx.totalAmount.toFixed(2);
    const hasItems = cartCtx.items.length>0;
    const cartItemRemoveHandler = (id)=>{
        cartCtx.removeItem(id);
    };
    const cartItemAddHandler = item =>{
        cartCtx.addItem({...item,amount:1});
    };
    
    const orderHandler = ()=>{
        setIsCheckout(true);
    };

    const submitOrder = async (userData)=>{
        setIsSubmitting(true);
        await fetch("https://food-app-practice-a7e56-default-rtdb.europe-west1.firebasedatabase.app/orders.json",{
        method:"POST",
        body:JSON.stringify({
            user:userData,
            orderedItems: cartCtx.items
        })
    });
    setIsSubmitting(false);
    setDidSubmit(true);
    cartCtx.clearCart();
    }
    const cartItems = (
    <ul className={classes["cart-items"]}>
        {cartCtx.items.map((item)=>{
            return(
            <CartItem 
            key={item.id}
            name={item.name}
            amount={item.amount}
            price={item.price}
            onRemove={cartItemRemoveHandler.bind(null,item.id)}
            onAdd={cartItemAddHandler.bind(null,item)}
            />
            )
        })}
    </ul>
    );

    const modalActions = (
        <div className={classes.actions}>
            <button className={classes['button--alt']} onClick={props.onHideCart}>Close</button>
            {hasItems && <button className={classes.button} onClick={orderHandler}>Order</button>}
        </div>
    )

    const cartModalContent = (<React.Fragment>
                    {cartItems}
            <div className={classes.total}>
                <span>Total Amount</span>
                <span>{totalAmount}</span>
            </div>
                {isCheckout && <Checkout onCancel={props.onHideCart} onConfirm = {submitOrder}/>}
                {!isCheckout && modalActions}
    </React.Fragment>)
    const isSubmittingModalContent = <p>Sending order data...</p>
    const didSubmitModalContent = (<React.Fragment><p>Succesfully sent the order!</p><div className={classes.actions}><button className={classes.button} onClick={props.onHideCart}>Close</button></div></React.Fragment>)
    return (
        <Modal onHideCart={props.onHideCart}>
            {!isSubmitting && !didSubmit && cartModalContent}
            {isSubmitting && isSubmittingModalContent}
            {didSubmit && didSubmitModalContent}
        </Modal>
    )
};

export default Cart;