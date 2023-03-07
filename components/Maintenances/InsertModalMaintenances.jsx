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

const postMaintenance = async({id, machineType, frequency, type}, token) => {
    const query = `mutation maintenances{
        insert_maintenances(
            objects: [{${ id ? `id: ${id},` : ""}
            machineType: "${machineType}",
            frequency: "${frequency}",
            type: "${type}"}]) {
          affected_rows
        }
      }`
    const result = await postQuery({query}, token);
    return result;
}

Modal.setAppElement('#root');

export const InsertModalMaintenances = ({getMaintenances, token, insertMaintenances, setInsertMaintenances}) => {

    const [ isOpen, setIsOpen ] = useState(false);
    const [ formSubmitted, setFormSubmitted ] = useState(false);
    const [type, setType] = useState([]);
    const [frequency, setFrequency] = useState([]);

    const getTypes = async(token) => {
        const response = await postQuery({
            query: `query show_types {
                machineType(where: {deleted: {_eq: false}}) {
                  name
                }
              }`
        },
        token);
        setType(response?.machineType || []);
    }

    const getFrequencies = async() => {
        const response = await postQuery({
            query: `query show_frequencies {
                frequencies(where: {deleted: {_eq: false}}) {
                  frequency
                }
              }`
        },
        token);
        setFrequency(response?.frequencies || []);
    }

    useEffect(() => {
        getTypes(token);
        getFrequencies(token);
    }, [])
    
    const [formValues, setFormValues] = useState({
        id: '',
        machineType: '',
        frequency: '',
        type: '',
    })

    const machineTypeClass = useMemo(() => {
        if (!formSubmitted) return '';

        return (formValues.machineType.length > 0)
            ? 'is-valid'
            : 'is-invalid';

    }, [ formValues.machineType, formSubmitted ])

    const frequencyClass = useMemo(() => {
        if (!formSubmitted) return '';

        return (formValues.frequency.length > 0)
            ? 'is-valid'
            : 'is-invalid';

    }, [ formValues.frequency, formSubmitted ])

    const typeClass = useMemo(() => {
        if (!formSubmitted) return '';

        return (formValues.type.length > 0)
            ? 'is-valid'
            : 'is-invalid';

    }, [ formValues.type, formSubmitted ])

    const onInputChanged = ({ target }) => {
        setFormValues({
            ...formValues,
            [target.name]: target.value
        })
    }

    // const onOpenModal = () => {
    //     setIsOpen(true);
    //     getTypes(token);
    //     getFrequencies(token);
    // }

    const onCloseModal = () => {
        setInsertMaintenances(false);
        setFormValues({
            id: '',
            machineType: '',
            frequency: '',
            type: '',
        })
        setFormSubmitted(false);
    }

    const onSubmit = async event  => {
        event.preventDefault();

        const result = await postMaintenance(formValues, token);
        if(result && result.insert_maintenances.affected_rows === 1){
            getMaintenances();
            onCloseModal();
        } else {
            Swal.fire('Insert error', 'Please check all fields are correct', 'Please check all fields are correct');
            setFormSubmitted(true);
        }
    }

    return (
        <>
            {/* <button onClick={ onOpenModal } type="button">Add</button> */}
            <Modal
                isOpen={insertMaintenances}
                onRequestClose={ onCloseModal }
                style={customStyles}
            >
                <h1> Insert Maintenance </h1>
                <hr />
                <form className="container" onSubmit={ onSubmit }>

                    <div className="form-group mb-2">
                        <label>Id</label>
                        <input
                            className="form-control"
                            name = "id"
                            value = { formValues.id }
                            onChange={ onInputChanged }
                        />
                    </div>

                    <div className="form-group mb-2">
                        <label>MaintenanceType</label>
                        <input
                            className={`form-control ${typeClass}`}
                            name = "type"
                            value = { formValues.type }
                            onChange={ onInputChanged }
                        />
                    </div>

                    <div className="form-group mb-2">
                        <label>MachineType</label>
                        <select
                            className={`form-control ${machineTypeClass}`}
                            name="machineType"
                            value={ formValues.machineType}
                            onChange={ onInputChanged }>
                            <option value={""}></option>
                            {
                                type.map( type => (
                                    <option key={type.name} value={type.name}>{type.name}</option>
                                ))
                            }
                        </select>
                    </div>

                    <div className="form-group mb-2">
                        <label>Frequency</label>
                        <select
                            className={`form-control ${frequencyClass}`}
                            name="frequency"
                            value={ formValues.frequency}
                            onChange={ onInputChanged }>
                            <option value={""}></option>
                            {
                                frequency.map( frequency => (
                                    <option key={frequency.frequency} value={frequency.frequency}>{frequency.frequency}</option>
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