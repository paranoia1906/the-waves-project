import React, { Component } from 'react';
import UserLayout from '../../../hoc/user';

import FormField from '../../utils/forms/formFields';
import { update, generateData, isFormValid, populateOptionFields, resetFields } from '../../utils/forms/formActions';
import FileUpload from '../../utils/forms/fileupload';

import { connect } from 'react-redux';
import { getBrands, getWoods, addProduct, clearProduct } from '../../../actions/products_actions';
import { Helmet } from "react-helmet";

class AddProduct extends Component {

    state = {
        formError: false,
        formSuccess: false,
        formdata: {
            name: {
                element: 'input',
                value: '',
                config: {
                    label: 'Product name',
                    name: 'name_input',
                    type: 'text',
                    placeholder: 'Enter product name'
                },
                validation: {
                    required: true,
                },
                valid: false,
                touched: false,
                validationMessage: '',
                showlabel: true
            },
            description: {
                element: 'textarea',
                value: '',
                config: {
                    label: 'Product description',
                    name: 'description_input',
                    type: 'text',
                    placeholder: 'Enter product description'
                },
                validation: {
                    required: true,
                },
                valid: false,
                touched: false,
                validationMessage: '',
                showlabel: true
            },
            price: {
                element: 'input',
                value: '',
                config: {
                    label: 'Product price',
                    name: 'price_input',
                    type: 'number',
                    placeholder: 'Enter your price'
                },
                validation: {
                    required: true,
                },
                valid: false,
                touched: false,
                validationMessage: '',
                showlabel: true
            },
            brand: {
                element: 'select',
                value: '',
                config: {
                    label: 'Product brand',
                    name: 'brand_input',
                    options: []
                },
                validation: {
                    required: true,
                },
                valid: false,
                touched: false,
                validationMessage: '',
                showlabel: true
            },
            shipping: {
                element: 'select',
                value: '',
                config: {
                    label: 'Product shipping',
                    name: 'shipping_input',
                    options: [
                        { key: true, value: 'Yes' },
                        { key: false, value: 'No' },
                    ]
                },
                validation: {
                    required: true,
                },
                valid: false,
                touched: false,
                validationMessage: '',
                showlabel: true
            },
            available: {
                element: 'select',
                value: '',
                config: {
                    label: 'Available, in stock',
                    name: 'available_input',
                    options: [
                        { key: true, value: 'Yes' },
                        { key: false, value: 'No' },
                    ]
                },
                validation: {
                    required: true,
                },
                valid: false,
                touched: false,
                validationMessage: '',
                showlabel: true
            },
            wood: {
                element: 'select',
                value: '',
                config: {
                    label: 'Wood material',
                    name: 'wood_input',
                    options: []
                },
                validation: {
                    required: true,
                },
                valid: false,
                touched: false,
                validationMessage: '',
                showlabel: true
            },
            frets: {
                element: 'select',
                value: '',
                config: {
                    label: 'Frets',
                    name: 'frets_input',
                    options: [
                        { key: 21, value: 21 },
                        { key: 22, value: 22 },
                        { key: 23, value: 23 },
                        { key: 24, value: 24 },
                    ]
                },
                validation: {
                    required: true,
                },
                valid: false,
                touched: false,
                validationMessage: '',
                showlabel: true
            },
            publish: {
                element: 'select',
                value: '',
                config: {
                    label: 'Publish',
                    name: 'publish_input',
                    options: [
                        { key: true, value: 'Public' },
                        { key: false, value: 'Hidden' },
                    ]
                },
                validation: {
                    required: true,
                },
                valid: false,
                touched: false,
                validationMessage: '',
                showlabel: true
            },
            images: {
                value: [],
                validation: {
                    required: false
                },
                valid: true,
                touched: false,
                validationMessage: '',
                showlabel: false
            }
        }
    }

    updateFields = (newFormdata) => {
        this.setState({ formdata: newFormdata })
    }

    componentDidMount() {
        const formdata = this.state.formdata;

        this.props.dispatch(getBrands()).then(response => {
            const newFormdata = populateOptionFields(formdata, this.props.products.brands, 'brand');
            this.updateFields(newFormdata);
        })

        this.props.dispatch(getWoods()).then(response => {
            const newFormdata = populateOptionFields(formdata, this.props.products.woods, 'wood');
            this.updateFields(newFormdata);
        })
    }

    resetFieldHandler = (event) => {
        const newFormdata = resetFields(this.state.formdata, 'products');

        this.setState({ formdata: newFormdata, formSuccess: true });
        setTimeout(() => {
            this.setState({
                formSuccess: false
            }, () => {
                this.props.dispatch(clearProduct());
            })
        }, 3000)
    }

    submitForm = (event) => {
        event.preventDefault();

        let dataToSubmit = generateData(this.state.formdata, 'products');
        let formIsValid = isFormValid(this.state.formdata, 'products')

        if (formIsValid) {
            this.props.dispatch(addProduct(dataToSubmit)).then(() => {
                if (this.props.products.addProduct.success) {
                    this.resetFieldHandler();
                } else {
                    this.setState({ formError: true });
                }
            })
        } else {
            this.setState({
                formError: true
            })
        }


    }

    updateForm = (element) => {
        const newFormdata = update(element, this.state.formdata, 'products');
        this.setState({
            formError: false,
            formdata: newFormdata
        })
    }

    imagesHandler = (images) => {
        const newFormdata = {
            ...this.state.formdata
        }
        newFormdata['images'].value = images;
        newFormdata['images'].valid = true;

        this.setState({
            formdata: newFormdata
        })
    }

    render() {
        return (
            <UserLayout>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Add Product - Waves - Anthony Ledesma</title>
                </Helmet>
                <div>
                    <h1>Add product</h1>

                    <form onSubmit={(event) => this.submitForm(event)}>

                        <FileUpload
                            imagesHandler={(images) => this.imagesHandler(images)}
                            reset={this.state.formSuccess}
                        />

                        <FormField
                            id={'name'}
                            formdata={this.state.formdata.name}
                            change={(element) => this.updateForm(element)}
                        />
                        <FormField
                            id={'description'}
                            formdata={this.state.formdata.description}
                            change={(element) => this.updateForm(element)}
                        />
                        <FormField
                            id={'price'}
                            formdata={this.state.formdata.price}
                            change={(element) => this.updateForm(element)}
                        />

                        <div className="form_divider"></div>

                        <FormField
                            id={'brand'}
                            formdata={this.state.formdata.brand}
                            change={(element) => this.updateForm(element)}
                        />

                        <FormField
                            id={'shipping'}
                            formdata={this.state.formdata.shipping}
                            change={(element) => this.updateForm(element)}
                        />

                        <FormField
                            id={'available'}
                            formdata={this.state.formdata.available}
                            change={(element) => this.updateForm(element)}
                        />

                        <div className="form_divider"></div>

                        <FormField
                            id={'wood'}
                            formdata={this.state.formdata.wood}
                            change={(element) => this.updateForm(element)}
                        />

                        <FormField
                            id={'frets'}
                            formdata={this.state.formdata.frets}
                            change={(element) => this.updateForm(element)}
                        />

                        <div className="form_divider"></div>
                        <FormField
                            id={'publish'}
                            formdata={this.state.formdata.publish}
                            change={(element) => this.updateForm(element)}
                        />
                        {this.state.formError ?
                            <div className="error_label">Please check your data</div>
                            : null}
                        {this.state.formSuccess ?
                            <div className="form_success">Success</div>
                            : null}
                        <button onClick={(event) => this.submitForm(event)}>
                            Add product
                        </button>

                    </form>
                </div>

            </UserLayout>

        );
    }
}

const mapStateToProps = (state) => {
    return {
        products: state.products
    }
}

export default connect(mapStateToProps)(AddProduct);