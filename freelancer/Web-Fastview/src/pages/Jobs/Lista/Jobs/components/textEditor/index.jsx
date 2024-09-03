import { useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.bubble.css";


import Bold from "../../../../../_assets/uplodad/svgsNews/bold1.svg";
import Italic from "../../../../../_assets/uplodad/svgsNews/italic2.svg";
import Link from "../../../../../_assets/uplodad/svgsNews/link2.svg";
import Underline from "../../../../../_assets/uplodad/svgsNews/underline2.svg";
import TextColor from "../../../../../_assets/uplodad/svgsNews/txt-color.svg";
import AlignRight from "../../../../../_assets/uplodad/svgsNews/align-right.svg";
import AlignLeft from "../../../../../_assets/uplodad/svgsNews/align-left.svg";
import AlignCenter from "../../../../../_assets/uplodad/svgsNews/align-center.svg";
import AlignJustify from "../../../../../_assets/uplodad/svgsNews/align-justify.svg";

// import "./style.css"

export default function QuillTextEditor(props) {

    // 1 COR / 2 BOLD / 3 ITALIC / 4 UNDERLINE / 5 DIREITA, 6 ESQUERDA, 7 CENTRO, 8 JUSTIFICADO / 9 LINK / 10 REGUA ?

    const modules = {
        toolbar: [
            // [{ 'header': '' }],
            [{
                'color': ["#000000", "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff", "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc",
                    "#cce0f5", "#ebd6ff", "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff", "#888888", "#a10000", "#b26b00", "#b2b200",
                    "#006100", "#0047b2", "#6b24b2", "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466", 'custom-color']
            }],
            ['bold', 'italic', 'underline'], [{ 'align': '' }, { 'align': 'center' }, { 'align': 'right' }, { 'align': 'justify' }],
            ['link']
        ]
    };

    const formats = [
        'header',
        'color',
        'bold', 'italic', 'underline',
        'align',
        'link',
    ];

    // tentar mudar os ícones

    // let newIcons = Quill.import("ui/icons");

    // newIcons['color'] = <button><img src={TextColor} /> </button>;
    // newIcons['bold'] = <button><img src={Bold} alt={Bold} /></button>;
    // newIcons['italic'] = <button><img src={Italic} alt={Italic} /></button>;
    // newIcons['underline'] = <button><img src={Underline} alt={Underline} /></button>;
    // newIcons["align: ''"] = <button><img src={AlignLeft} alt={AlignLeft} /></button>;
    // newIcons["align: right"] = <button><img src={AlignRight} alt={AlignRight} /></button>;
    // newIcons["align: center"] = <button><img src={AlignCenter} alt={AlignCenter} /></button>;
    // newIcons["align: justify"] = <button><img src={AlignJustify} alt={AlignJustify} /></button>;
    // newIcons['link'] = <button><img src={Link} alt={Link} /></button>

    // var icons = Quill.import('ui/icons');
    // //icons['header']['2'] = '<img src="/static/editor-icon/editor-new/H.png" class="fm_editor_icon">';
    // icons
    // icons['bold'] = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAyVJREFUaEPtmEtoE1EUhv8zSV36QvBddVdwK6UF9z4QW3euC/UBom0mfUwSMzMhzaRtJq0IQqvWrTtrsRtxJQgt3dudosWiCGq3JrlH7pRCG5KSOxNbCnPJLuf+//nOOXPnQdjji/Z4/ggBdruDYQfCDgSsgPII2Y77kCA6IqKlJ5ns+xHQ39tujY0dQyU6Q+APpqGPqGj6ASgBiIKpx0zEXqiY1YvNOG4PA88BlE1Db1HR9APA0oDAt9NGfFrFrD5A4RaDpuT/pqEr5aQULA1sxw0BqjuRccIOND7J4QjVqFU4Qo0PUHgK1axVOELhCKlUIDyFtlYgfBYKOD3e9h09hcyc+0cjHABo0DRi480AsB13CECegd+WoR9W0fQzQssA2gCaMI1YTMWsXqztFCcBfgDgo2no51U0lQEyjvuagesCWLINvV3FrC5AbnwJpF0gwmx6WL+houkDYP3ZneXSomft4b6vKobVsdls4UxZw2eSC9ybNuLPVPSUAeQLOFUiXwDsA4spMzFwR8WwOtbOu9Ng9AL4GxWRVtUPBcoAMgHLcR8TcE++hBOLi+nEwKIfiExuopNJvPc+EoAemUasT1XHF8DIyOTRklZZJuAQGKsRgY5USl9RMTfzk63E5QUCHQfzrxbsa0sk7v9U0ZCxvgC8l/t84RILzBNRREIQcXfaiC81koA1WmyHELNe8kCZoV2xjP53jeytjvENsHEDEownEoKZSyA8jVa0XCoV+1YrmWy2eLKicRLkzXzUG0HwXdULd7N2IID166F4mZlfrt/cvCUYvEjQFgCxQkzydwoQnQDJY1eTQfKmBdBNy4i99VP5jT2BATyIQuEIlSgOoN87nbZfZQbNIFI2rcHB70GSD3QN1DK2RkdPEEe7iMU1IXCONDrtVVvwCrTIJw14I7TSnDU0tBo08aZ2oFnJ+NFpygj5MW7WHmUAO1/sYsbVZiWwRYd53krocyra6gBOYQ2g/SomjcYKxpqd0A82Gu/rIrYdNwkW3UyaMvx2iRELKfkqPRzP/VcAFfGdiG1qFXci4WqPEGA3qr7ZM+xA2IGAFfgHeCaaQAzr654AAAAASUVORK5CYII=" class="fm_editor_icon">';
    // //icons['bold'] = `<img src=${{Bold}} className="fm_editor_icon`;
    // icons['italic'] = '<img src="/static/editor-icon/editor-new/italic.png" class="fm_editor_icon" id="fm_icon_italic">';
    // icons['underline'] = '<img src="/static/editor-icon/editor-new/line.png" class="fm_editor_icon">';
    // icons['strike'] = '<img src="/static/editor-icon/editor-new/delete.png" class="fm_editor_icon">';
    // //icons['blockquote'] = '<img src="/static/editor-icon/editor-new/quote.png" class="fm_editor_icon">';
    // icons['list'] = '<img src="/static/editor-icon/editor-new/list.png" class="fm_editor_icon">';

    // // const customToolBar = () => { }

    // var icons = Quill.import('ui/icons');
    // icons['color'] = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAX5JREFUOE+l07tKA1EQBuB/DngDLUTs1ELUN4iNELA1voGFsZeAuyZ4UrizAbNiLkKw1tj4BMbWQrCI+AQBG62ECBJFV2VHNhg1MVlvpz3/fMzADOGfjzrVM7OiroFj/1+ea7PM7LXLdgTszUwEog7rgCDCSfPoV0DKyZQEaq4OgEqsjfkfA+xsjxO8CoCnt6JugZpkvXLRirQdwXayWwDFBdgFoAiIApKx9GriWyCfz/fdut6lAg2JohBeyCPlnXuQKrl3I8z8+Bn50kHKyUUF2ANwamlzxg9bTq6sgBCEolbS2A8EGmEiWlhfMw78cAP1gDNbm9MdgZSTDQmoDMH1YH/XWCwWc/1woVDoubl3LwlqmCDT63r1rIE0jWA72SJAi0HLKUCRtbn0BUind4aeyb0C0BsIiDx0o3c0mVyu+rn3DmwnHwdkK2hpPpaLEpY2Mi1AtgLQRNDacjo3R4SSgCqsjalmYCN3IgoEtxbudDiNA/NzrM1wE/DXq34FtWyaEWJlhc0AAAAASUVORK5CYII=" class="fm_editor_icon">';

    return (
        <div className="quill-component-editor">
            <ReactQuill
                placeholder={props.label}
                theme="snow"
                value={(props.value ? props.value : '')}
                onChange={props.onChange}
                modules={modules}
                formats={formats}
            />
        </div>
    )
}