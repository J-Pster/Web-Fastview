import { Navigate, Route, Routes } from "react-router";

// COMPONENTS
import { useContext, useState } from "react";
import { JobsContext } from "../../../context/Jobs";
import Navbar from '../../../components/header/navbar';
import NavbarLink from '../../../components/header/navbar/navbarLink';
import { GlobalContext } from "../../../context/Global";
import Loader from "../../../components/body/loader";

// PÁGINAS
import Main from '../Main';
import Lista from '../Lista/Jobs';
import Dashboard from '../Dashboard';
import Graficos from '../Graficos';
import Comunicados from '../Comunicados';
import Gerenciador from '../Gerenciador/Configuracoes';
import Fluxo from '../Gerenciador/Fluxo';
import ListaVisitas from '../Lista/Visitas';
import ListaChamados from '../Lista/Chamados';
import RelatorioAdesao from '../RelatorioAdesao';
import Supervisor from '../Main/Jobs/SupervisorVirtual';
import Log from '../Log';
import Timeline from '../Timeline';
import Ranking from '../Ranking';

export default function Router({chamados, fases, visitas, comunicados, widget}){
    // GLOBAL CONTEXT
    const { disabledFilter } = useContext(GlobalContext);

    // JOBS CONTEXT
    const { configuracoes } = useContext(JobsContext);

    // CONFIGURAÇÕES
    let conf_default_screen;

    if(configuracoes){
        if(configuracoes?.filter((elem) => elem.conf_tipo === 'preferencias')[0]?.conf_configuracao && !chamados && !fases && !visitas && !comunicados){
            // VERIFICA SE TEM PREFERÊNCIA DO USUÁRIO, SE NÃO, PEGA O DO EMPREENDIMENTO/GRUPO
            let json_aux = configuracoes?.filter((elem) => elem.conf_tipo === 'preferencias');
        
            if(json_aux.filter((elem) => elem.id_usr && elem.id_usr == global.rs_id_usr).length > 0){
            json_aux = json_aux.filter((elem) => elem.id_usr)[0]?.conf_configuracao;
            conf_default_screen = JSON.parse(json_aux)?.default_screen;
            }else{
                if(json_aux.filter((elem) => elem?.id_emp == window?.rs_id_emp).length > 0){
                    json_aux = json_aux[0]?.conf_configuracao;
                    conf_default_screen = JSON.parse(json_aux)?.default_screen;
                }          
            }        
        }else{
            if(window?.rs_id_lja > 0){
                conf_default_screen = 1;
            }else{
                if(chamados || fases || visitas){
                    conf_default_screen = 1;
                }else{
                    conf_default_screen = 2;
                }            
            }
        }
    }

    // VARIÁVEIS
    let view_aux;
    let title_aux;

    // DEFINE O TÍTULO DO LINK DE ACORDO COM SISTEMA
    if(chamados){
        if(window.rs_sistema_id == global.sistema.manutencao_madnezz){
            title_aux = 'Manutenção';
        }else{
            title_aux = 'Chamados';
        }
    }else if(fases){
        title_aux = 'Fases';
    }else if(visitas){
        title_aux = 'Visitas';
    }else{
        title_aux = 'Meus Jobs';
    }

    // DEFINE A VIEW DE ACORDO COM PERMISSÃO E SISTEMA
    if(conf_default_screen && window.rs_permission_apl !== 'lojista'){
        view_aux = conf_default_screen;
    }else{
        if((window.rs_permission_apl === 'supervisor' || window.rs_permission_apl === 'leitura' || window.rs_permission_apl === 'master') && !chamados && !fases && !visitas){
            if(widget){
                view_aux = 1;
            }else{
                view_aux = 2;
            }
        }else{
            view_aux = 1;
        }
    }
 
    // ESTADOS
    const [icons, setIcons] = useState(null);
    const [filters, setFilters] = useState(null);
    const [permission, setPermission] = useState(null);

    // DEFINE FILTROS NAVBAR
    const handleSetFilters = (e) => {
        setFilters(e);
    }

    // DEFINE ICONS NAVBAR
    const handleSetIcons = (e) => {
        setIcons(e);
    }

    // DEFINE PERMISSÃO DO USUÁRIO DE ACORDO COM O MÓDULO
    const handleSetPermission = (e) => {
        if(chamados){
            setPermission(e);
        }else{
            setPermission(window.rs_permission_apl);
        }
    } 

    if(configuracoes){
        if(configuracoes?.length == 0 || configuracoes[0]?.id_apl == window.rs_id_apl){
            return(
                <>
                    <Navbar
                        filters={(filters ? filters : global.filters)}
                        icons={icons}
                        disabled={disabledFilter}
                    >
                        {((window.rs_permission_apl === 'supervisor' || window.rs_permission_apl === 'leitura' || window.rs_permission_apl === 'master') && !chamados && !fases && !visitas ? // SE FOR NÍVEL SUPERVISOR OU MAIOR (MASTER)
                            <NavbarLink link={'/systems/'+window.link+'/calendario/'+(conf_default_screen && conf_default_screen === 4 ? conf_default_screen : '2' )+'/'} name={conf_default_screen && conf_default_screen === 4 ? 'Usuários' : 'Lojas'} icon="calendar" />
                        :'')}

                        <NavbarLink link={'/systems/'+window.link+'/calendario/1/'} name={title_aux} icon="history" />

                        {/* RELATÓRIO DE VISITAS CASO TENHA PERMISSÃO DE "SUPERVISOR", "LEITURA" OU "MASTER" */}
                        {(visitas && (window.rs_permission_apl === 'supervisor' || window.rs_permission_apl === 'leitura' || window.rs_permission_apl === 'master') ? 
                            <NavbarLink link={'/systems/' + window.link + '/relatorio2/'} name="Relatório" icon="relatorio" />
                        :'')}

                        {/* RELATÓRIO DOS DEMAIS SISTEMAS ALÉM DO VISITAS */}
                        {(!visitas ?
                            <NavbarLink link={'/systems/' + window.link + '/relatorio/'} name="Relatório" icon="relatorio" />
                        :'')}

                        {/* LOG SOMENTE PARA MADNEZZ E EM JOBS COM PERMISSÃO MASTER */}
                        {(window.rs_id_emp==26 && !chamados && !fases && !visitas && window.rs_permission_apl === 'master' ?
                            <NavbarLink link={'/systems/'+window.link+'/log/'} name="Log" icon="document" />    
                        :'')}

                        {/* TIMELINE SOMENTE PARA MADNEZZ E EM JOBS COM PERMISSÃO MASTER */}
                        {(window.rs_id_emp==26 && !chamados && !fases && !visitas && window.rs_permission_apl === 'master' ?
                            <NavbarLink link={'/systems/'+window.link+'/timeline/'} name="Timeline" icon="timeline" />    
                        :'')}

                        {((window.rs_permission_apl === 'supervisor' || window.rs_permission_apl === 'leitura' || window.rs_permission_apl === 'master') && window.rs_sistema_id != global.sistema.manutencao ? // SE FOR NÍVEL SUPERVISOR OU MAIOR (MASTER)
                            <NavbarLink link={'/systems/'+window.link+'/dashboard/'} name="Dashboard" icon="analytics" />
                        :'')}

                        {/* RANKING (CHAMADOS) - BACK-END PENDENTE */}
                        {/* {(chamados && (window.rs_permission_apl === 'supervisor' || window.rs_permission_apl === 'leitura' || window.rs_permission_apl === 'master') && window.rs_sistema_id != global.sistema.manutencao ? // SE FOR NÍVEL SUPERVISOR OU MAIOR (MASTER) E ESTIVER NO SISTEMA DE CHAMADOS
                            <NavbarLink link={'/systems/'+window.link+'/ranking/'} name="Ranking" icon="trend" />
                        :'')} */}

                        {/* {(window.rs_permission_apl === 'supervisor' || window.rs_permission_apl === 'leitura' || window.rs_permission_apl === 'master' ? // SE FOR NÍVEL SUPERVISOR OU MAIOR (MASTER)
                            <NavbarLink link={'/systems/'+window.link+'/graficos/'} name="Gráficos" icon="chart" />
                        :'')} */}

                        {(!chamados && !fases && !visitas ?
                            <NavbarLink link={'/systems/' + window.link + '/comunicados/'} name="Comunicados" icon="inbox" />
                            : ''
                        )}

                        {/* RELATÓRIO DE ADESÃO SOMENTE PARA A FASTVIEW PROVISORIAMENTE */}
                        {(!chamados && !fases && !visitas && global.client === 'fastview' && (window.rs_permission_apl === 'supervisor' || window.rs_permission_apl === 'leitura' || window.rs_permission_apl === 'master') ?
                            <NavbarLink link={'/systems/' + window.link + '/relatorio-adesao/'} name="Relatório de Adesão" icon="trend" />
                            : ''
                        )}

                        {/* CRAVADO ALGUNS USUÁRIOS POR NÃO TER UM AMBIENTE DE DEV DO REACT */}
                        {((global.client === 'fastview' && (window.rs_id_usr == 97558 || window.rs_id_usr == 98270 || window.rs_id_usr == 102721 || window.rs_id_usr == 102633 || window.rs_id_usr == 102566 || window.rs_id_usr == 95928)) && (!chamados && !fases && !visitas) && (permission === "supervisor" || permission === "leitura" || permission === "master") ?
                            <NavbarLink link={"/systems/" + window.link + "/supervisor/"} name="Supervisor Virtual" icon="user" />
                        :'')}

                        {(window.rs_permission_apl === 'master' &&  window.rs_sistema_id != global.sistema.manutencao_madnezz ?
                            <NavbarLink link={'/systems/' + window.link + '/gerenciador/'} name="Gerenciador" icon="cog" />
                        :'')}

                        {/* CRAVADO ID DO SHOPPING CONTOSO E MADNEZZ NESSE MOMENTO PARA REALIZAREM TODOS OS TESTES */}
                        {((window.rs_id_emp == 5 || window.rs_id_emp == 26) && window.rs_permission_apl === 'master' && chamados && window.rs_sistema_id != global.sistema.manutencao_madnezz ?
                            <NavbarLink link={'/systems/' + window.link + '/fluxo/'} name="Fluxo de chamados" icon="flow" />
                        :'')}
                    </Navbar>

                    <Routes>
                        <Route path="/" index={true} element={ <Navigate to={'/systems/'+window.link+'/calendario/'+view_aux+'/'} replace /> } />
                        <Route path="calendario/:view" element={ <Main chamados={chamados} fases={fases} visitas={visitas} view={':view'} filters={handleSetFilters} icons={handleSetIcons} permission={handleSetPermission}  /> } />
                        <Route path="calendario/:view/:store" element={ <Main chamados={chamados} fases={fases} visitas={visitas} view={':view'} filters={handleSetFilters} icons={handleSetIcons} permission={handleSetPermission} /> } />
                        <Route path="calendario/:view/:store/:periodStart" element={ <Main chamados={chamados} fases={fases} visitas={visitas} view={':view'} filters={handleSetFilters} icons={handleSetIcons} permission={handleSetPermission} /> } />
                        <Route path="calendario/:view/:store/:periodStart/:periodEnd" element={ <Main chamados={chamados} fases={fases} visitas={visitas} view={':view'} filters={handleSetFilters} icons={handleSetIcons} permission={handleSetPermission} /> } />   
                        <Route path="calendario/:view/:store/:periodStart/:periodEnd/:status" element={ <Main chamados={chamados} fases={fases} visitas={visitas} view={':view'} filters={handleSetFilters} icons={handleSetIcons} permission={handleSetPermission} /> } />                         
                        <Route path="calendario/:view/:store/:periodStart/:periodEnd/:status/:category" element={ <Main chamados={chamados} fases={fases} visitas={visitas} view={':view'} filters={handleSetFilters} icons={handleSetIcons} permission={handleSetPermission} /> } />              
                        <Route path="calendario/:view/:store/:periodStart/:periodEnd/:status/:category/:user" element={ <Main chamados={chamados} fases={fases} visitas={visitas} view={':view'} filters={handleSetFilters} icons={handleSetIcons} permission={handleSetPermission} /> } />              

                        {(() => {
                            if(visitas){
                                return(
                                (window.rs_permission_apl === 'supervisor' || window.rs_permission_apl === 'leitura' || window.rs_permission_apl === 'master' ? // SE FOR NÍVEL SUPERVISOR OU MAIOR (MASTER)
                                    <Route path="relatorio2" element={<ListaVisitas chamados={chamados} fases={fases} visitas={visitas} icons={handleSetIcons} filters={handleSetFilters} />} />
                                :'')
                                )
                            }else if(chamados){
                                return <Route path="relatorio" element={ <ListaChamados chamados={chamados} fases={fases} visitas={visitas} icons={handleSetIcons} filters={handleSetFilters} /> } />;
                            }else{
                                return <Route path="relatorio" element={ <Lista chamados={chamados} fases={fases} visitas={visitas} icons={handleSetIcons} filters={handleSetFilters} />} />;
                            }
                        })()}

                        {((window.rs_permission_apl === 'supervisor' || window.rs_permission_apl === 'leitura' || window.rs_permission_apl === 'master') && window.rs_sistema_id != global.sistema.manutencao ? // SE FOR NÍVEL SUPERVISOR OU MAIOR (MASTER)
                        <Route path="dashboard" element={ <Dashboard chamados={chamados} fases={fases} visitas={visitas} filters={handleSetFilters} icons={handleSetIcons} /> } />
                        :'')}

                        {(chamados && (window.rs_permission_apl === 'supervisor' || window.rs_permission_apl === 'leitura' || window.rs_permission_apl === 'master') && window.rs_sistema_id != global.sistema.manutencao ? // SE FOR NÍVEL SUPERVISOR OU MAIOR (MASTER) E ESTIVER NO SISTEMA DE CHAMADOS
                            <Route path="ranking" element={ <Ranking chamados={chamados} fases={fases} visitas={visitas} filters={handleSetFilters} icons={handleSetIcons} /> } />
                        :'')}

                        {(!chamados && !fases && !visitas ?
                        <Route path="comunicados" element={<Comunicados filters={handleSetFilters} icons={handleSetIcons} />} />
                        : ''
                        )}

                        {/* RELATÓRIO DE ADESÃO SOMENTE PARA A FASTVIEW PROVISORIAMENTE */}
                        {(!chamados && !fases && !visitas && global?.client === 'fastview' && (window.rs_permission_apl === 'supervisor' || window.rs_permission_apl === 'leitura' || window.rs_permission_apl === 'master') ?
                        <Route path="relatorio-adesao" element={<RelatorioAdesao filters={handleSetFilters} icons={handleSetIcons} />} />
                        : ''
                        )}

                        {/* LOG SOMENTE PARA MADNEZZ E EM JOBS COM PERMISSÃO MASTER */}
                        {(window.rs_id_emp==26 && !chamados && !fases && !visitas && window.rs_permission_apl === 'master' ?
                            <Route path="log" element={  <Log chamados={chamados} fases={fases} visitas={visitas} icons={handleSetIcons} filters={handleSetFilters} /> } />
                        :'')}

                        {/* TIMELINE SOMENTE PARA MADNEZZ E EM JOBS COM PERMISSÃO MASTER */}
                        {(window.rs_id_emp == 26 && !chamados && !fases && !visitas && window.rs_permission_apl === 'master' ?
                            <Route path="timeline" element={  <Timeline chamados={chamados} fases={fases} visitas={visitas} icons={handleSetIcons} filters={handleSetFilters} /> } />
                        :'')}

                        {(window.rs_permission_apl === 'supervisor' || window.rs_permission_apl === 'leitura' || window.rs_permission_apl === 'master' ? // SE FOR NÍVEL SUPERVISOR OU MAIOR (MASTER)
                            <Route path="graficos" element={ <Graficos chamados={chamados} fases={fases} visitas={visitas} icons={handleSetIcons} filters={handleSetFilters} /> } />
                        :'')}

                        {((!chamados && !fases && !visitas) && (window.rs_permission_apl === "supervisor" || window.rs_permission_apl === "leitura" || window.rs_permission_apl === "master") ?
                            <Route path="supervisor" element={<Supervisor chamados={chamados} fases={fases} visitas={visitas} filters={handleSetFilters} icons={handleSetIcons} />}/>
                        :'')}

                        {(window.rs_permission_apl === 'master' &&  window.rs_sistema_id != global.sistema.manutencao_madnezz ?
                            <Route path="gerenciador" element={<Gerenciador chamados={chamados} fases={fases} visitas={visitas} id_emp={(window.rs_id_emp == 26 ? null : window.rs_id_emp)} integrated={false} filters={handleSetFilters} icons={handleSetIcons} />} />
                        :'')}

                        {(window.rs_permission_apl === 'master' && chamados && window.rs_sistema_id != global.sistema.manutencao_madnezz ?
                            <Route path="fluxo" element={<Fluxo chamados={chamados} fases={fases} visitas={visitas} id_emp={(window.rs_id_emp == 26 ? null : window.rs_id_emp)} integrated={false} filters={handleSetFilters} icons={handleSetIcons} />} />
                        :'')}
                    </Routes>
                </>
            )
        }
    }else{
        return(
            <div
                className={'position-absolute w-100 d-flex align-items-center justify-content-center'}
                style={{top: 63, left: 0, height: 'calc(100% - 63px)'}}
            >
                <Loader />
            </div>
        )
    }
}
