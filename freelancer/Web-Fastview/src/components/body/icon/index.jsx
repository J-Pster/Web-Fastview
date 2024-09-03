import style from './Icon.module.scss';
import Tippy from '@tippyjs/react';
import {
    FaExclamationTriangle,
    FaSearch,
    FaPlus,
    FaPrint,
    FaFileExcel,
    FaRegCalendar,
    FaBook,
    FaChevronDown,
    FaChevronUp,
    FaMinus,
    FaExpandAlt,
    FaCompressAlt,
    FaChevronLeft,
    FaChevronRight,
    FaSyncAlt,
    FaRegEnvelope,
    FaRegMeh,
    FaFilePdf,
    FaRegHandshake,
    FaExchangeAlt
} from "react-icons/fa";

import {
    BiPlusCircle,
    BiMinusCircle,
    BiCheck,
    BiX,
    BiCog,
    BiCamera,
    BiUserCheck,
    BiError,
    BiTrendingUp,
    BiHappy,
    BiChat,
    BiInfoCircle,
    BiMedal
} from "react-icons/bi";

import {
    TbEditOff,
    TbEye,
    TbList,
    TbPaperclip,
    TbPin,
    TbPinnedOff,
    TbTrash,
    TbBrandYoutube,
    TbEyeOff,
    TbUserCheck,
    TbLayoutGrid,
    TbMessages,
    TbMessagesOff,
    TbArchive,
    TbHistory,
    TbClipboardCheck,
    TbChecks,
    TbDownload,
    TbUpload,
    TbShare,
    TbChartPie,
    TbInbox,
    TbLock,
    TbHelp,
    TbIdBadge,
    TbLogout,
    TbBuilding,
    TbClipboardText,
    TbReportMoney,
    TbSpeakerphone,
    TbDeviceWatch,
    TbTag,
    TbTruck,
    TbChartBar,
    TbStairsUp,
    TbCash,
    TbBrandCashapp,
    TbCheck,
    TbCode
} from "react-icons/tb";

import {
    BsCheck2Circle,
    BsDash,
    BsPencil,
    BsWhatsapp,
    BsZoomIn,
    BsZoomOut,
    BsPerson
} from "react-icons/bs";

import { 
    HiOutlineExclamationCircle,
    HiOutlineHandThumbDown,
    HiOutlineHandThumbUp,
    HiOutlineDocumentText,
    HiOutlineUserGroup
} from "react-icons/hi2";

import { 
    HiOutlineMail,
    HiOutlineMailOpen,
    HiSortAscending, HiSortDescending,    
    } from "react-icons/hi";

import {
    IoIosArrowRoundUp,
    IoIosArrowRoundDown
} from "react-icons/io";

import {
    IoCloseCircleOutline,
    IoBanOutline,
    IoEnterOutline,
    IoReload,
    IoHourglassOutline,
    IoCopyOutline,
    IoDocumentTextOutline,
    IoGitNetwork,
    IoPodiumOutline,
    IoHomeOutline
} from "react-icons/io5";

import {
    MdMessage,
    MdOutlineNotificationsNone,
    MdOutlineNotificationsOff,
    MdDragIndicator,
    MdUndo,
    MdOutlineStarBorder,
    MdOutlineStarPurple500,
    MdOpenInNew,
    MdOutlineChecklistRtl,
    MdOutlinePhotoLibrary,
    MdOutlineLocationOn
} from 'react-icons/md';

import {
    RiEmotionHappyLine,
    RiEmotionSadLine,
    RiOrganizationChart,
    RiDashboard3Line,
    
    RiFolderReceivedLine, RiUserReceived2Line
} from "react-icons/ri";

import { CgUndo } from "react-icons/cg";

import ReactDatePicker from 'react-datepicker';

// ÍCONES ANIMADOS
import lottie from "lottie-web";
import { defineElement } from "@lordicon/element";
import { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../loader';
import { LucideFileSignature, LucideTableProperties } from 'lucide-react';

// ÍCONES ANIMADOS
defineElement(lottie.loadAnimation);

const importIcon = (icon) => {
    return `https://cdn.lordicon.com/${icon}.json`;
}

export default function Icon(props){
    var iconType, iconTitle, primaryColor, secondaryColor, class_aux, state, trigger, customSize, scaleX, rotate;
    // useEffect(() => {
    //     document.querySelectorAll('lord-icon').forEach((element) => {
    //         element.addEventListener('ready', () => {
    //             element.classList.add(style.ready);
    //             setCurrentColor('current-color '+style.ready); 
    //         });
    //     }); 
    // },[]);

    // DEFININDO CORES DOS ÍCONES ANIMADOS A PARTIR DAS CLASSES BOOTSTRAP
    if(props?.className){
        if(props?.className == 'text-success'){
            primaryColor = '#198754';
        }else if(props?.className == 'text-warning'){
            primaryColor = '#ffc107';
        }else if(props?.className == 'text-danger'){
            primaryColor = '#dc3545';
        }else if(props?.className == 'text-primary'){
            primaryColor = '#0090d9';
        }
    }

    if(props?.color){
        primaryColor = props?.color;
    }

    // EXPORTAR EXCEL/PDF
    function handleExport(type) {
        setLoading(true);
        if (type == "pdf" || type == "xlsx") {
          if (props?.api?.body) {
            let params_aux;

            if(props?.api?.body.filters){
                params_aux = props?.api?.body;
                params_aux.filters.limit = -2; // SETA 0 NO LIMIT (NECESSÁRIO PARA O EXPORTADOR EXPORTAR TODOS OS REGISTROS, SEM LIMITE DE DADOS)
            }else{
                params_aux = props?.api?.body;
            }
            
            axios({
              method: "get",
              url: window.host+"/service/exportador.php?do=" + type,
              params: {
                json: JSON.stringify(params_aux),
              },
              responseType: "blob",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
            }).then((response) => {
              const href = URL.createObjectURL(response.data);
              const link = document.createElement("a");
  
              link.href = href;
              link.setAttribute(
                "download",
                props?.api?.body?.name
                  ? props?.api?.body?.name
                  : type === "xlsx"
                  ? "Excel"
                  : "PDF"
              );
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
  
              URL.revokeObjectURL(href);
              setLoading(false);
            });
          }
        } else {
          console.warn("Informe um tipo de arquivo válido para exportação.");
        }
      }

    switch(props.type){
        case 'new':
        case 'novo':
        case 'plus':
            if(props?.animated){
                iconType = "qgvnqvkf";
            }else{
                iconType = <FaPlus className={ (props.className?props.className:'text-primary') } />;
            }    
            iconTitle = (props.title?props.title:'Novo');
            secondaryColor = '#10459E';
            state = 'hover-1';
            break;
        case 'analytics':
            if(props?.animated){
                iconType = "whrxobsb";
            }else{
                iconType = <TbList className={ (props.className?props.className:'text-primary') } />;
            }    
            iconTitle = (props.title?props.title:'Novo');
            secondaryColor = '#10459E';
            state = 'hover';
            break;
        case 'question':
        case 'help':
            if(props?.animated){
                iconType = "axteoudt";
            }else{
                iconType = <TbHelp className={ (props.className?props.className:'') } style={{transform:'scale(1.2)', right: '3px'}} />;
            }    
            iconTitle = (props.title?props.title:'Dúvida');
            state = 'hover';
            break;
        case 'minus':
            iconType = <FaMinus className={ (props.className?props.className:'text-danger') } />;
            iconTitle = (props.title?props.title:'Mostrar menos');
            break;
        case 'open':
        case 'abrir':
            iconType = <BiPlusCircle className={ (props.className?props.className:'text-primary') } style={{transform:'scale(1.1)'}}  />;
            iconTitle = (props.title?props.title:'Expandir');
            break;
        case 'close':
        case 'fechar':
            iconType = <BiMinusCircle className={ (props.className?props.className:'text-danger') } style={{transform:'scale(1.1)'}}  />;
            iconTitle = (props.title?props.title:'Expandir');
            break;
        case 'zoomIn':
            iconType = <BsZoomIn className={ props.className } style={{transform:'scale(1.1)'}}  />;
            iconTitle = (props.title?props.title:'Zoom');
            break;
        case 'zoomOut':
            iconType = <BsZoomOut className={ props.className } style={{transform:'scale(1.1)'}}  />;
            iconTitle = (props.title?props.title:'Zoom');
            break;
        case 'fixar':
            iconType = <TbPin className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}}  />;
            iconTitle = (props.title?props.title:'Fixar');
            break;
        case 'desfixar':
            iconType = <TbPinnedOff className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}}  />;
            iconTitle = (props.title?props.title:'Desfixar');
            break;
        case 'change':
        case 'exchange':
            iconType = <FaExchangeAlt className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}}  />;
            iconTitle = (props.title?props.title:'Trocar');
            break;
        case 'code':
            iconType = <TbCode className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}}  />;
            iconTitle = (props.title?props.title:'Código');
            break;
        case 'view':
        case 'visualizar':
            if(props?.animated){
                iconType = "fqfpkgja";
            }else{
                iconType = <TbEye className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}} />;
            }               
            iconTitle = (props.title?props.title:'Visualizar');
            break;
        case 'unview':
        case 'no-view':
            iconType = <TbEyeOff className={ (props.className?props.className:'') } style={{transform:'scale(1.1)', right: '3px'}} />;
            iconTitle = (props.title?props.title:'Visualizar');
            break;
        case 'timeline':
            if(props?.animated){
                iconType = "eouimtlu";
            }else{
                iconType = <TbEye className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}} />;
            }               
            iconTitle = (props.title?props.title:'Visualizar');
            break;
        case 'delete':
        case 'excluir':
        case 'trash':
            if(props?.animated){
                iconType = "kfzfxczd";
            }else{
                iconType = <TbTrash className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}} />
            }                
            iconTitle = (props.title?props.title:'Excluir');
            state = 'hover-empty';
            break;
        case 'chart':
            if(props?.animated){
                iconType = "eliwatfs";
            }else{
                iconType = <TbChartPie className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}} />
            }                
            iconTitle = (props.title?props.title:'Gráfico');
            state = 'hover';
            break;
        case 'chart-bar':
            if(props?.animated){
                iconType = "eliwatfs";
            }else{
                iconType = <TbChartBar className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}} />
            }                
            iconTitle = (props.title?props.title:'Gráfico');
            state = 'hover';
            break;
        case 'document':
            if(props?.animated){
                iconType = "iiixgoqp";
            }else{
                iconType = <IoDocumentTextOutline className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}} />
            }                
            iconTitle = (props.title?props.title:'Documento');
            state = 'hover-1';
            break;
        case 'flow':
            if(props?.animated){
                iconType = "nlwiffyt";
            }else{
                iconType = <IoDocumentTextOutline className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}} />
            }                
            iconTitle = (props.title?props.title:'Fluxo');
            rotate = -90;
            break;
        case 'search':
            if(props?.animated){
                iconType = "xfftupfv";
            }else{
                iconType = <FaSearch className={ (props.className?props.className:'') } />
            }                  
            iconTitle = (props.title?props.title:'Pesquisar');
            break;
        case 'calendar':
        case 'calendario':
            if(props?.animated){
                iconType = "qjuahhae";
            }else{
                iconType = <FaRegCalendar className={ (props.className?props.className:'')} />
            }                 
            iconTitle = (props.title?props.title:'Agendar');
            break;
        case 'print':
            iconType = <FaPrint className={'text-primary '+props?.className} />;        
            iconTitle = (props.title?props.title:'Imprimir');
            customSize = (window.isMobile ? 27 : 24);
            break;
        case 'excel':
            iconType = <FaFileExcel className={ (props.className?props.className:'') } style={{color:'#1f7244'}} />;
            iconTitle = (props.title?props.title:'Exportar em Excel');
            break;
        case 'pdf':
            iconType = <FaFilePdf className={ (props.className?props.className:'') } />;
            iconTitle = (props.title?props.title:'Exportar em PDF');
            break;
        case 'cracha':
            iconType = <TbIdBadge className={ (props.className?props.className:'') } />;
            iconTitle = (props.title?props.title:'Exportar em Excel');
            break;
        case 'file':
        case 'paperclip':
            if(props?.animated){
                iconType = "dwtsesew";
            }else{
                iconType = <TbPaperclip className={ (props.className?props.className:'') }/>;
            }              
            iconTitle = (props.title?props.title:'Anexo');
            break;
        case 'inbox':
            if(props?.animated){
                iconType = "ifqmqwui";
            }else{
                iconType = <TbInbox className={ (props.className?props.className:'') }/>;
            }              
            iconTitle = (props.title?props.title:'Inbox');
            break;
        case 'trend':
            if(props?.animated){
                iconType = "bewubbww";
            }else{
                iconType = <BiTrendingUp className={ (props.className?props.className:'') }/>;
            }              
            iconTitle = (props.title?props.title:'Inbox');
            break;
        case 'aprovar':
            iconType = <TbCheck className={ (props.className?props.className:'') } />;
            iconTitle = (props.title?props.title:'Aprovar');
            break;
        case 'reprovar':
            iconType = <BiX className={ (props.className?props.className:'') } style={{transform:'scale(1.5)'}} />;
            iconTitle = (props.title?props.title:'Reprovar');
            break;
        case 'reprovar2':
        case 'times-circle':
            if(props?.animated){
                iconType = "nhfyhmlt";
            }else{
                iconType = <IoCloseCircleOutline className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}} />;
            }             
            iconTitle = (props.title?props.title:'Reprovar');
            state="hover-2"
            break;
        case 'ban':
        case 'bloqueio':
        case 'alert-circle':
            if(props?.animated){
                iconType = "bmnlikjh";
            }else{
                iconType = <IoBanOutline className={ (props.className?props.className:'') } />;
            }               
            iconTitle = (props.title?props.title:'Reprovar');
            state = 'hover-2';
            break;
        case 'lock':   
            if(props?.animated){
                iconType = "fsvcbpsj";
            }else{
                iconType = <TbLock className={ (props.className?props.className:'') }/>;
            }                       
            iconTitle = (props.title?props.title:'Bloqueado');
            state = 'hover-lock';
            break;
        case 'reabrir':   
            if(props?.animated){
                iconType = "swohgnlg";
            }else{
                iconType = <MdUndo className={ (props.className?props.className:'') }/>;
            }                       
            iconTitle = (props.title?props.title:'Reabrir');
            break;
        case 'reabrir2':        
            iconType = <CgUndo className={ (props.className?props.className:'') } style={{transform:'scale(1.3)'}}/>;
            iconTitle = (props.title?props.title:'Reabrir');
            break;
        case 'undo':
        case 'voltar':
            if(props?.animated){
                iconType = "eaeoemir";
            }else{
                iconType = <MdUndo className={ (props.className?props.className:'') }/>;
            }                       
            iconTitle = (props.title?props.title:'Voltar');
            break;
        case 'prev':
        case 'anterior':
        case 'voltar':
            if(props?.animated){
                iconType = "vduvxizq";
            }else{
                iconType = <MdUndo className={ (props.className?props.className:'') }/>;
            }              
            iconTitle = (props.title?props.title:'Voltar');
            scaleX = true;
            break;
        case 'prev-up':
            if(props?.animated){
                iconType = "vduvxizq";
            }else{
                iconType = <MdUndo className={ (props.className?props.className:'') }/>;
            }              
            iconTitle = (props.title?props.title:'Voltar');
            rotate = -90;
            break;
        case 'next':
        case 'proximo':
        case 'avancar':
            if(props?.animated){
                iconType = "vduvxizq";
            }else{
                iconType = <MdUndo className={ (props.className?props.className:'') } style={{'transform':'scaleX(-1)'}} />;
            }              
            iconTitle = (props.title?props.title:'Avançar');
            break;
        case 'next-down':
            if(props?.animated){
                iconType = "vduvxizq";
            }else{
                iconType = <MdUndo className={ (props.className?props.className:'') } style={{'transform':'scaleX(-1)'}} />;
            }              
            iconTitle = (props.title?props.title:'Avançar');
            rotate = 90;
            break;
        case 'editar':
        case 'edit':
            if(props?.animated){
                iconType = "nmguowue";
            }else{
                iconType = <BsPencil className={ (props.className?props.className:'') } />;
            }              
            iconTitle = (props.title?props.title:'Editar');
            break;
        case 'no-edit':
            iconType = <TbEditOff className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}} />;
            iconTitle = (props.title?props.title:'Ocultar edição');
            break;
        case 'book':
            iconType = <FaBook className={ (props.className?props.className:'') }/>;
            iconTitle = (props.title?props.title:'Tutorial');
            break;
        case 'video':
        case 'play':
            if(props?.animated){
                iconType = "xddtsyvc";
            }else{
                iconType = <TbBrandYoutube className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}}/>;
            }               
            iconTitle = (props.title?props.title:'Tutorial');
            break;
        case 'message':
        case 'mensagem':
            if(props?.animated){
                iconType = "vysqglbv";
            }else{
                iconType = <MdMessage className={ (props.className?props.className:'') }/>;
            }                   
            iconTitle = (props.title?props.title:'Mensagem');
            break;
        case 'list':
        case 'lista':
            iconType = <TbList className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}} />;
            iconTitle = (props.title?props.title:'Lista');
            break;
        case 'checklist':
            iconType = <MdOutlineChecklistRtl className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}} />;
            iconTitle = (props.title?props.title:'Checklist');
            break;
        case 'clipboard':
            iconType = <TbClipboardText className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}} />;
            iconTitle = (props.title?props.title:'Copiar');
            break;
        case 'enable':
        case 'habilitar':
        case 'check':
        case 'check-circle':
        case 'aprovar2':
            if(props?.animated){
                iconType = "egiwmiit";
            }else{
                iconType = <BsCheck2Circle className={ (props.className?props.className:'') }/>;
            }              
            iconTitle = (props.title?props.title:'Habilitar');
            customSize = (window.isMobile ? 27 : 18);
            break;
        case 'double-check':
            iconType = <TbChecks className={ (props.className?props.className:'') }/>;
            iconTitle = (props.title?props.title:'Double Check');
            break;
        case 'times':
            if(props?.animated){
                iconType = "nhfyhmlt";
            }else{
                iconType = <IoCloseCircleOutline className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}} />;
            }               
            iconTitle = (props.title?props.title:'');
            state="hover-2"
            break;
        case 'collapseIn':
        case 'chevron-down':
            iconType = <FaChevronDown className={ (props.className?props.className:'') }/>;
            iconTitle = (props.title?props.title:'Expandir');
            break;
        case 'collapseOut':
        case 'chevron-up':
            iconType = <FaChevronUp className={ (props.className?props.className:'') }/>;
            iconTitle = (props.title?props.title:'Retrair');
            break;
        case 'dash':
        case 'traço':
            iconType = <BsDash className={ (props.className?props.className:'') } style={{transform:'scale(1.5)'}} />;
            iconTitle = (props.title?props.title:'');
            break;
        case 'cog':
            if(props?.animated){
                iconType = "hwuyodym";
            }else{
                iconType = <BiCog className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}}/>;
            }              
            iconTitle = (props.title?props.title:'Configurações');
            state = 'hover-1';
            break;
        case 'info':
            if(props?.animated){
                iconType = "yxczfiyc";
            }else{
                iconType = <BiInfoCircle className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}}/>;
            }              
            iconTitle = (props.title?props.title:'Informações');
            break;
        case 'camera':
        case 'photo':
            if(props?.animated){
                iconType = "ivdatglx";
            }else{
                iconType = <BiCamera className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}}/>;
            }               
            iconTitle = (props.title?props.title:'Foto');            
            iconTitle = (props.title?props.title:'Foto');            
            break;
        case 'picture':
            if(props?.animated){
                iconType = "yacxrrtc";
            }else{
                iconType = <MdOutlinePhotoLibrary className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}}/>;
            }               
            iconTitle = (props.title?props.title:'Foto');
            state = 'hover';
            trigger = "in";
            iconTitle = (props.title?props.title:'Foto');
            break;
        case 'picture':
            if(props?.animated){
                iconType = "yacxrrtc";
            }else{
                iconType = <MdOutlinePhotoLibrary className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}}/>;
            }               
            iconTitle = (props.title?props.title:'Foto');
            state = 'hover';
            trigger = "in";
            break;
        case 'draggable':
            iconType = <MdDragIndicator className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}}/>;
            iconTitle = (props.title?props.title:'');
            break;
        case 'notificacao':
        case 'notification':
        case 'notifications':
            iconType = <MdOutlineNotificationsNone className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}}/>;
            iconTitle = (props.title?props.title:'Ligar notificações');
            break;
        case 'notification-off':
        case 'notifications-off':
            iconType = <MdOutlineNotificationsOff className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}}/>;
            iconTitle = (props.title?props.title:'Desligar notificações');
            break;
        case 'executar':
        case 'execute':
        case 'enter': 
            if(props?.animated){
                iconType = "wxtujouu";
            }else{
                iconType = <IoEnterOutline className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}}/>;
            }             
            iconTitle = (props.title?props.title:'Executar');
            break;
        case 'hourglass':
            if(props?.animated){
                iconType = "seownrlp";
            }else{
                iconType = <IoHourglassOutline className={ (props.className?props.className:'') } style={{transform:'scale(1)'}}/>;
            }               
            iconTitle = (props.title?props.title:'Executar');
            state="hover-3"
            break;
        case 'left':
            iconType = <FaChevronLeft className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}}/>;
            iconTitle = (props.title?props.title:'');
            break;
        case 'right':
            iconType = <FaChevronRight className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}}/>;
            iconTitle = (props.title?props.title:'');
            break;
        case 'up':
            iconType = <FaChevronUp className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}}/>;
            iconTitle = (props.title?props.title:'');
            break;
        case 'down':
            iconType = <FaChevronDown className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}}/>;
            iconTitle = (props.title?props.title:'');
            break;
        case 'sync':
        case 'sincronizar':
            iconType = <FaSyncAlt className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}}/>;
            iconTitle = (props.title?props.title:'Recarregar');
            break;
        case 'receive':
        case 'receber':
            if(props?.animated){
                iconType = "envfvsyu";
            }else{
                iconType = <BiUserCheck className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}}/>;
            }              
            iconTitle = (props.title?props.title:'Recarregar');
            break;
        case 'star':
        case 'prioridade':
            iconType = <MdOutlineStarBorder className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}}/>;
            iconTitle = (props.title?props.title:'Dar prioridade');
            break;
        case 'star-active':
            iconType = <MdOutlineStarPurple500 className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}}/>;
            iconTitle = (props.title?props.title:'Remover prioridade');
            break;
        case 'archive':
            if(props?.animated){
                iconType = "novxawti";
            }else{
                iconType = <TbArchive className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}}/>;
            }                  
            iconTitle = (props.title?props.title:'Arquivar');
            break;
        case 'unarchive':
            if(props?.animated){
                iconType = "novxawti";
            }else{
                iconType = <TbArchive className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}}/>;
            }                  
            iconTitle = (props.title?props.title:'Arquivar');
            class_aux = style.unarchive;
            break;
        case 'archived':
            if(props?.animated){
                iconType = "fpmskzsv";
            }else{
                iconType = <TbArchive className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}}/>;
            }                  
            iconTitle = (props.title?props.title:'Arquivados');
            break;
        case 'enterprise':
            iconType = <TbBuilding className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}}/>;             
            iconTitle = (props.title?props.title:'Empresa');
            break;
        case 'history':
            if(props?.animated){
                iconType = "weoiqraa";
            }else{
                iconType = <TbHistory className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}}/>;
            }              
            iconTitle = (props.title?props.title:'Histórico');
            break;
        case 'qr-code':
        case 'qrcode':
            if(props?.animated){
                iconType = "ynaxmlqs";
            }else{
                iconType = <TbHistory className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}}/>;
            }              
            iconTitle = (props.title?props.title:'QR Code');
            break;
        case 'error':
            iconType = <BiError className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}}/>;
            iconTitle = (props.title?props.title:'Erro');
            break;
        case 'sad':
        case 'frown':
            iconType = <RiEmotionSadLine className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}}/>;
            iconTitle = (props.title?props.title:'Erro');
            break;
            case 'organograma':
            iconType = <RiOrganizationChart className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}}/>;
            iconTitle = (props.title?props.title:'Organograma');
            break;
        case 'happy':
        case 'smile':
            iconType = <RiEmotionHappyLine className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}}/>;
            iconTitle = (props.title?props.title:'Erro');
            break;
        case 'happiest':
        case 'laugh-wink':
            iconType = <BiHappy className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}}/>;
            iconTitle = (props.title?props.title:'Erro');
            break;
        case 'meh':
            iconType = <FaRegMeh className={ (props.className?props.className:'') } style={{transform:'scale(1.0)'}}/>;
            iconTitle = (props.title?props.title:'Erro');
            break;
        case 'thumbs-up':
        case 'like':
            if(props?.animated){
                iconType = "envfvsyu";
            }else{
                iconType = <HiOutlineHandThumbUp className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}}/>;
            }             
            iconTitle = (props.title?props.title:'Aprovar');
            break;
        case 'thumbs-down':
            iconType = <HiOutlineHandThumbDown className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}}/>;
            iconTitle = (props.title?props.title:'Reprovar');
            break;
        case 'share':
        case 'compartilhar':
            if(props?.animated){
                iconType = "wxhtpnnk";
            }else{
                iconType = <TbShare className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}}/>;
            }                
            iconTitle = (props.title?props.title:'Reprovar');
            break;
        case 'sort-asc':
            iconType = <IoIosArrowRoundDown className={ (props.className?props.className:'') } style={{transform:'scale(1.1)',top:1}}/>;
            iconTitle = (props.title?props.title:'Ordem crescente');
            break;
        case 'sort-desc':
            iconType = <IoIosArrowRoundUp className={ (props.className?props.className:'') } style={{transform:'scale(1.1)',top:1}}/>;
            iconTitle = (props.title?props.title:'Ordem descrescente');
            break;
        case 'sort-asc2':
            iconType = <HiSortAscending className={ (props.className?props.className:'') } style={{transform:'scale(1.1)',top:1}}/>;
            iconTitle = (props.title?props.title:'Ordem crescente');
            break;
        case 'sort-desc2':
            iconType = <HiSortDescending className={ (props.className?props.className:'') } style={{transform:'scale(1.1)',top:1}}/>;
            iconTitle = (props.title?props.title:'Ordem descrescente');
            break;
        case 'reload':
            iconType = <IoReload className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}}/>;
            iconTitle = (props.title?props.title:'Recarregar');
            break;
        case 'user-check':
            if(props?.animated){
                iconType = "bhfjfgqz";
            }else{
                iconType = <TbUserCheck className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}}/>;
            }              
            iconTitle = (props.title?props.title:'Check');
            break;
        case 'user':
            if(props?.animated){
                iconType = "bhfjfgqz";
            }else{
                iconType = <TbUserCheck className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}}/>;
            }              
            iconTitle = (props.title?props.title:'Check');
            break;
        case 'externo':
        case 'external':
            iconType = <MdOpenInNew className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}}/>;
            iconTitle = (props.title?props.title:'Abrir');
            break;
        case 'logout':
            iconType = <TbLogout className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}}/>;
            iconTitle = (props.title?props.title:'Abrir');
            break;
        case 'interno':
        case 'internal':
            iconType = <MdOpenInNew className={ (props.className?props.className:'') } style={{transform:'scale(1.1) rotate(180deg)'}}/>;
            iconTitle = (props.title?props.title:'Minimizar');
            break;
        case 'expandir':
        case 'expand':
            if(props.expanded){
                iconType = <FaCompressAlt className={ (props.className?props.className+' text-danger':'text-danger') } style={{transform:'scale(1.1) rotate(45deg)',marginLeft: 3}}/>;
            }else{
                iconType = <FaExpandAlt className={ (props.className?props.className+' text-primary':'text-primary') } style={{transform:'scale(1.1) rotate(45deg)',marginLeft: 3}}/>;
            }
            iconTitle = (props.title?props.title:(props.expanded?'Retrair':'Expandir'));
            break;
        case 'expand-card':
            if(props?.animated){
                iconType = "qzlhsleu";
            }else{
                iconType = <TbUserCheck className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}}/>;
            }              
            iconTitle = (props.title?props.title:'Expandir');
            break;
        case 'retract-card':
            if(props?.animated){
                iconType = "xdbaztkd";
            }else{
                iconType = <TbUserCheck className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}}/>;
            }              
            iconTitle = (props.title?props.title:'Retrair');
            break;
        case 'chat':
            if(props?.animated){
                iconType = "tymgxsew";
            }else{
                iconType = <BiChat className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}}/>;
            }              
            iconTitle = (props.title?props.title:'Chat');
            break;
        case 'chat-open':
            iconType = <TbMessages className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}}/>;
            iconTitle = (props.title?props.title:'Exibir chat');
            break;
        case 'chat-close':
            iconType = <TbMessagesOff className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}}/>;
            iconTitle = (props.title?props.title:'Ocultar chat');
            break;
        case 'email':
        case 'mail':
        case 'envelope':
            if(props?.animated){
                iconType = "nfsqebdc";
            }else{
                iconType = <FaRegEnvelope className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}} />;
            }               
            iconTitle = (props.title?props.title:'E-mail');
            break;
        case 'mail-open':
            if(props?.animated){
                iconType = "sugotkzl";
            }else{
                iconType = <HiOutlineMailOpen className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}} />;
            }               
            iconTitle = (props.title?props.title:'E-mail');
            break;
        case 'mail-close':
            if(props?.animated){
                iconType = "bkjyrmiv";
            }else{
                iconType = <HiOutlineMail className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}} />;
            }               
            iconTitle = (props.title?props.title:'E-mail');
            break;
        case 'relatorio':
            if(props?.animated){
                iconType = "icwosubo";
            }else{
                iconType = <TbList className={ (props.className?props.className:'') } />;
            }               
            iconTitle = (props.title?props.title:'Relatório');
            break;
        case 'whatsapp':
        case 'zapzap':
            iconType = <BsWhatsapp className={ (props.className?props.className:'') } />;
            iconTitle = (props.title?props.title:'WhatsApp');
            break;
        case 'download':
            if(props?.animated){
                iconType = "koevfwin";
            }else{
                iconType = <TbDownload className={ (props.className?props.className:'') } />;
            }               
            iconTitle = (props.title?props.title:'Download');
            break;
        case 'location':
        case 'locale':
            if(props?.animated){
                iconType = "yymhadbu";
            }else{
                iconType = <MdOutlineLocationOn className={ (props.className?props.className:'') } />;
            }               
            iconTitle = (props.title?props.title:'Localização');
            state = 'hover-spin';
            break;
        case 'clone':
        case 'copy':
            if(props?.animated){
                iconType = "trgusfqu";
            }else{
                iconType = <IoCopyOutline className={ (props.className?props.className:'') } />;
            }               
            iconTitle = (props.title?props.title:'Clonar');
            break;
        case 'upload':
            iconType = <TbUpload className={ (props.className?props.className:'') } />;
            iconTitle = (props.title?props.title:'Upload');
            break;
        case 'report-money':
            iconType = <TbReportMoney className={ (props.className?props.className:'') } style={{transform:'scale(1.2)'}} />;
            iconTitle = (props.title?props.title:'');
            break;
        case 'table':
            iconType = <LucideTableProperties className={ (props.className?props.className:'') } style={{marginLeft:-3,marginRight:-3}} />;
            iconTitle = (props.title?props.title:'');
            break;
        case 'network':
            iconType = <IoGitNetwork className={ (props.className?props.className:'') } style={{transform:'scale(1.2)'}} />;
            iconTitle = (props.title?props.title:'');
            break;
        case 'velocimeter':
            iconType = <RiDashboard3Line className={ (props.className?props.className:'') } style={{transform:'scale(1.2)'}} />;
            iconTitle = (props.title?props.title:'');
            break;
        case 'speaker':
            iconType = <TbSpeakerphone className={ (props.className?props.className:'') } style={{transform:'scale(1.2)'}} />;
            iconTitle = (props.title?props.title:'');
            break;
        case 'watch':
            iconType = <TbDeviceWatch className={ (props.className?props.className:'') } style={{transform:'scale(1.2)'}} />;
            iconTitle = (props.title?props.title:'');
            break;
        case 'home':
            iconType = <IoHomeOutline className={ (props.className?props.className:'') } />;
            iconTitle = (props.title?props.title:'');
            break;
        case 'contract':
            iconType = <HiOutlineDocumentText className={ (props.className?props.className:'') } style={{transform:'scale(1.2)'}} />;
            iconTitle = (props.title?props.title:'');
            break;
        case 'contract-signature':
            iconType = <LucideFileSignature className={ (props.className?props.className:'') } style={{marginLeft:-3,marginRight:-3}} />;
            iconTitle = (props.title?props.title:'');
            break;
        case 'stairs':
            iconType = <TbStairsUp className={ (props.className?props.className:'') } />;
            iconTitle = (props.title?props.title:'');
            break;
        case 'cash':
            iconType = <TbCash className={ (props.className?props.className:'') } />;
            iconTitle = (props.title?props.title:'');
            break;
        case 'brandcash':
            iconType = <TbBrandCashapp className={ (props.className?props.className:'') } />;
            iconTitle = (props.title?props.title:'');
            break;
        case 'hand-shake':
            iconType = <FaRegHandshake className={ (props.className?props.className:'') } />;
            iconTitle = (props.title?props.title:'');
            break;
        case 'medal':
            iconType = <BiMedal className={ (props.className?props.className:'') } />;
            iconTitle = (props.title?props.title:'');
            break;
        case 'podium':
            iconType = <IoPodiumOutline className={ (props.className?props.className:'') } />;
            iconTitle = (props.title?props.title:'');
            break;
        case 'tag':
            iconType = <TbTag className={ (props.className?props.className:'') } style={{transform:'scale(1.2)'}} />;
            iconTitle = (props.title?props.title:'');
            break;
        case 'people-group':
            iconType = <HiOutlineUserGroup className={ (props.className?props.className:'') } style={{transform:'scale(1.2)'}} />;
            iconTitle = (props.title?props.title:'');
            break;
        case 'person':
            iconType = <BsPerson className={ (props.className?props.className:'') } style={{transform:'scale(1.2)'}} />;
            iconTitle = (props.title?props.title:'');
            break;
        case 'truck':
            iconType = <TbTruck className={ (props.className?props.className:'') } style={{transform:'scale(1.2)'}} />;
            iconTitle = (props.title?props.title:'');
            break;
        case 'prancheta':
        case 'clipboard':
        case 'checklist':
            iconType = <TbClipboardCheck className={ (props.className?props.className:'') } style={{transform:'scale(1.3)'}} />;
            iconTitle = (props.title?props.title:'Chekclist');
            break;
        case 'exclamation':
            if(props?.animated){
                iconType = "wdqztrtx";
            }else{
                iconType = <HiOutlineExclamationCircle className={ (props.className?props.className:'') } style={{transform:'scale(1.1)'}} />;
            }               
            iconTitle = (props.title?props.title:'Alerta');
            customSize = (window.isMobile ? 27 : 18);
            break;
        case 'th':
        case 'blocos':
        case 'bloco':
        case 'box':
        case 'boxes':
            iconType = <TbLayoutGrid className={ (props.className?props.className:'') }/>;
            iconTitle = (props.title?props.title:'Blocos');
            break;
        default:
            if(props?.animated){
                iconType = 'wdqztrtx';
            }else{
                iconType = <FaExclamationTriangle className={ (props.className?props.className:'') } />
            }            
            iconTitle = (props.title?props.title:'ERRO: Ícone não encontrado');
            state = 'hover';
    }

    function addDays(date, days) {
        const copy = new Date(Number(date))
        copy.setDate(date.getDate() + days)
        return copy
    }

    //CONFIGURAÇÕES DE LANGUAGE PRO DATEPICKER
    const defaultDays = ['D', 'S', 'T', 'Q', 'Q', 'S',' S'];
    const defaultMonths = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const locale = {
    localize: {
        day: n => defaultDays[n],
        month: n => defaultMonths[n]
    },
        formatLong: {
            date: () => 'dd/mm/yyyy'
        }
    }

    // ESTADOS
    const [animation, setAnimation] = useState("hover");
    const [active, setActive] = useState(props?.active);
    const [size, setSize] = useState({ editWidth: (customSize ? customSize : (props?.customSize ? props?.customSize : (window.isMobile ? '27px' : '19px'))), editHeight: (customSize ? customSize : (props?.customSize ? props?.customSize : (window.isMobile ? '27px' : '19px'))) });
    const [currentColor, setCurrentColor] = useState('current-color');
    const [loading, setLoading] = useState((props.loading ? props.loading : false));

    // MUDA O ESTADO DE LOADING SEMPRE QUE RECEBE ALTERAÇÃO NA PROPS
    useEffect(() => {
        setLoading(props?.loading);
    },[props?.loading]);
    
    if(loading){    
        return(
            <Loader style={{marginLeft: -5, marginRight: 5}}/>
        )
    }else{
        return(
            <>
                {(() => {
                    let action;

                    if(props.disabled || props.readOnly){
                        action = null;
                    }else{
                        if(props.onClick){
                            action = props.onClick;
                        }else{
                            if(props.type=='print'){                            
                                action = () => window.print();
                            }else if(props.type=='excel'){
                                action = () => handleExport('xlsx');
                            }else if(props.type=='pdf'){
                                action = () => handleExport('pdf');
                            }
                        }
                    }

                    if(!iconTitle!=iconTitle===''){
                        <div
                            data-icon={true}
                            className={ style.iconContainer + ' ' + (props.size ? style.icon__size_lg : '') + ' ' + class_aux + ' ' + class_aux}
                            onClick={action}
                            onMouseEnter={ props.onMouseEnter }
                            onMouseLeave={ props.onMouseLeave }
                        >
                            {(props?.animated ? 
                                <>
                                    <lord-icon
                                        loading="lazy"
                                        src={importIcon(iconType)}
                                        trigger={trigger ? trigger : animation}
                                        target={(props?.target ? props.target : "[data-box_icon]")}
                                        colors={active ? 'primary:#10459e' : 'primary:'+(primaryColor ? primaryColor : '#97a3b3')}
                                        class={(props?.active ? '' : 'current-color') + ' ' + props?.className + ` ${style.ready}`}
                                        state={(state ? state : 'hover')}
                                        style={{
                                            width: size.editWidth,
                                            height: size.editHeight,
                                            cursor: (props.cursor ? props.cursor : 'pointer'),   
                                            transform: (scaleX ? 'scaleX(-1)' : '')
                                        }}
                                    />
                                </>
                            :
                                <>
                                    {iconType}
                                </>
                            )}
                        </div>
                    }else{
                        return(
                            <Tippy disabled={(props.title===false || window.isMobile ? true : false)} content={ iconTitle } >
                                {(props.datepicker?
                                    <div
                                        data-icon={true}
                                        className={style.iconContainer + ' ' + (props.size ? style.icon__size_lg : '') + ' ' + (props?.disabled?style.icon__disabled:'') + ' ' + (props?.readonly?style.icon__readonly:'') + ' ' + class_aux}
                                        style={props?.style}    
                                    >
                                        {(props?.animated ? 
                                            <>
                                                <lord-icon
                                                    loading="lazy"
                                                    src={importIcon(iconType)}
                                                    trigger={trigger ? trigger : animation}
                                                    target={(props?.target ? props.target : "[data-icon]")}
                                                    colors={active ? 'primary:#10459e' : 'primary:'+(primaryColor ? primaryColor : '#97a3b3')}
                                                    class={(props?.active ? '' : 'current-color') + ' ' + props?.className + ` ${style.ready}`}
                                                    state={(state ? state : 'hover')}
                                                    style={{
                                                        width: size.editWidth,
                                                        height: size.editHeight,
                                                        cursor: (props.cursor ? props.cursor : 'pointer'),
                                                        transform: (scaleX ? 'scaleX(-1)' : '')                                        
                                                    }}
                                                />
                                            </>
                                        :
                                            <>
                                                {iconType}
                                            </>
                                        )}

                                        <ReactDatePicker
                                            locale={locale}
                                            dateFormat="dd/MM/yyyy"
                                            selected={ props.value }
                                            value={ props.value }
                                            onChange={ props.onChange }
                                            includeDateIntervals={[{
                                                start: (props.valueStart?props.valueStart:new Date('01/01/1999')),
                                                end: addDays((props.valueStart?props.valueStart:new Date('01/01/3999')),100000)
                                            }]}
                                            renderCustomHeader={({
                                                date,
                                                changeYear,
                                                changeMonth,
                                                decreaseMonth,
                                                increaseMonth,
                                                prevMonthButtonDisabled,
                                                nextMonthButtonDisabled,
                                            }) => (
                                                <div className="react-datepicker__header_control">
                                                <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
                                                    {"<"}
                                                </button>
                                                
                                                <span>{defaultMonths[date.getMonth()]} {date.getFullYear()}</span>
                                        
                                                <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
                                                    {">"}
                                                </button>
                                                </div>
                                            )}
                                        />
                                    </div>
                                :
                                    <div
                                        className={
                                            style.iconContainer + ' ' +
                                            (props.size ? style.icon__size_lg : '') + ' ' +
                                            (props?.disabled?style.icon__disabled:'') + ' ' +
                                            (props?.readonly?style.icon__readonly:'') + ' ' +
                                            class_aux
                                        }
                                        data-box_icon={true}
                                        data-active={props?.active}
                                        onClick={action}
                                        onMouseEnter={ props.onMouseEnter }
                                        onMouseLeave={ props.onMouseLeave }
                                        style={props?.style}  
                                    >
                                        <div
                                            data-icon={true}   
                                            style={(props.color && props.color!=''?{opacity:1}:{})}                           
                                        >
                                            {(props?.badge ?
                                                <div className={style.badge}>{props?.badge}</div>
                                            :'')}
                                            
                                            {(props?.animated ? 
                                                <>
                                                    <lord-icon
                                                        loading="lazy"
                                                        src={importIcon(iconType)}
                                                        trigger={trigger ? trigger : animation}
                                                        target={(props?.target ? props.target : "[data-box_icon]")}
                                                        colors={(props?.active ? 'primary:#10459e' : 'primary:'+(primaryColor ? primaryColor : '#97a3b3'))}
                                                        class={(props?.active ? style.ready : currentColor) + ' ' + (props?.className ? props?.className : '') + ` ${style.ready}`}
                                                        state={(state ? state : 'hover')}
                                                        delay={0}
                                                        style={{
                                                            width: size.editWidth,
                                                            height: size.editHeight,
                                                            cursor: (props.cursor ? props.cursor : 'pointer'),   
                                                            marginLeft: rotate ? '-1px' : '',
                                                            marginRight: rotate ? '-1px' : '',
                                                            transform: (scaleX || rotate ? ((scaleX ? 'scaleX(-1)' : '') + (scaleX && rotate ? ' ' : '') + (rotate ? 'rotate('+rotate+'deg)' : '')) : '')             
                                                        }}
                                                    />
                                                </>
                                            :
                                                <>
                                                    {iconType}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </Tippy>
                        )
                    }
                })()}
            </>
        );
    }
}
