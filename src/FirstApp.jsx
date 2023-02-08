import {Machines} from '../components/Machines';
import { MachineTypes } from '../components/MachineTypes';
import { Record } from '../components/Record';
import { Maintenances } from '../components/Maintenances';

export const FirstApp = () => {


    return (
    <>
        <h1>Machine Managment System</h1>
        <Machines />
        <MachineTypes />
        <Record />
        <Maintenances />
    </>
    )
}