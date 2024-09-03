import { useContext, useEffect, useState } from 'react';
import Chamados from './Chamados';
import Jobs from './Jobs';
import Input from '../../../components/body/form/input';
import FilterCheckbox from '../../../components/body/filterCheckbox';
import { JobsContext } from '../../../context/Jobs';

export default function Dashboard({chamados, fases, visitas, icons, filters}){
    // ESTADOS
    const [filterDate, setFilterDate] = useState(new Date());
    const [filterCategory, setFilterCategory] = useState([]);
    const [filterSubcategory, setFilterSubcategory] = useState([]);
    const [filterModule, setFilterModule] = useState([]);

    // CONTEXT JOBS
    const { filterEmpreendimento } = useContext(JobsContext);

    // ENVIA ÍCONES E FILTROS PRO COMPONENTE PAI
    useEffect(() => {
        if (icons) {
            icons(
                <></>
            );
        }
        if (filters) {
            filters(
                <>
                    <Input
                        type="date"
                        format="mm/yyyy"
                        label={false}
                        value={filterDate}
                        required={false}
                        onChange={(e) => setFilterDate(e)}
                    />

                    {(chamados ?
                        <FilterCheckbox
                            name="filter_module"
                            grupo={(window.rs_id_grupo > 0 ? true : false)}
                            api={{
                                url: window.host_madnezz+"/systems/integration-react/api/request.php?type=Job",
                                params: {
                                    db_type: global.db_type,
                                    do: 'getTable',
                                    tables: [{
                                        table: 'moduleChamados',
                                        filter: {
                                            id_emp: filterEmpreendimento
                                        }
                                    }]
                                },
                                key_aux: ['data', 'moduleChamados'],
                                reload: [filterEmpreendimento].toString()
                            }}
                            onChangeClose={(e) => setFilterModule(e)}
                            value={filterModule}
                        >
                            Departamento
                        </FilterCheckbox>
                    : '')}

                    {(chamados ?
                        <FilterCheckbox
                            name="filter_category"
                            grupo={(window.rs_id_grupo > 0 ? true : false)}
                            api={{
                              url: window.host_madnezz+"/systems/integration-react/api/request.php?type=Job",
                              params: {
                                db_type: global.db_type,
                                do: 'getTable',
                                tables: [
                                  {table: 'category', filter: {id_emp: filterEmpreendimento}}
                                ]
                              },
                              key_aux: ['data', 'category']
                            }}
                            onChangeClose={(e) => setFilterCategory(e)}
                            value={filterCategory}
                        >
                            Categorias
                        </FilterCheckbox>
                    :'')}
                
                    {(chamados ?
                        <FilterCheckbox
                            name="filter_subcategory"
                            grupo={(window.rs_id_grupo > 0 ? true : false)}
                            api={{
                                url: window.host_madnezz+"/systems/integration-react/api/request.php?type=Job",
                                params: {
                                    db_type: global.db_type,
                                    do: 'getTable',
                                    tables: [{
                                        table: 'subcategory',
                                        filter: {
                                            id_emp: filterEmpreendimento,
                                            id_ite: filterCategory
                                        }
                                    }]
                                },
                                key_aux: ['data', 'subcategory'],
                                reload: [filterEmpreendimento, filterCategory].toString()
                            }}
                            onChangeClose={(e) => setFilterSubcategory(e)}
                            value={filterSubcategory}
                        >
                            Subcategorias
                        </FilterCheckbox>
                    : '')}
                </>
            );
        }
    }, [filterDate, filterCategory, filterSubcategory, filterModule]);

    if(false){ // COLOCAR IF DE CHAMADOS QUANDO BACK-END ESTIVER AJUSTADO
        return (
            <Chamados
                filters={{
                    filter_date: filterDate,
                    filter_category: filterCategory,
                    filter_subcategory: filterSubcategory,
                    filter_module: filterModule
                }}
            />
        )
    }else{
        return <Jobs />;
    }
}