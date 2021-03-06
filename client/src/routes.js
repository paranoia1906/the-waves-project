import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './components/Home';
import Layout from './hoc/layout';
import RegisterLogin from './components/Register_login';
import Register from './components/Register_login/register';
import AddProduct from './components/User/Admin/add_product';
import ManageCategories from './components/User/Admin/manage_categories';
import ProductPage from './components/Product';
import UpdateProfile from './components/User/update_profile';
import ManageSite from './components/User/Admin/manage_site';

import Shop from './components/Shop';
import UserCart from './components/User/cart';


import UserDashboard from './components/User';
import Auth from './hoc/auth';

import PageNotFound from './components/utils/page_not_found';

const Routes = () => {
    return (
        <Layout>
            <Switch>
                <Route path="/user/cart" exact component={Auth(UserCart, true)} />
                <Route path="/user/dashboard" exact component={Auth(UserDashboard, true)} />
                <Route path="/user/user_profile" exact component={Auth(UpdateProfile, true)} />
                <Route path="/admin/add_product" exact component={Auth(AddProduct, true)} />
                <Route path="/admin/manage_categories" exact component={Auth(ManageCategories, true)} />
                <Route path="/admin/manage_site" exact component={Auth(ManageSite, true)} />

                <Route path="/product_detail/:id" exact component={Auth(ProductPage, null)} />
                <Route path="/register" exact component={Auth(Register, false)} />
                <Route path="/register_login" exact component={Auth(RegisterLogin, false)} />
                <Route path="/Shop" exact component={Auth(Shop, null)} />
                <Route path="/" exact component={Auth(Home, null)} />
                <Route exact component={Auth(PageNotFound)} />

            </Switch>
        </Layout>
    );
};

export default Routes;