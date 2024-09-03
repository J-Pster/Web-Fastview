import { useState, useEffect, useRef } from 'react';
import style from './textarea.module.scss';

//EDITOR
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import './style.css';
import axios from 'axios';
import { Buffer } from 'buffer';
import toast from 'react-hot-toast';
import { Delta } from 'quill/core';
import Loader from '../../loader';

export default function Textarea(props) {
    // ESTADOS
    const [focus, setFocus] = useState(null);
    const [imgLoading, setImgLoading] = useState(false);

    // REF
    const ref = useRef(null);

    // FUNÇÃO AO FOCAR NO INPUT
    const handleFocus = () => {
        setFocus(true);
    }

    // FUNÇÃO AO TIRAR FOCO DO INPUT
    const handleFocusOut = () => {        
        if(focus){
            setFocus(false);
        }
    }

    useEffect(() => {
        if(focus === false) {
            if (props.onFocusOut) {
                props.onFocusOut(true);
            }
        }
    }, [focus])

    /**
     * Faz upload da imagem.
     * @param {string} base64Url 
     * @return {Promise<string>} img url
     */
    const uploadImg = async(base64Url) => {
        /**
             * @type {Array<string>}
            */
        const [type, img] = base64Url.split(',')
            
        const imgData = Buffer.from(img, "base64");
        
        const parsedType = type.match(/data:(.*);/)[0];
        const blob = new Blob([imgData], {type: parsedType});
        const form = new FormData();

        form.append('file', blob, parsedType.replace('/', '.'));


        return await axios.post(window.upload, form);

         
    }


    /**
     * 
     * @param {string} imgUrl 
     * @param {import('quill')} editor 
     */

    const updateDeltaImgEditor = async(imgUrl, editor) => {

        /**
         * @type {import('quill/core').Delta} newDelta
         */
        const newDelta  = new Delta();

        editor.updateContents(
            newDelta.retain((editor?.selection?.savedRange?.index ? editor?.selection?.savedRange?.index : 0) + 1).insert({
                //replace by imgUrl
                    image: `${window.upload}/${imgUrl}`
                })
            )

        editor.focus();
    }

    // const execUplodaImg = async(registry) => {
    //     const imgUrl = await uploadImg(registry);
    //     await 
    // }

    /**
     * 
     * @param {HTMLImageElement} node 
     */
    const handleImgMatcher = (node, delta) => {
        const registry = node.getAttribute("src");

        if(registry?.includes(window.upload)){
            return delta;
        }

        if(registry?.includes('file:')){
            toast('Imagem inválida');

            return {
                ops: [],
            };
        }

        setImgLoading(true);
        let tokenConfigurations = axios.defaults.headers.common['Tokenconfigurations'];
        delete axios.defaults.headers.common['Tokenconfigurations'];
        delete axios.defaults.headers.common['Authorization'];

        uploadImg(registry).then(({data}) =>{  
            updateDeltaImgEditor(data?.files[0][0], ref?.current?.editor)
            setImgLoading(false);
            axios.defaults.headers.common['Authorization'] = 'Bearer '+window.token;
            axios.defaults.headers.common['Tokenconfigurations'] = tokenConfigurations;
        });
        return {
          ops: [],
        };
     
    };


    //VARIAVEIS DO EDITOR

    const modules = {
        toolbar: [
            [{
                'color': ["#000000", "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff", "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc",
                    "#cce0f5", "#ebd6ff", "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff", "#888888", "#a10000", "#b26b00", "#b2b200",
                    "#006100", "#0047b2", "#6b24b2", "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466", 'custom-color']
            }],
            ['bold', 'italic', 'underline'],
            [{'align': ['', 'center', 'right', 'justify']}],
            (props?.editor?.size ? [{ 'size': ['small', false, 'large', 'huge'] }] : []),
            (props?.editor?.font ? [{ 'font': [] }] : []),
            ['link']
        ],
    };

    const formats = [
        'header',
        'color',
        'bold', 'italic', 'underline',
        'align',
        'link',
        'size',
        'font',
        'image'
    ];

    //DESATIVAR O CORRETOR
    // useEffect(()=>{
    //     ref?.current?.editor?.root?.setAttribute('spellcheck', 'false');
    // },[]);

    // DEFINE COR DA BORDA
    let border_color_aux; 
    if(props?.border){
        if(props?.border === 'primary'){
            if(props.editor){
                border_color_aux = 'border-primary';
            }else{
                border_color_aux = style.border__primary;
            }
        }else if(props?.border === 'danger'){
            if(props.editor){
                border_color_aux = 'border-danger';
            }else{
                border_color_aux = style.border__danger;
            }
        }
    }
  

    useEffect(() => {
        if(props?.editor){
            ref?.current?.editor?.clipboard?.addMatcher('IMG',handleImgMatcher)
        }
    }, [])

    return (
        <>
            {
                props.editor ?
                    <div
                        className={
                            'position-relative' + ' ' +
                            style.editor + ' ' +
                            (props.loading ? style.loading : '')
                        }
                    >
                        <ReactQuill
                            ref={ref}
                            placeholder={(props.label || props.placeholder ? (props.placeholder ? props.placeholder : props.label) : 'Textarea') + ': ' + (props.required === false ? '' : '*')}
                            value={(props.value ? props.value : '')}
                            onChange={props?.onChange}
                            className={style.input + ' ' + border_color_aux}
                            modules={modules}
                            required={props.required === false ? false : true}
                            formats={formats}
                            onKeyDown={props?.onKeyDown}
                            
                        />
                        <textarea
                            onKeyDown={props?.onKeyDown}
                            required={props.required === false ? false : true}
                            value={(props.value && props.value !== '<p><br></p>' && props.value !== '<p> </p>' && props.value !== '<p>  </p>' ? props.value : '')}
                            onChange={() => console.log('')}
                            className={style.hidden}
                        ></textarea>
                        {imgLoading && <div style={{position: 'absolute', zIndex: 999, right: 10, bottom: 5}}><Loader/></div>}
                    </div>
                :
                    <div
                        data-textarea
                        className={
                            style.box__textarea + ' ' +
                            (props.fullwith ? 'w-100' : '') + ' ' +
                            (props.className ? props.className : '') + ' ' +
                            (props.type == 'checkbox' ? style.checkbox : '') + ' ' +
                            (focus ? style.box__textarea_focus : '') + ' ' +
                            (props.alert ? style.border__alert : '') + ' ' +
                            (border_color_aux ? border_color_aux : '') + ' ' +
                            (props.disabled ? style.disabled : '') + ' ' +
                            (props.readonly ? style.readonly : '') + ' ' +
                            (props.error ? style.border__alert : '') + ' ' +
                            (props.loading ? style.loading : '')
                        }
                    >
                        {(() => {
                            return (

                                <textarea
                                    onKeyDown={props?.onKeyDown}
                                    ref={ref}
                                    className={style.input}
                                    type={(props.type === 'date' ? 'text' : props.type)}
                                    name={props.name}
                                    id={props.id}
                                    placeholder={(props.label || props.placeholder ? (props.placeholder ? props.placeholder : props.label) : 'Textarea') + ': ' + (props.required === false ? '' : '*')}
                                    onFocus={handleFocus}
                                    onBlur={handleFocusOut}
                                    value={(props.value ? props.value : '')}
                                    checked={props.checked}
                                    onChange={props.onChange}
                                    required={props.required === false ? false : true}
                                    style={{ height: (props.height ? props.height : '') }}
                                ></textarea>
                            )
                        })()}
                    </div>
            }
        </>
    );
}
