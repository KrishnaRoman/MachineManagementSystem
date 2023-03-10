import {useMemo, useState, useEffect} from 'react';
import {postQuery} from '../../helpers/postQueries';

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


const postMachineType = async(name, token, defaultRole) => {
    const query = `mutation machineType {
        insert_machineType(objects: [{name: "${name}"}]) {
          affected_rows
        }
      }`
    const result = await postQuery({ query }, token, defaultRole);
    return result;
}

Modal.setAppElement('#root');

export const InsertModalMachineTypes = ({getTypes, token, insertMachineType, setInsertMachineType, defaultRole}) => {

    // const [ isOpen, setIsOpen ] = useState(false);
    const [ formSubmitted, setFormSubmitted ] = useState(false);
    
    const [formValues, setFormValues] = useState('');

    const nameClass = useMemo(() => {
        if (!formSubmitted) return '';

        return (formValues.length > 0)
            ? 'is-valid'
            : 'is-invalid';

    }, [ formValues, formSubmitted ])

    const onInputChanged = ({ target }) => {
        setFormValues(target.value)
    }

    useEffect(() => {
        getTypes();
    }, [])

    const onCloseModal = () => {
        setInsertMachineType(false);
        setFormValues('');
        setFormSubmitted(false);
    }

    const onSubmit = async event => {
        event.preventDefault();
        const result = await postMachineType(formValues, token, defaultRole);
        if(result && result.insert_machineType.affected_rows === 1){
            getTypes();
            onCloseModal();
        } else {
            Swal.fire('Insert error', 'Please check all fields are correct', 'error');
            setFormSubmitted(true);
        }
    }

    return (
        <>
            {/* <button onClick={ onOpenModal } type="button">Add</button> */}
            <Modal
                isOpen={insertMachineType}
                onRequestClose={ onCloseModal }
                style={customStyles}
            >
                <h1> Insert Machine Type </h1>
                <hr />
                <form className="container" onSubmit={ onSubmit }>

                    <div className="form-group mb-2">
                        <label>Name</label>
                        <input
                            className={`form-control ${nameClass}`}
                            name = "type"
                            value = { formValues }
                            onChange={ onInputChanged }
                        />
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
