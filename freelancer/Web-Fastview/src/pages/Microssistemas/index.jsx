import { Routes, Route, useParams } from 'react-router-dom';
import Sidebar from '../../components/body/sidebar';
import SidebarLink from '../../components/body/sidebar/sidebarlink';
import { decrypt } from '../../_assets/js/global';
import axios from 'axios';

// PÁGINAS
import Lista from './Lista';
import { JobsProvider } from "../../context/Jobs";

export default function Microssistemas(){
  const params = useParams();    
  const paramsUrl = params['*'].substring(params['*'].indexOf('/')+1);
  const paramsUrlCount = (paramsUrl.match(/\//g)?paramsUrl.match(/\//g).length:0);
  var tokenUrl, idJob;

  if(paramsUrlCount>0){
    tokenUrl = params['*'].substring(params['*'].indexOf('/') + 1, params['*'].lastIndexOf('/'));
    idJob = params['*'].substring(params['*'].lastIndexOf('/') + 1)
  }else{
    tokenUrl = params['*'].substring(params['*'].indexOf('/')+1);
  }

  var decryptedReturn = JSON.parse(decrypt(tokenUrl));
  
  window.token = tokenUrl;
  axios.defaults.headers.common['Authorization'] = 'Bearer '+window.token;
  window.rs_id_grupo = decryptedReturn.id_grupo;
  window.rs_id_emp = decryptedReturn.id_emp; 
  window.rs_id_usr = decryptedReturn.id_usr;
  window.rs_id_lja = decryptedReturn.id_lja;
  window.rs_name_usr = decryptedReturn.name_usr;
  window.rs_id_apl = decryptedReturn.id_apl;
  window.rs_sistema_id = decryptedReturn.sistema_id;
  window.rs_permission_apl = decryptedReturn.pus;

  return (
    <>
        <Sidebar>
          <SidebarLink link={'/systems/microssistemas-react/lista/'+window.token} name="Lista" />
        </Sidebar>

        <JobsProvider>  
          <Routes>
              <Route path="/:token" index={true} element={ <Lista /> } />
              <Route path="lista/:token" element={ <Lista /> } />
          </Routes>
        </JobsProvider>
    </>
  );
}
