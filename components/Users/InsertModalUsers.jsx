import {useState} from 'react';
import axios from 'axios';

import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import Modal from 'react-modal';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

const registerUser = async(formValues) => {

    formValues.email = formValues.email.replace(/\s/g,'');
    try {
        return axios({
            url: 'http://localhost:3000/auth/register', 
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'POST, GET, PUT, DELETE, OPTIONS, HEAD, Authorization, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Access-Control-Allow-Origin',
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(formValues)
        }).then(response => {
            return response.data;
        })
    } catch (error) {
        return {}
    }
}

Modal.setAppElement('#root');

export const InsertModalUsers = ({insertUsers, setInsertUsers, getUsers}) => {

    const roles = {
        admin: "Admin",
        admin_jr_1: "Admin Jr 1",
        admin_jr_2: "Admin Jr 2",
        manager: "Manager",
        reporter: "Reporter",
    }
    
    const [formValues, setFormValues] = useState({
        username: '',
        email: '',
        password: '',
        phone: '',
        default_role: ''
    })


    const onInputChanged = ({ target }) => {
        setFormValues({
            ...formValues,
            [target.name]: target.value
        })
    }

    const onCloseModal = async () => {
        setFormValues({
            username: '',
            email: '',
            password: '',
            phone: '',
            default_role: ''
        })
        setInsertUsers(false);
        await getUsers()
    }

    const onSubmit = async event  => {
        event.preventDefault();
        try {
            if(formValues.email.replace(/\s/g,'') === ''){
                setFormValues({...formValues, email: ''});
                throw Error("Email field is empty")
            }
            const result = await registerUser(formValues);
            await onCloseModal();
            
        } catch (error) {
            Swal.fire('Insert error', 'Please check all fields are correct', 'error');            
        }
    }

    return (
        <>
            {/* <button onClick={ onOpenModal } type="button">Add</button> */}
            <Modal
                isOpen={insertUsers}
                onRequestClose={ onCloseModal }
                style={customStyles}
            >
                <h1> Insert User </h1>
                <hr />
                <form className="container" onSubmit={ onSubmit }>

                    <div className="form-group mb-2">
                        <label>Nombre</label>
                        <input
                            className={`form-control`}
                            name = "username"
                            value = { formValues.username }
                            onChange={ onInputChanged }
                            required
                        />
                    </div>

                    <div className="form-group mb-2">
                        <label>Email</label>
                        <input
                            className={`form-control`}
                            name = "email"
                            value = { formValues.email }
                            onChange={ onInputChanged }
                            required
                        />
                    </div>

                    <div className="form-group mb-2">
                        <label>Password</label>
                        <input
                            type="password"
                            className={`form-control`}
                            name = "password"
                            value = { formValues.password }
                            onChange={ onInputChanged }
                            required
                        />
                    </div>
        
                    <div className="form-group mb-2">
                        <label>Phone</label>
                        <input
                            className={`form-control`}
                            name = "phone"
                            value = { formValues.phone }
                            onChange={ onInputChanged }
                            required
                        />
                    </div>

                    <div className="form-group mb-2">
                        <label>Default Role</label>
                        <select 
                            className={`form-control`}
                            name = "default_role"
                            required
                            value={ formValues.default_role }
                            onChange={onInputChanged}>
                            <option value={""}></option>
                            {
                                Object.keys(roles).map(role => (
                                    <option key={role} value={role}>{roles[role]}</option>
                                ))
                            }
                        </select>
                    </div>

                   <button
                        type="submit"
                        className="btn btn-outline-primary btn-block"
                    >
                        <i className="far fa-save"></i>
                        <span> Save </span>
                    </button>

                </form>
            </Modal>
        </>
    )
}