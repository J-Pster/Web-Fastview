import { useContext, useEffect, useState } from "react";

import Form from "../../../components/body/form";
import Input from "../../../components/body/form/input";
import Title from "../../../components/body/title";
import style from './style.module.scss';
import axios from "axios";
import { AuthContext } from '../../../context/Auth';
import toast from "react-hot-toast";

export default function Photo(){
    // CONTEXT
    const { authInfo, setAuthInfo } = useContext(AuthContext);

    // ESTADOS
    const [image, setImage] = useState(authInfo?.pessoa?.imagem ? '[{"id":"'+authInfo?.pessoa?.imagem+'"}]' : '');

    // CALLBACK DO COMPONENTE DE UPLOAD
    const handleCallback = (e) => {
        setImage(e[0]);

        setTimeout(() => {
            let id_aux;

            if(e[2] === 'upload'){
                id_aux = JSON.parse(e[0])[0]?.id;
                toast('Foto de perfil atualizada com sucesso');

                axios({
                    method: 'post',
                    url: window.backend+'/api/v1/usuarios/imagem',
                    data: {
                        imagem: id_aux
                    }
                });
            }else{
                id_aux = '';
                toast('Foto de perfil removida');

                axios({
                    method: 'delete',
                    url: window.backend+'/api/v1/usuarios/imagem/remove'
                });
            }

            // ATUALIZA A FOTO NO LOCAL STORAGE
            if(localStorage.getItem('authInfo')){
                let json_aux = JSON.parse(localStorage.getItem('authInfo'));
                json_aux.pessoa.imagem = id_aux;         

                let authInfoUpdated = json_aux;
                localStorage.setItem('authInfo', JSON.stringify(authInfoUpdated));
                setAuthInfo(authInfoUpdated);
            }
        },100);
    }
 
    return(
        <div className="mb-3">
            <Title>Foto</Title>

            <Form>
                <Input
                    id="user_image"
                    name="user_image"
                    type={'image'}
                    multiple={false}
                    className={style.user_image + ' mx-auto'}
                    value={image}
                    callback={handleCallback}
                />
            </Form>
        </div>
    )
}
