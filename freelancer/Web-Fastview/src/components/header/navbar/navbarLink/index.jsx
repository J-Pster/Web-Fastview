import {
    FaCamera,
    FaChartLine,
    FaCog,
    FaFile,
    FaList,
    FaTh
} from "react-icons/fa";
import { NavLink  } from 'react-router-dom';
import style from './navbarlink.module.scss';
import Icon from "../../../body/icon";
import Tippy from "@tippyjs/react";

export default function NavbarLink(props){
    var icon='';

    switch(props.name){
        case 'Analytics':
            icon = <Icon type="analytics" animated />;
            break;
        case 'Relatório':
            icon = <Icon type="relatorio" animated />;
            break;
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

    if(props?.icon){
        switch(props.icon){
            case 'analytics':
                icon = <Icon type="analytics" animated size={24} color="#10459E" target="[data-link]" />
                break;
            case 'relatorio':
                icon = <Icon type="relatorio" animated size={24} color="#10459E" target="[data-link]" />
                break;
            case 'camera':
                icon = <Icon type="camera" animated size={24} color="#10459E" target="[data-link]" />
                break;
            case 'history':
                icon = <Icon type="history" animated size={24} color="#10459E" target="[data-link]" />
                break;
            case 'calendar':
                icon = <Icon type="calendar" animated size={24} color="#10459E" target="[data-link]" />
                break;
            case 'cog':
                icon = <Icon type="cog" animated size={24} color="#10459E" target="[data-link]" />
                break;
            case 'chart':
                icon = <Icon type="chart" animated size={24} color="#10459E" target="[data-link]" />
                break;
            case 'inbox':
                icon = <Icon type="inbox" animated size={24} color="#10459E" target="[data-link]" />
                break;
            case 'trend':
                icon = <Icon type="trend" animated size={24} color="#10459E" target="[data-link]" />
                break;
            case 'like':
                icon = <Icon type="like" animated size={24} color="#10459E" target="[data-link]" />
                break;
            case 'document':
                icon = <Icon type="document" animated size={24} color="#10459E" target="[data-link]" />
                break;
            case 'qr-code':
            case 'qrcode':
                icon = <Icon type="qr-code" animated size={24} color="#10459E" target="[data-link]" />
                break;
            case 'chat':
                icon = <Icon type="chat" animated size={24} color="#10459E" target="[data-link]" />
                break;
            case 'flow':
                icon = <Icon type="flow" animated size={24} color="#10459E" target="[data-link]" />
                break;
            case 'user':
                icon = <Icon type="user" animated size={24} color="#10459E" target="[data-link]" />
                break;
            case 'timeline':
                icon = <Icon type="timeline" animated size={24} color="#10459E" target="[data-link]" />
                break;
            default:
                icon = <Icon type="analytics" animated size={24} color="#10459E" target="[data-link]" /> 
        }
    }

    return(     
        <li className={style.link} data-link>
            <NavLink to={ props.link }>
                <Tippy content={props?.name} disabled={window.isMobile ? true : false}>
                    <div>
                        { icon }
                    </div>
                </Tippy>

                <span>{props.name}</span>
            </NavLink>
        </li>
    );
}
