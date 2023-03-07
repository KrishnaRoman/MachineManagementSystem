import {useMemo, useState, useEffect} from 'react';
import {postQuery} from '../../helpers/postQueries';
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

    let allowedRoles = '';
    for (let i = 0; i < formValues.allowed_roles.length; i++) {
        if(i+1 === formValues.allowed_roles.length){
            allowedRoles += formValues.allowed_roles[i];
        }else{
            allowedRoles = allowedRoles + formValues.allowed_roles[i] + ",";
        }
    }
    formValues.allowed_roles = allowedRoles;

    console.log(formValues.allowed_roles);

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
            console.log(response);
            return response.data;
        })
    } catch (error) {
        return {}
    }
    // console.log(formValues)
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

    const [checkedRoles, setCheckedRoles] = useState({
        admin: false,
        admin_jr_1: false,
        admin_jr_2: false,
        manager: false,
        reporter: false,
    })
    
    const [formValues, setFormValues] = useState({
        username: '',
        email: '',
        password: '',
        phone: '',
        allowed_roles: [],
        default_role: ''
    })


    const onInputChanged = ({ target }) => {
        if(target.name === "default_role"){
            setCheckedRoles({...checkedRoles, [target.value]: true})
            if(!checkedRoles[target.value]){
                setFormValues({...formValues, [target.name]: target.value, allowed_roles: [...formValues.allowed_roles, target.value]})
            }else{
                setFormValues({
                    ...formValues,
                    [target.name]: target.value
                })
            }
        }else{
            setFormValues({
                ...formValues,
                [target.name]: target.value
            })
        }
    }

    const onCheckedChange = ({ target }) => {
        setCheckedRoles({...checkedRoles, [target.name]: target.checked})
        if(formValues.allowed_roles.length === 0){
            setFormValues({...formValues, allowed_roles: [target.name]})
        }else if(target.checked) {
            setFormValues({...formValues, allowed_roles: [...formValues.allowed_roles, target.name]})
        }else {
            const newSelectedRoles = formValues.allowed_roles.filter(role => role !== target.name);
            if(formValues.default_role === target.name){
                setFormValues({...formValues, default_role: "", allowed_roles: newSelectedRoles})
            }else{
                setFormValues({...formValues, allowed_roles: newSelectedRoles})
            }
        }
    }

    const onCloseModal = async () => {
        setFormValues({
            username: '',
            email: '',
            password: '',
            phone: '',
            allowed_roles: [],
            default_role: ''
        })
        setCheckedRoles({
            admin: false,
            admin_jr_1: false,
            admin_jr_2: false,
            manager: false,
            reporter: false,
        })
        setInsertUsers(false);
        await getUsers()
    }

    const onSubmit = async event  => {
        event.preventDefault();

        try {
            const result = await registerUser(formValues);
            console.log(result);
            await onCloseModal();
            
        } catch (error) {
            Swal.fire('Insert error', 'Please check all fields are correct', 'Please check all fields are correct');
            
        }
        // if(result && result.token){
        // } else {
        // }
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

                    <div className="form-group mb-2">
                        <label>Allowed Roles</label>
                        {
                            Object.keys(roles).map(role => (
                                // <option value={role}>roles[role]</option>
                                <div key={role}>
                                    <input
                                        type="checkbox"
                                        checked={checkedRoles[role]}
                                        name = {role}
                                        onChange={ onCheckedChange }
                                    /> {roles[role]}
                                </div>
                            ))
                        }

                        
                        {/* <select 
                            className={`form-control`}
                            name = "default_role"
                            value={ formValues.default_role }
                            onChange={onInputChanged}>
                            <option value={""}></option>
                            {
                                Object.keys(roles).map(role => {
                                    <option value={role}>roles[role]</option>
                                })
                            }
                            <option value={"admin_jr_1"}>Admin Jr 1</option>
                            <option value={"admin_jr_1"}>Admin Jr 2</option>
                            <option value={"manager"}>Manager</option>
                            <option value={"reporter"}>Reporter</option>
                        </select> */}
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