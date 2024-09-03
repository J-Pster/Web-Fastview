import ChartCustom from '../../../../../../../components/body/chart';
import Icon from '../../../../../../../components/body/icon';
import style from '../../style.module.scss';

export default function Item({title, type, info, id, points, qtd}){
    
    // CORES GRÁFICO
    const colors = ['4374e0', '53a8fb', 'd3362d', 'ddd'];

    return(
        <div className={style.card}>
            <div className={style.card_container}>
                <div className={style.left}>
                    <div>
                        <span className={style.title}>
                            {title}
                        </span>

                        <div className={style.numbers}>
                            <div>
                                <Icon type="trend" readonly title={false} className="me-1" />
                                <span className={'text-primary'}>{points?.rechead} pontos</span> Max.{points?.total}
                            </div>

                            <div>
                                <Icon type="user" readonly title={false} className="me-1" />
                                <span className={'text-primary'}>{qtd}</span> {type}
                            </div>
                        </div>

                        <div className={style.legend}>
                            {info?.map((item, i) => {
                                return(
                                    <p key={'numero_item_'+id+'_'+i}>
                                        <span className={style.dot} style={{backgroundColor: '#'+colors[i]}}></span> {item[1]} {item?.[0]}
                                    </p>
                                )    
                            })}
                        </div>
                    </div>
                </div>       

                <div className={style.right}>
                    <div>
                        <ChartCustom
                            type="PieChart"
                            headers={["Info 1", "Info 2"]}
                            colors={colors}
                            height={180}
                            pieHole={0.5}
                            legend={{
                                position: 'none'
                            }}
                            chartArea={{
                                width: '92%',
                                height: '92%',
                                top: '4%',
                                left: '4%'
                            }}
                            body={{
                                content: info
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
