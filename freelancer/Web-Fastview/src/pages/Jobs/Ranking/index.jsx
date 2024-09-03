import { useContext, useEffect, useRef, useState } from "react";
import Container from "../../../components/body/container";
import axios from "axios";
import style from './style.module.scss';
import Modulo from "./Modulo";
import Loader from "../../../components/body/loader";
import Input from "../../../components/body/form/input";
import { JobsContext } from "../../../context/Jobs";
import FilterCheckbox from "../../../components/body/filterCheckbox";

export default function Ranking({icons, filters}){
    // ESTADOS
    const [modules, setModules] = useState([]);
    const [storeSelected, setStoreSelected] = useState(null);
    const [loading, setLoading] = useState(true);

    // ESTADOS DE FILTROS
    const [filterDate, setFilterDate] = useState(new Date());
    const [filterCategory, setFilterCategory] = useState([]);
    const [filterSubcategory, setFilterSubcategory] = useState([]);
    const [filterModule, setFilterModule] = useState([]);

    // CONTEXT JOBS
    const { filterEmpreendimento } = useContext(JobsContext);

    // ABORT AXIOS
    const abort = useRef(new AbortController());

    // BUSCA MÓDULOS
    useEffect(() => {
        setLoading(true);

        abort.current.abort();
        abort.current = new AbortController();

        axios({
            method: 'get',
            url: window.host_madnezz+'/systems/integration-react/api/request.php',
            params: {
                db_type: global.db_type,
                type: 'Job',
                do: 'getTable',
                tables: [{
                    table: 'moduleChamados',
                    filter: {
                        id_emp: window.rs_id_emp,
                        id: filterModule
                    }
                }]
            },
            signal: abort.current.signal
          }).then((response) => {
            if(response?.data?.data){
                setModules(response?.data?.data?.moduleChamados);
            }

            setLoading(false);
          });
    },[filterModule]);

    // CALLBACK DO COMPONENTE DO MÓDULO
    const handleCallbackModule = (e) => {
        if(e?.store){
            setStoreSelected(e?.store);
        }
    }

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
                </>
            );
        }
    }, [filterDate]);

    return(
        <Container>
            <div className={style.container}>
                {(loading ?
                    <div className={style.loader}>
                        <Loader />
                    </div>
                :
                    modules.map((module, i) => {
                        return(
                            <Modulo
                                key={module?.id}
                                index={i}
                                module={module}
                                selected={storeSelected}
                                filters={{
                                    filter_date: filterDate,
                                    filter_category: filterCategory,
                                    filter_subcategory: filterSubcategory,
                                    filter_module: filterModule
                                }}
                                callback={handleCallbackModule}
                            />
                        )
                    })
                )}
            </div>
        </Container>
    )
}