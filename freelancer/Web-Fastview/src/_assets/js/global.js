import axios from "axios";
import CryptoJS from 'crypto-js';

// DESCRIPTOGRAFIA TOKEN (FORMATO ANTIGO)
function decryptOld(encryptedString) {
    var encryptMethod = 'AES-256-CBC';
    var key = import.meta.env.VITE_DECRYPT_KEY;
    var json = JSON.parse(CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(encryptedString)));
    var encryptMethodLength = parseInt(encryptMethod.match(/\d+/)[0]);
    var salt = CryptoJS.enc.Hex.parse(json.salt);
    var iv = CryptoJS.enc.Hex.parse(json.iv);
    var encrypted = json.ciphertext;// no need to base64 decode.
    var iterations = parseInt(json.iterations);
    if (iterations <= 0) {
        iterations = 999;
    }
    encryptMethodLength = (encryptMethodLength/4);// example: AES number is 256 / 4 = 64
    var hashKey = CryptoJS.PBKDF2(key, salt, {'hasher': CryptoJS.algo.SHA512, 'keySize': (encryptMethodLength/8), 'iterations': iterations});
    var decrypted = CryptoJS.AES.decrypt(encrypted, hashKey, {'mode': CryptoJS.mode.CBC, 'iv': iv});
    return decrypted.toString(CryptoJS.enc.Utf8);
}

// DESCRIPTOGRAFA TOKEN (NOVO FORMATO)
function decrypt(encryptedString){
    if(encryptedString){
        const jwt = encryptedString;
        const data = jwt.split('.')[1];
        const decoded = atob(data);
        return decoded;
    }
}

// CONVERTE NEW DATE() PARA O FORMATO DD/MM/YYYY
function cd(dateObject){
    var d = new Date(dateObject);
    d.setHours(d.getHours());

    var day = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    if (day < 10) {
        day = "0" + day;
    }
    if (month < 10) {
        month = "0" + month;
    }
    var date = day + "/" + month + "/" + year;

    return date;
}

// CONVERTE NEW DATE() PARA O FORMATO DD/MM/YYYY HH:MM
function cdh(dateObject) {
    var d = new Date(dateObject);
    d.setHours(d.getHours());

    var minute = d.getMinutes();
    var hour = d.getHours();
    var day = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();

    if (minute < 10) {
        minute = "0" + minute;
    }
    if (hour < 10) {
        hour = "0" + hour;
    }
    if (day < 10) {
        day = "0" + day;
    }
    if (month < 10) {
        month = "0" + month;
    }
    var date = day + "/" + month + "/" + year + " " + hour + ":" + minute;

    return date;
}

// VERIFICA O VALOR DE UMA VARIÁVEL DENTRO DO OBJETO
function vo(key, object, defalut_value = '', boolean = false) {
    let r;

    if (object[key] !== undefined) {
        r = object[key];

        if (boolean) {
            if (!r && !r?.length) {
                r = defalut_value;
            }
        }
    } else {
        r = defalut_value;
    }

    return r;
}

// PEGA DATAS EM DIVERSOS FORMATOS
function get_date(get, date_value = '', type = 'date', var_aux = '') { // GET = RETORNO | DATE_VALUE = VALOR | TYPE = FORMATO DO VALOR SENDO PASSADO
    let res, date, day, month, year, hour, minute, second;
    const dayNames = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const monthNames = ["", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const monthNamesShort = ["", "Jan.", "Fev.", "Mar.", "Abr.", "Mai.", "Jun.", "Jul.", "Ago.", "Set.", "Out.", "Nov.", "Dez."];

    if (date_value.length) {
        var aux_date = vo(0, date_value.split(' '));
        var aux_time = vo(1, date_value.split(' '));
        var aux;
        var aux1;

        switch (type) {
            case 'date':
                aux = aux_date.split('/');

                date = new Date(Number(aux[2]), (Number(aux[1]) - 1), Number(aux[0]));

                break;

            case 'date_sql':
                aux = aux_date.split('-');

                date = new Date(Number(aux[0]), (Number(aux[1]) - 1), Number(aux[2]));

                break;

            case 'date_sql_reverse':
                aux = aux_date.split('-');

                date = new Date(Number(aux[2]), (Number(aux[1]) - 1), Number(aux[0]));

                break;

            case 'datetime':
                aux = aux_date.split('/');
                aux1 = aux_time.split(':');

                date = new Date(Number(aux[2]), (Number(aux[1]) - 1), Number(aux[0]), Number(aux1[0]), Number(aux1[1]), Number((aux1[2] || '00')));

                break;

            case 'datetime_sql':
                aux = aux_date.split('-');
                aux1 = aux_time.split(':');

                date = new Date(Number(aux[0]), (Number(aux[1]) - 1), Number(aux[2]), Number(aux1[0]), Number(aux1[1]), Number((aux1[2] || '00')));

                break;

            case 'date_sub_day':
                if(aux_date.includes('-')){
                    aux = aux_date.split('-');
                }else{
                    aux = aux_date.split('/');
                }

                if(aux_date.includes('-')){
                    date = new Date(Number(aux[0]), (Number(aux[1]) - 1), (Number(aux[2]) - Number(var_aux)));
                }else{
                    date = new Date(Number(aux[2]), (Number(aux[1]) - 1), (Number(aux[0]) - Number(var_aux)));
                }

                break;

            case 'date_add_day':
                if(aux_date.includes('-')){
                    aux = aux_date.split('-');
                }else{
                    aux = aux_date.split('/');
                }                

                if(aux_date.includes('-')){
                    date = new Date(Number(aux[0]), (Number(aux[1]) - 1), (Number(aux[2]) + Number(var_aux)));
                }else{
                    date = new Date(Number(aux[2]), (Number(aux[1]) - 1), (Number(aux[0]) + Number(var_aux)));
                }

                break;
            
            case 'date_sub_month':
                aux = aux_date.split('/');

                date = new Date(Number(aux[2]), (Number(aux[1]) - 1 - Number(var_aux)), Number(aux[0]));

                break;

            case 'date_add_month':
                aux = aux_date.split('/');

                date = new Date(Number(aux[2]), (Number(aux[1]) - 1 + Number(var_aux)), Number(aux[0]));

                break;
        
            case 'date_sub_year':
                aux = aux_date.split('/');

                date = new Date((Number(aux[2]) - Number(var_aux)), (Number(aux[1]) - 1), Number(aux[0]));

                break;

            case 'date_add_year':
                aux = aux_date.split('/');

                date = new Date((Number(aux[2]) + Number(var_aux)), (Number(aux[1]) - 1), Number(aux[0]));

                break;

            case 'new_date':
                date = new Date(date_value);
                
                break;
        }
    } else {
        date = new Date();
    }

    if (date) {
        day = String(date.getDate()).padStart(2, '0');
        month = String(date.getMonth() + 1).padStart(2, '0');
        year = String(date.getFullYear());
        hour = String(date.getHours()).padStart(2, '0');
        minute = String(date.getMinutes()).padStart(2, '0');
        second = String(date.getSeconds()).padStart(2, '0');
    }

    switch (get) {
        case 'day':
            res = day;
            break;
        case 'month':
            res = month;
            break;
        case 'year':
            res = year;
            break;
        case 'full_hour':
            res = hour+':'+minute+':'+second;
            break;
        case 'hour':
            res = hour;
            break;
        case 'minute':
            res = minute;
            break;
        case 'second':
            res = second;
            break;
        case 'date':
            res = day + '/' + month + '/' + year;
            break;
        case 'date_sql':
            res = year + '-' + month + '-' + day;
            break;
        case 'date_sql_reverse':
            res = day + '-' + month + '-' + year;
            break;
        case 'datetime':
            res = day + '/' + month + '/' + year + ' ' + hour + ':' + minute + ':' + second;
            break;
        case 'datetime_sql':
            res = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
            break;
        case 'first_date':
            res = '01/' + month + '/' + year;
            break;
        case 'last_date':
            res = get_date('last_day', '01/' + month + '/' + year) + '/' + month + '/' + year;
            break;
        case 'last_day':
            aux = new Date(year, month, 0);
            res = String(aux.getDate()).padStart(2, '0');
            break;
        case 'month_year':
            res = month + '/' + year;
            break;
        case 'month_name':
            if (type == 'number') {
                res = monthNames[Number(date_value)];
            } else {
                res = monthNames[Number(month)];
            }
            break;
        case 'month_name_short':
            if (type == 'number') {
                res = monthNamesShort[Number(date_value)];
            } else {
                res = monthNamesShort[Number(month)];
            }
            break;
        case 'day_name':
            aux = new Date(date_value);
            res = dayNames[aux.getDay()+1];
            break;

        default:
            res = date;
            break
    }

    return res;
}

// SUBTRAI DIAS DA DATA (DD-MM-YYYY)
function subDays(date, days) {
    if(date && days){
        const copy = new Date(Number(date));
        copy.setDate(date.getDate() - days);
        return copy;
    }else{
        return '';
    }
}

// ADICIONA DIAS DA DATA (DD-MM-YYYY)
function addDays(date, days) {
    if(date && days){
        const copy = new Date(Number(date));
        copy.setDate(date.getDate() + days);
        return copy;
    }else{
        return '';
    }
}

// CALCULA DIFERENÇA DE DIAS ENTRE 2 DATAS (YYYY-MM-DD)
function diffDays(date1, date2){
    if(date1 && date2){
        let newDate1 = new Date(date1);
        let newDate2 = new Date(date2);
        let difference = newDate1.getTime() - newDate2.getTime();
        let result = Math.ceil(difference / (1000 * 3600 * 24)) - 1;

        return result;
    }else{
        return '';
    }
}

// CALCULAR DISTÂNCIAS
global.lat2='';
global.lon2='';
global.allowLocation=false;

if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position){
        global.lat2=position.coords.latitude;
        global.lon2=position.coords.longitude;
        global.allowLocation=true;
    });
}

function calcDistance(lat1,lon1,lat2=global.lat2,lon2=global.lon2){
    if(lat2 && lon2){
        var radlat1 = Math.PI * lat1/180;
        var radlat2 = Math.PI * lat2/180;
        var theta = lon1-lon2;
        var radtheta = Math.PI * theta/180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        dist = dist * 1.609344;

        return dist;
    }else{
        return '';
    }
}

function downloadFile(id, name = undefined){
    if(id){
        // if(!Array.isArray(id)){
        //     id = id;
        // }

        let ids_list = [];

        if(Array.isArray(id)){         
            if(id.length > 1){      
                id.map((elem, i) => {
                    let item = elem
                    if (!ids_list.includes(item)) {
                        ids_list.push(item);
                    }
                });
            }else{
                ids_list = id;
            }
        }else{
            ids_list = id;
        }

        let tokenConfigurations = axios.defaults.headers.common['Tokenconfigurations'];
        delete axios.defaults.headers.common['Tokenconfigurations'];
        delete axios.defaults.headers.common['Authorization'];

        axios({
            url: window.upload+'?do=download'+(Array.isArray(id) && id.length > 1 ? '_multiple' : ''),
            method: 'get',
            params: {
                id: (Array.isArray(id) && id.length > 1 ? ids_list.join(',') : ids_list)
            },
            responseType: 'blob',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then((response) => {
            const href = URL.createObjectURL(response.data);
            const link = document.createElement('a');
        
            link.href = href;
            link.setAttribute('download', (name ? name : 'file'));
            document?.body?.appendChild(link);
            link.click();

            document?.body?.removeChild(link);
        
            URL.revokeObjectURL(href);

            axios.defaults.headers.common['Authorization'] = 'Bearer '+window.token;
            axios.defaults.headers.common['Tokenconfigurations'] = tokenConfigurations;
        });
    }
}

function valida_email(value){
    let reg = /\S+@\S+\.\S+/;
    let validation = reg.test(value);

    return validation;
}

function scrollToCol(id){
    if(id){
        setTimeout(() => {
            if(document.getElementById(id)){
                document.getElementById(id).scrollIntoView();          
            }
        },100); // LEVE DELAY PARA AGUARDAR A DIV SURGIR NA TELA CASO ESTEJA OCULTA
    }
}

// REMOVE TAGS HTML DA STRING
function removeHTMLTags(text) {
    return text?.replace(/<[^>]*>/g, '');
}

// VERIFICA SE É UMA DATA VÁLIDA
export function isDateValid(date) {
    return !isNaN(new Date(date));
}

// SETA VARIÁVEIS DE SESSÃO
export function setSession(sistema_id, id_apl, permission_apl, pus){
    // CASO O SISTEMA_ID SEJA DA "MANUTENÇÃO" CRAVA O 275 DA MADNEZZ
    if(sistema_id == global.sistema.manutencao){
        sistema_id = 275;
    }

    // DEFINE VARIÁVEIS RELACIONADAS AO SISTEMA
    const tokenConfigurations = {            
        sistema_id: sistema_id,
        id_apl: id_apl,
        permission_apl: permission_apl ? permission_apl : pus,
        pus: pus,
    }
    global.tokenConfigurations = JSON.stringify(tokenConfigurations);    
    axios.defaults.headers.common['Tokenconfigurations'] = JSON.stringify(tokenConfigurations);

    // PERMISSÃO DO USUÁRIO NO SISTEMA E ID APL
    if(pus){
        window.rs_permission_apl = pus;
    }else{
        window.rs_permission_apl = permission_apl;
    }

    if(id_apl){
        window.rs_id_apl = id_apl;
    }

    // SETA VARIÁVEIS DE SESSÃO
    sessionStorage.setItem('sistema_id', sistema_id);
    sessionStorage.setItem('id_apl', (id_apl ? id_apl : ''));
    sessionStorage.setItem('pus', pus);
    sessionStorage.setItem('permission_apl', permission_apl);

    window.rs_sistema_id = sessionStorage.getItem('sistema_id');
    window.rs_id_apl = sessionStorage.getItem('id_apl');
}

export {
    decryptOld,
    decrypt,
    cd,
    cdh,
    vo,
    get_date,
    subDays,
    addDays,
    calcDistance,
    diffDays,
    downloadFile,
    valida_email,
    scrollToCol,
    removeHTMLTags
}