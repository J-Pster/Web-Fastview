import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import "tippy.js/dist/tippy.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import './_assets/css/global.scss';
import './_assets/css/bootstrap-custom.scss';
import toast, { Toaster, ToastBar } from 'react-hot-toast';
import Icon from './components/body/icon';
import { AuthProvider } from './context/Auth';
import { GlobalContext } from './context/Global';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Cropper from './components/body/upload/components/Cropper';
import Auth from "./auth";
import ProtectedRoutes from './pages/ProtectedRoutes';
import { CookiesProvider } from 'react-cookie';
import Modal from './pages/Comunicados/Modal';

// VARIÁVEIS GLOBAIS
import './_assets/js/variaveis';

function App() {   
 
  // GLOBAL CONTEXT
  const { src, openImageCropper, toggler, handleSetToggler, sources, sourceIndex } = useContext(GlobalContext);

  // ESTADOS LIGHTBOX
  const [maxZoomPixelRatio, setMaxZoomPixelRatio] = useState(2);
  const [zoomInMultiplier, setZoomInMultiplier] = useState(5);
  const [doubleTapDelay, setDoubleTapDelay] = useState(300);
  const [doubleClickDelay, setDoubleClickDelay] = useState(300);
  const [doubleClickMaxStops, setDoubleClickMaxStops] = useState(2);
  const [keyboardMoveDistance, setKeyboardMoveDistance] = useState(50);
  const [wheelZoomDistanceFactor, setWheelZoomDistanceFactor] = useState(100);
  const [pinchZoomDistanceFactor, setPinchZoomDistanceFactor] = useState(100);
  const [scrollToZoom, setScrollToZoom] = useState(false);

  // ESTADOS
  const [width, setWidth] = useState(window.innerWidth);    

  function handleWindowSizeChange() {
      setWidth(window.innerWidth);
  }
  useEffect(() => {
      window.addEventListener('resize', handleWindowSizeChange);
      return () => {
          window.removeEventListener('resize', handleWindowSizeChange);
      }
  }, []);

  window.isMobile = width <= 768;
  
  //PEGAR DATA E HORA ATUAL
  var currentDateValue = new Date();
  var currentDay = currentDateValue.getDate();
  var currentMonth = currentDateValue.getMonth() + 1;
  var currentYear = currentDateValue.getFullYear();
  var currentHour = currentDateValue.getHours();
  var currentMinutes = currentDateValue.getMinutes();
  var currentSeconds = currentDateValue.getSeconds();
  var currentLastDatemMonth = new Date(currentDateValue.getFullYear(), currentDateValue.getMonth() + 1, 0);
  window.currentDate = currentYear + "-" + (currentMonth < 10 ? "0" + currentMonth : currentMonth) + "-" + (currentDay < 10 ? "0" + currentDay : currentDay) + " " + (currentHour < 10 ? "0" + currentHour : currentHour) + ":" + (currentMinutes < 10 ? "0" + currentMinutes : currentMinutes) + ":" + (currentSeconds < 10 ? "0" + currentSeconds : currentSeconds);
  window.currentDateWithoutHour = currentYear + "-" + (currentMonth < 10 ? "0" + currentMonth : currentMonth) + "-" + (currentDay < 10 ? "0" + currentDay : currentDay);
  window.currentHour = (currentHour < 10 ? '0' + currentHour : currentHour);
  window.currentMinutes = (currentMinutes < 10 ? '0' + currentMinutes : currentMinutes);
  window.currentDay = currentDay;
  window.currentMonth = currentMonth;
  window.currentMonthLastDay = currentLastDatemMonth.getDate();
  window.currentYear = currentYear;
  window.producao = true;
  window.backend = import.meta.env.VITE_SERVER_URL;
  
  // VERIFICA SE ESTÁ NA FASTVIEW OU MALLTECH PARA MUDAR A URL DO UPLOAD
  if(window?.location?.origin?.includes('fastview')){
    window.host = import.meta.env.VITE_URL_PROD_FASTVIEW;
    window.host_madnezz = import.meta.env.VITE_URL_PROD_MADNEZZ;
    window.upload = import.meta.env.VITE_URL_UPLOAD_FASTVIEW;
    global.client = 'fastview';
    global.client_name = 'Fastview';
  }else if(window?.location?.origin?.includes('malltech')){
    window.host = import.meta.env.VITE_URL_PROD_MALLTECH;
    window.host_madnezz = import.meta.env.VITE_URL_PROD_MADNEZZ;
    window.upload = import.meta.env.VITE_URL_UPLOAD_MALLTECH; 
    global.client = 'malltech';
    global.client_name = 'Malltech';
  }else{
    window.host = import.meta.env.VITE_URL_PROD_MADNEZZ;
    window.host_madnezz = import.meta.env.VITE_URL_PROD_MADNEZZ;
    window.upload = import.meta.env.VITE_URL_UPLOAD_MADNEZZ;
    global.client = 'madnezz';
    global.client_name = 'Malltech';
  }

  // VARIÁVEL DE UPLOAD PADRÃO PARA MADNEZZ
  window.upload_madnezz = import.meta.env.VITE_URL_UPLOAD_MADNEZZ;

  // OPTIONS PADRÕES
  window.optionsMonths = [
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' }
  ];

  window.optionsYear = [];
  for (var i = 0; i < 5; i++) {
    window.optionsYear.push({ value: window.currentYear - i, label: window.currentYear - i })
  }
  
  // VARIÁVEIS PARA TESTE LOCAL
  if(window?.location?.origin?.includes('localhost') || window?.location?.origin?.includes('.test')){
    window.host = import.meta.env.VITE_URL_PROD_FASTVIEW;
    window.host_madnezz = import.meta.env.VITE_URL_PROD_MADNEZZ;
    window.upload = import.meta.env.VITE_URL_UPLOAD_FASTVIEW;        
    // window.backend = 'http://10.2.0.66';
    global.client = 'fastview';
    global.client_name = 'Fastview';
  }

  // SE NO LOCAL STORAGE TIVER A INFORMAÇÃO DO SISTEMA ID SETA NA VARIÁVEL
  if(sessionStorage.getItem('sistema_id')){
    window.rs_sistema_id = sessionStorage.getItem('sistema_id');
  }

  if(sessionStorage.getItem('id_apl')){
    window.rs_id_apl = sessionStorage.getItem('id_apl');
  }

  // TROCA TITLE E FAVICON DE ACORDO COM URL
  useEffect(() => {
    if(window?.location?.origin.includes('fastview')){
      document.getElementById('page_title').innerHTML = 'Fastview';
      document.getElementById('favicon').href = '/favicon_fastview.ico';
    }else if(window?.location?.origin.includes('malltech')){
      document.getElementById('page_title').innerHTML = 'Malltech';
      document.getElementById('favicon').href = '/favicon_malltech.ico';
    }else{
      document.getElementById('page_title').innerHTML = 'Malltech';
      document.getElementById('favicon').href = '/favicon_malltech.ico';
    }    
  },[]);
  
  return (
    <CookiesProvider>
      <Router>
        <Routes>
          <Route path="/auth/login" element={<Auth />} />
          <Route path="/auth/login/:token" element={<Auth />} />
          <Route path="/auth/recover/:token" element={ <Auth /> } />          
          <Route path="/*" element={
            <AuthProvider>              
              <Modal /> {/* MODAL DE COMUNICADOS */}
              <ProtectedRoutes />              
            </AuthProvider>
          }/>
        </Routes>
      </Router>

      <Toaster
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{
          className: 'toaster',
          duration: 4000,
          style: {
            background: 'rgba(0,0,0,0.9)',
            color: '#fff',
            fontSize: 13,
            padding: '10px 18px',
            borderRadius: 6,
          }
        }}
        containerStyle={{
          bottom: (window.isMobile ? 100 : 20),
        }}
      >
        {(t) => (
          <ToastBar toast={t}>
            {({ icon, message }) => (
              <>
                <div className="toaster__icon">
                  <Icon type="message" />
                </div>
                {message}
                {t.type !== 'loading' && (
                  <button onClick={() => toast.dismiss(t.id)}>
                    <Icon type="reprovar" title={false}></Icon>
                  </button>
                )}
              </>
            )}
          </ToastBar>
        )}
      </Toaster>

      {/* RECORTE AO FAZER UPLOAD DE IMAGENS */}
      {(openImageCropper && src ? 
        <Cropper
          // ref={spanRef}
          src={src}
          // name={(file && file[0].name.split(".")[0]) || "image"}
          // onSave={onSaveCropped}
          config={{
            type: "file",
            iconSrc: "https://img.icons8.com/ios/256/camera--v3.png",
            config: {
              maxZoom: 10,
              aspectRatio: 4 / 3,
            }
          }}
        />
      :'')}

      {/* LIGHTBOX */}
      <Lightbox
        open={toggler}
        // plugins={[Fullscreen, Zoom]}
        close={() => handleSetToggler(false)}
        slides={sources}
        index={sourceIndex}
        carousel={{
          finite: true,
          preload: 10
        }}
        plugins={[Zoom, Fullscreen]}
        zoom={{
          maxZoomPixelRatio,
          zoomInMultiplier,
          doubleTapDelay,
          doubleClickDelay,
          doubleClickMaxStops,
          keyboardMoveDistance,
          wheelZoomDistanceFactor,
          pinchZoomDistanceFactor,
          scrollToZoom
        }}
        thumbnails={{
          position: 'bottom'
        }}
      />
    </CookiesProvider>
  );
}

export default App;
