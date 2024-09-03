import {
    FaCamera,
    FaChartLine,
    FaCog,
    FaFile,
    FaList,
    FaTh
} from "react-icons/fa";
import { NavLink  } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';

export default function SidebarLink(props){
    var icon='';

    switch(props.name){
        case 'Novo':    
            icon = <FaFile />;    
            break;
        case 'Lista':    
            icon = <FaList />;    
            break;
        case 'Painel':
        case 'Calendário':
        case 'Cards':
            icon = <FaTh />;    
            break;
        case 'Dashboard':
            icon = <FaChartLine />;    
            break;
        case 'Gerenciador':
            icon = <FaCog />;    
            break;
        case 'Foto':
        case 'Foto (HTML)':
        case 'Supervisão Visual':        
            icon = <FaCamera />;    
            break;
        default:
            icon = <FaList />;    
    }

    return(      
        // (window.isMobile?
        //     <SwiperSlide>
        //         <NavLink to={ props.link }>
        //             { icon }
        //             <span>{props.name }</span>
        //         </NavLink>
        //     </SwiperSlide>
        // :
        //     <li>
        //         <NavLink to={ props.link }>
        //             { icon }
        //             <span>{props.name }</span>
        //         </NavLink>
        //     </li>
        // )

        <li>
            <NavLink to={ props.link }>
                { icon }
                <span>{props.name }</span>
            </NavLink>
        </li>
    );
}
