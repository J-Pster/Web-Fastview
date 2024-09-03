import { MdScreenSearchDesktop } from 'react-icons/md';
import style from './PageEmpty.module.scss';
import Button from '../button';
import { NavLink } from 'react-router-dom';

export default function PageEmpty(props){
    return(
        <div className={ style.empty }>
            <div>
                <MdScreenSearchDesktop />
                <h2>Nenhum resultado encontrado</h2>
                
                {(props.button!==false ?
                    <NavLink to="/systems/jobs/novo">
                        <Button>Criar um novo job</Button>
                    </NavLink>
                :'')}
            </div>
        </div>
    )
}
