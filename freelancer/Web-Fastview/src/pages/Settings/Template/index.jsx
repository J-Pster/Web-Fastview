import Form from "../../../components/body/form";
import Icon from "../../../components/body/icon";
import Title from "../../../components/body/title";
import style from './style.module.scss';
import { useCookies } from 'react-cookie';

export default function Template(){
    // COOKIES
    const [cookies, setCookie] = useCookies(['template']);

    // CORES
    const items = ['#00743a', '#006d88', '#81a48c', '#af2431', '#a61260', '#132651', '#0396d8', '#0f0f0f'];

    // SELECIONA COR
    const handleSetColor = (e) => {
        setCookie('template', e);
    }

    return(
        <>
            <Title>Template</Title>

            <Form>
                <div className={style.color_container}>
                    {(items.map((item, i) => {
                        return(
                            <div
                                key={'color_'+item}
                                className={style.color}
                                style={{backgroundColor: item}}
                                onClick={() => handleSetColor(item)}
                            >
                                {cookies?.template == item ?
                                    <Icon
                                        type="aprovar"
                                        readonly
                                        title={false}
                                    />
                                :''}
                            </div>
                        )
                    }))}           

                    <div
                        className={style.color + ' ' + style.blank}
                        onClick={() => handleSetColor(null)}
                    >
                        {cookies?.template === null ?
                            <Icon
                                type="aprovar"
                                readonly
                                title={false}
                            />
                        :''}
                    </div>         
                </div>
            </Form>
        </>
    )
}
