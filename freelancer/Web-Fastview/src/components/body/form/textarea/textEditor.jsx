import { useState, createRef, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import style from './textarea.module.scss';
import { EditorState, convertFromRaw, convertFromHTML, convertToRaw, Modifier, Draft } from "draft-js";
import { ContentState, Editor } from "react-draft-wysiwyg";
import "./style.css";
import "../../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Bold from "../../../../_assets/uplodad/svgsNews/bold1.svg";
import Italic from "../../../../_assets/uplodad/svgsNews/italic2.svg";
import Link from "../../../../_assets/uplodad/svgsNews/link2.svg";
import Underline from "../../../../_assets/uplodad/svgsNews/underline2.svg";
import TextColor from "../../../../_assets/uplodad/svgsNews/txt-color.svg";
import AlignRight from "../../../../_assets/uplodad/svgsNews/align-right.svg";
import AlignLeft from "../../../../_assets/uplodad/svgsNews/align-left.svg";
import AlignCenter from "../../../../_assets/uplodad/svgsNews/align-center.svg";
import AlignJustify from "../../../../_assets/uplodad/svgsNews/align-justify.svg";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

export default function TextareaEditor(props) {

    // EDITOR DE TEXTO -- SENDO CRIADA VAZIA, SE CRIAR COM CONTEÚDO QUEBRA O APP
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    //     const [editorState, setEditorState] = useState (() => {
    //         const blocksFromHTML = convertFromHTML(props.value)
    //         const contentState = ContentState.createFromBlockArray(
    //           blocksFromHTML.contentBlocks,
    //           blocksFromHTML.entityMap
    //         );
    //         return EditorState.createWithContent(contentState)
    //     }
    //   )

    // FUNÇÃO CHAMADA TODA VEZ QUE TEM ALGUMA ALTERAÇÃO NO ESTADO DO EDITOR DE TEXTO
    const onEditorStateChange = (editorState) => {
        setEditorState(editorState);
    };

    //DEVERIA MOSTRAR O VALOR DA PROPS.VALUE NA TELA, MAS NÃO DEU CERTO
    // -- 1
    // const contentBlock = (textToEdit ? convertFromHTML(textToEdit) : '');
    //     if(textToEdit) {
    //         const contentState = editorState.getCurrentContent();
    //         const selection = editorState.getSelection();
    //         const newContentState = Modifier.insertText(contentState, selection, textToEdit);
    //         const nextEditorState = EditorState.push(editorState, newContentState, "insert-characters");
    //         setEditorState(nextEditorState)
    //     }

    // -- 4 -- > MOSTRA O TEXTO NO INPUT, MAS NÃO PERMITE MODIFICAR, E REPETE O TEXTO A CADA CLIQUE
    // function insertContent() { 
    //     const contentState = editorState.getCurrentState();
    //     const selection = editorState.getSelection();
    //     const newContentState = Modifier.insertText(contentState, selection, props.value);
    //     const nextEditorState = EditorState.push(editorState, newContentState, "insert-characters");
    //     setEditorState(nextEditorState)
    // }

    // const html = props.value ? props.value :  [
    //     {
    //       type: 'header-one',
    //       text: 'Hello World'
    //     },
    //     {
    //       type: 'unstyled',
    //       text: 'This is some text'
    //     }
    //   ] ;

    // const contentBlock = convertFromHTML(html);
    // if (contentBlock) {
    //   const contentState = ContentState.createFromBlockArray(convertFromRaw({blocks : html, entityMap: {}}).html);
    //   const editorState = EditorState.createWithContent(contentState);
    //   setEditorState(editorState)
    // }

    const [focus, setFocus] = useState(null);
    const [value, setValue] = useState(props.value);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const ref = createRef();

    return (
        <div
            data-textarea
            className={
                style.box__textarea + ' ' +
                (props.fullwith ? 'w-100' : '') + ' ' +
                (props.className ? props.className : '') + ' ' +
                (props.type == 'checkbox' ? style.checkbox : '') + ' ' +
                (focus ? style.box__textarea_focus : '')
            }
        >
            {(() => {
                return (
                    <>
                        <Editor
                            editorState={editorState} //PROPRIEDADE QUE ATUALIZA O ESTADO DO EDITOR DE FORMA CONTROLADA
                            toolbarClassName={style.toolbarClassName}
                            wrapperClassName={style.wrapperClassName}
                            editorClassName="editorClassName"
                            // onChange={props.onChange}
                            onEditorStateChange={onEditorStateChange} //FUNÇÃO CHAMADA CADA VEZ QUE ACONTECE UMA MUDANÇA NO ESTADO DO EDITOR 
                            localization={{
                                locale: 'pt',
                            }}
                            toolbar={{
                                options: ["colorPicker", "inline", "textAlign", "link"],
                                colorPicker: {
                                    icon: TextColor,
                                    className: 'option-icon',
                                },
                                textAlign: {
                                    className: undefined,
                                    left: { icon: AlignLeft, className: 'option-icon' },
                                    right: { icon: AlignRight, className: 'option-icon' },
                                    center: { icon: AlignCenter, className: 'option-icon' },
                                    justify: { icon: AlignJustify, className: 'option-icon' },
                                },
                                inline: {
                                    className: undefined,
                                    inDropdown: false,
                                    options: ['bold', 'italic', 'underline'],
                                    bold: { icon: Bold, className: 'option-icon' },
                                    italic: { icon: Italic, className: 'option-icon' },
                                    underline: { icon: Underline, className: 'option-icon' },
                                },
                                link: {
                                    className: undefined,
                                    options: ['link'],
                                    link: { icon: Link, className: 'option-icon' }
                                }
                            }}
                            ref={ref}
                            className={style.input}
                            type={(props.type === 'date' ? 'text' : props.type)}
                            name={props.name}
                            id={props.id}
                            placeholder={(props.label || props.placeholder ? (props.placeholder ? props.placeholder : props.label) : 'Textarea') + ': ' + (props.required === false ? '' : '*')}
                            onFocus={() => setFocus(true)}
                            onBlur={() => setFocus(false)}
                            value={(props.value ? props.value : '')}
                            checked={props.checked}
                            onChange={props.onChange}
                            required={props.required === false ? false : true}
                            style={{ height: (props.height ? props.height : '') }}
                        />
                    </>
                )
            })()}
        </div>
    )
}