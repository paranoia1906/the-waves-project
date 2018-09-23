import React, { Component } from 'react'
import { Helmet } from "react-helmet";
import UserLayout from '../../hoc/user';
import UserProductBlock from '../utils/User/product_block';

import { connect } from 'react-redux';
import { getCartItems, removeCartItem, onSuccessBuy } from '../../actions/user_actions';
import Paypal from '../utils/paypal';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faFrown from '@fortawesome/fontawesome-free-solid/faFrown';
import faSmile from '@fortawesome/fontawesome-free-solid/faSmile';

class UserCart extends Component {

    state = {
        loading: true,
        total: 0,
        showSuccess: false,
        showTotal: false
    }

    componentDidMount() {
        let cartItem = [];
        let user = this.props.user;

        if (user.userData.cart) {
            if (user.userData.cart.length > 0) {
                user.userData.cart.forEach((item) => {
                    cartItem.push(item.id)
                })
                this.props.dispatch(getCartItems(cartItem, user.userData.cart))
                    .then(() => {
                        if (this.props.user.cartDetail.length > 0) {
                            this.calculateTotal(this.props.user.cartDetail);
                        }
                    });
            }
        }

    }

    removeFromCart = (id) => {
        this.props.dispatch(removeCartItem(id))
            .then(() => {
                if (this.props.user.cartDetail.length <= 0) {
                    this.setState({
                        showTotal: false
                    })
                } else {
                    this.calculateTotal(this.props.user.cartDetail);
                }
            })
    }

    calculateTotal = (cartDetail) => {
        let total = 0;
        cartDetail.forEach(item => {
            total += parseInt(item.price, 10) * item.quantity
        })

        this.setState({
            total,
            showTotal: true
        });
    }

    showNoItemMessage = () => (
        <div className="cart_no_items">
            <FontAwesomeIcon icon={faFrown} />
            <div>You have no items in your cart</div>
        </div>
    )

    transactionError = (data) => {
        console.log('Paypal error');
        console.log(data);
    }

    transactionCanceled = () => {
        console.log('Transaction canceled');
    }

    transactionSuccess = (data) => {
        //onSuccessBuy
        this.props.dispatch(onSuccessBuy({
            cartDetail: this.props.user.cartDetail,
            paymentData: data
        })).then(() => {
            if (this.props) {
                this.setState({
                    showTotal: false,
                    showSuccess: true
                })
            }
        })
    }


    render() {
        return (
            <UserLayout>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>User Cart - Waves - Anthony Ledesma</title>
                </Helmet>
                <div>
                    <h1>My Cart</h1>
                    <div className="user_cart">
                        <UserProductBlock
                            products={this.props.user}
                            type="cart"
                            removeItem={(id) => this.removeFromCart(id)}
                        />
                        {this.state.showTotal ?
                            <div>
                                <div className="user_cart_sum">
                                    <div>Total amount: $ {this.state.total}</div>
                                </div>
                            </div>
                            :
                            this.state.showSuccess ?
                                <div className="cart_success">
                                    <FontAwesomeIcon icon={faSmile} />
                                    <div>THANK YOU</div>
                                    <div>YOUR ORDER IS NOW COMPLETE</div>
                                </div>

                                :
                                this.showNoItemMessage()}

                    </div>
                    {this.state.showTotal ?
                        <div className="paypal_button_container">
                            <Paypal
                                toPay={this.state.total}
                                transactionError={(data) => this.transactionError(data)}
                                transactionCanceled={(data) => this.transactionCanceled(data)}
                                onSuccess={(data) => this.transactionSuccess(data)}
                            />
                        </div>
                        : null
                    }
                </div>
            </UserLayout>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(UserCart)
