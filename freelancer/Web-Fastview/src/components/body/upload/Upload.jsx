import React, { useEffect, useState, useContext } from "react";

/*SWIPER*/
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "../../../_assets/css/swiper.scss";

import "./Upload.scss";
import style from './Upload.module.scss';

// Definindo a interface das props

// import { UploadProps } from "./Upload.types";
import { axiosPost, responseNormalizer } from "./Axios";
import Icon from "../icon";
import Modal from "../modal";
import ModalHeader from "../modal/modalHeader";
import ModalTitle from "../modal/modalHeader/modalTitle";
import ModalBody from "../modal/modalBody";
import { GlobalContext } from "../../../context/Global";
import axios from "axios";
import toast from "react-hot-toast";

/**
 * Esse é um componente funcional que pode ser usado para fazer upload de arquivos de quase qualquer tipo, e suporta edição em arquivos de imagem.
 *
 * @param type - Escolha entre "image" ou "file", isso vai renderizar dois botões de diferentes.
 * @param iconSrc - O SRC do Icone que vai ser usado no botão.
 * @param callback - Essa função deve receber um File (file) e ela quem vai fazer o upload do arquivo.
 * @returns {JSX.Element} Retorna um componente react.
 */

const Upload = ({ type, iconSrc, upload, icon, api, title, accept, capture, callback, align, config, propsValue, callbackAction, multiple, className, onChange, multipleValues, size, maxSize, disabled, readonly, input }) => {
  const { multipleModal, handleSetMultipleModal, handleSetSrc, src, openImageCropper, handleSetOpenImageCropper } = useContext(GlobalContext);

  const [value, setValue] = useState([]);
  const [fileValues, setFileValues] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [swiper, setSwiper] = useState();

  useEffect(() => {
    setValue(propsValue);

    let fileValues = [];

    if (propsValue && propsValue.length > 0) {
      propsValue.toString().split(',').map((item, i) => {
        fileValues.push(item);
      });
    }

    setFileValues(fileValues);
  }, [propsValue]);

  // EXIBIR MODAL DE LISTA DE ANEXOS
  function handleSetShowModal() {
    setShowModal(true);
    handleSetMultipleModal(true);
  }

  // REMOVER ARQUIVO
  function removeFile(file, i) {
    if (fileValues?.toString()?.includes('{')) {
      let file_aux = JSON.parse(fileValues).filter((elem) => elem.id != file);
      setFileValues(JSON.stringify(file_aux));
      callback([JSON.stringify(file_aux), file, 'remove']);
    } else {
      let file_aux = fileValues.filter((elem) => elem != file);
      setFileValues(file_aux.toString());
      callback([file_aux.toString(), file, 'remove']);
    }
  }

  // Refs
  const hiddenFileInput = React.useRef(null);
  const spanRef = React.useRef(null);
  const fileUploaded = React.useRef(null);

  // Global
  const [file, setFile] = useState([]);

  const uploadImage = (event) => {
    var file = event.target.files;
    var processing = 0;

    if (!file) {
      console.error("[Upload] Arquivo não selecionado!");
      return;
    }

    setFile(file);

    if (type == "image2") {
      const reader = new FileReader();

      reader.addEventListener("load", () => {
        handleSetSrc(reader.result);
        handleSetOpenImageCropper(true);
      });

      reader.readAsDataURL(file[0]);

      return;
    }

    // DEFINE INFORMAÇÕES PARA FAZER UPLOAD
    var data = new FormData();
    data.append('sistema_id', window.rs_sistema_id);
    data.append('empreendimento_id', window.rs_id_emp);
    data.append('loja_id', window.rs_id_lja);

    // VERIFICA SE É DO TIPO IMAGEM PARA FAZER O TRATAMENTO DO TAMANHO
    let file_aux;
    if (file.length > 0) {
      for (let i = 0; i < file.length; i++) {
        file_aux = file.item(i);

        if (file_aux.type.includes('image')) {
          processing++;
          var file_name = '';
          var aux = file_aux.name.replace(/ /g, "");
          aux = aux.split(".");
          for (var j = 0; j < aux.length - 1; j++) {
            file_name += aux[j];
          }
          file_name += "." + aux[aux.length - 1];

          const reader = new FileReader();
        reader.onload = (function (filename) {
          return function (event) {
            var image = new Image();
            image.onload = function () {
              var max_size = (maxSize ? maxSize : 1600);
              var w = image.width;
              var h = image.height;
              if (w > h) {
                if (w > max_size) {
                  h *= max_size / w;
                  w = max_size;
                }
              } else {
                if (h > max_size) {
                  w *= max_size / h;
                  h = max_size;
                }
              }
              var canvas = document.createElement("canvas");
              canvas.width = w;
              canvas.height = h;
              canvas.getContext('2d').drawImage(image, 0, 0, w, h);

              if (typeof canvas.toBlob !== "undefined") {
                canvas.toBlob((blob) => {        
                  const file_new = new File([blob], filename, {
                    type: file_aux.type,
                    lastModified: Date.now()
                  });
                  data.append(i, file_new);
                  processing--;
                }, file_aux.type, 0.8);
              } else {
                data.append(i, file);
                processing--;
              }
            }
            image.src = event.target.result;
          };
          })(file_name)

          reader.readAsDataURL(file_aux);
        } else {
          data.append(i, file_aux);
        }
      }
    }

    // spanRef.current.innerHTML =
    //   file.name.length > 10
    //     ? `${file.name.slice(0, 10)}(...) .${file.name.split(".").pop()}`
    //     : file.name;

    if(file.length > 0){
      setLoading(true);

      var intervalo = setInterval(() => {
        if (processing > 0) {
          console.log('do nothing')
        } else {        
          clearInterval(intervalo);      
          delete axios.defaults.headers.common['Authorization'];

          // ARMAZENA AS CONFIGURAÇÕES DO TOKEN PARA REMOVER DA REQUISIÇÃO E INSERIR NOVAMENTE APÓS TERMINAR
          let tokenConfigurations = axios.defaults.headers.common['Tokenconfigurations'];
          delete axios.defaults.headers.common['Tokenconfigurations'];

          axios({
            url: api?.url ? api.url : window.upload,
            method: 'post',
            data: data,
            cache: false,
            processData: false,
            contentType: false,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }).then((response) => {
            // console.log("[Upload] Arquivo enviado com sucesso!", response);        
            let fileValues = [];
            let objectValues;

            if(multiple !== false){
              objectValues = propsValue ? (propsValue.length > 0 ? JSON.parse(propsValue) : []) : [];
            }else{
              objectValues = [];
            }
            let responseValue = responseNormalizer(response, null, file);

            if (responseValue.response) {
              responseValue.response.data.files.map((file, i) => {
                objectValues.push({
                  id: file[0],
                  name: file[1],
                  size: file[2],
                  type: file[4],
                });

                fileValues.push(file);
              });
            }

            setFileValues(fileValues);
            callback([JSON.stringify(objectValues), '', 'upload']);
            setLoading(false);

            // VOLTA COM O TOKEN PARA A REQUISIÇÃO
            axios.defaults.headers.common['Authorization'] = 'Bearer '+window.token;
            axios.defaults.headers.common['Tokenconfigurations'] = tokenConfigurations;
          }).catch((error) => {
            callback(responseNormalizer(null, error, file));
            setLoading(false);
            toast('Erro ao enviar arquivo, tente novamente.');

            console.error(
              "[Upload] Erro ao enviar arquivo para o servidor!",
              error
            );
            setFile([]);
            // spanRef.current.innerHTML = "Tente novamente!";
            // spanRef.current.style.color = "red";

            setTimeout(() => {
              // spanRef.current.innerHTML = "Carregar Arquivo";
              // spanRef.current.style.color = "black";
            }, 3000);
          });
        }
      }, 500);
    }
  };

  // Tipo Imagem

  const onSaveCropped = (file) => {
    setFile(file);
    handleSetOpenImageCropper(false);

    console.log("[Upload] Enviando arquivo para o servidor...", file);

    axiosPost({
      sistema_id: window.rs_sistema_id,
      empreendimento_id: window.rs_id_emp,
      loja_id: window.rs_id_lja,
      file
    }, (api?.url ? api.url : window.upload)).then((response) => {
      // console.log("[Upload] Arquivo enviado com sucesso!", response);
      callback(responseNormalizer(response, null, file));
    }).catch((error) => {
      callback(responseNormalizer(null, error, file));

      console.error(
        "[Upload] Erro ao enviar arquivo para o servidor!",
        error
      );
      setFile([]);
    });
  };

  const handleClick = (_event) => {
    hiddenFileInput.current.click();
    // spanRef.current.innerHTML = "Carregando...";
  };

  if (type == "image2") {
    return (
      <>
        <div className={'flex buttonFile ' + (className ? className : '')} style={{ pointerEvents: (disabled || readonly ? 'none' : 'all') }} onClick={handleClick}>
          <input
            type="file"
            accept=".png, .jpeg, .jpg"
            style={{ display: "none" }}
            onChange={uploadImage}
            size={size}
            id="contained-button-file"
          />

          {(icon !== false ?
            <label className="flex" htmlFor="contained-button-file">
              <Icon
                type={icon ? icon : 'picture'}
                className="icon_input_file"
                title="Anexar imagem"
                onClick={handleClick}
                disabled={(disabled ? disabled : false)}
                readonly={(readonly ? readonly : false)}
              />
            </label>
          :'')}
        </div>
      </>
    );
  }

  // Tipo File

  return (
    <span className={'d-flex align-items-center justify-content-center' + (align === 'left' ? ' flex-row-reverse' : '') + ' ' + (type === 'image' ? 'h-100 w-100' : '')}>
      <div className={'flex buttonFile ' + (className ? className : '') + ' ' + 'd-none'} style={{ pointerEvents: (disabled || readonly ? 'none' : 'all') }} onClick={handleClick}>
        <input
          accept={(accept ? accept : '.doc, .docx, .pdf, .ppt, .pptx, .xls, .xlsx, .txt, .svg, .png, .jpeg, .jpg')}
          capture={(capture ? capture : false)}
          type="file"
          ref={hiddenFileInput}
          onChange={uploadImage}
          multiple={(multiple === false ? false : true)}
          style={{ display: "none" }}
        />
        <span ref={spanRef}>&nbsp;</span>
      </div>

      {(value && value.length > 0 && type !== 'image' ?
        (multipleValues && value.length > 1 ?
          <>
            <Icon
              type="visualizar"
              title="Visualizar lista de anexos"
              size={size}
              onClick={() => handleSetShowModal(true)}
            />

            <Modal show={showModal} onHide={() => setShowModal(false)}>
              <ModalHeader>
                <ModalTitle>Anexos</ModalTitle>
              </ModalHeader>
              <ModalBody>
                <div className={style.files}>
                  {(value.includes('{') ?
                    (JSON.parse(value.replaceAll('],[', ',')).map((file, i) => {
                      return (
                        <div className="d-flex align-items-center justify-content-between" key={'modal_file_'+file?.id}>
                          <div>
                            <p className="mb-0">
                              {file.name}
                            </p>
                          </div>
                          <div className="d-flex align-items-center">
                            <a href={(api?.url ? api.url : window.upload) + '/' + file.id} target="_blank" className={style.file__link}>
                              <Icon
                                type="external"
                                title="Visualizar anexo"
                              />
                            </a>
                            <Icon
                              type="reprovar"
                              title="Remover anexo"
                              size={size}
                              onClick={() => removeFile(file.id, i)}
                              disabled={(disabled ? disabled : false)}
                              readonly={(readonly ? readonly : false)}
                            />
                          </div>
                        </div>
                      )
                    }))
                    :
                    (value.toString().split(',').map((file, i) => {
                      return (
                        <div className="d-flex align-items-center justify-content-between" key={'modal_file_'+file}>
                          <div>
                            <p className="mb-0">
                              Arquivo {value.toString().split(',').length - i}
                            </p>
                          </div>
                          <div className="d-flex align-items-center">
                            <a href={(api?.url ? api.url : window.upload) + '/' + file} target="_blank" className={style.file__link}>
                              <Icon
                                type="external"
                                title="Visualizar anexo"
                              />
                            </a>
                            <Icon
                              type="reprovar"
                              title="Remover anexo"
                              size={size}
                              onClick={() => removeFile(file.id, i)}
                              disabled={(disabled ? disabled : false)}
                              readonly={(readonly ? readonly : false)}
                            />
                          </div>
                        </div>
                      )
                    }))
                  )}
                </div>
              </ModalBody>
            </Modal>
          </>
          :
          <span>
            <div className="d-inline-flex">
              {(value.includes('{') ?
                JSON.parse(value).map((file, i) => {
                  return (
                    <div className="position-relative" key={'input_file_'+file?.id}>
                      <div className={style.remove}>
                        <Icon
                          type="reprovar"
                          title="Remover anexo"
                          size={size}
                          onClick={() => removeFile(file.id, i)}
                          disabled={(disabled ? disabled : false)}
                          readonly={(readonly ? readonly : false)}
                        />
                      </div>
                      <a href={(api?.url ? api.url : window.upload) + '/' + file.id} target="_blank" style={{ marginRight: (className ? 3 : 7) }}>
                        <Icon
                          type="visualizar"
                          size={size}
                          title="Visualizar anexo"
                        />
                      </a>
                    </div>
                  )
                })
                :
                value.split(',').map((file, i) => {
                  return (
                    <div className="position-relative" key={'input_file_'+file}>
                      <div className={style.remove}>
                        <Icon
                          type="reprovar"
                          title="Remover anexo"
                          size={size}
                          onClick={() => removeFile(file, i)}
                          disabled={(disabled ? disabled : false)}
                          readonly={(readonly ? readonly : false)}
                        />
                      </div>
                      <a href={(api?.url ? api.url : window.upload) + '/' + file} target="_blank" style={{ marginRight: (className ? 3 : 7) }}>
                        <Icon
                          type="visualizar"
                          size={size}
                          title="Visualizar anexo"
                        />
                      </a>
                    </div>
                  )
                })
              )}
            </div>
          </span>
        )
        :
          (type === 'image' ?
            <Swiper
              ref={swiper}
              focusableElements="input, select, div, button, label, option, textarea"
              preventClicks={false}
              simulateTouch={false}
              modules={[Navigation]}
              autoHeight={false}
              onSwiper={(swiper) => setSwiper(swiper)}
              navigation={multiple === false ? false : true}
              allowTouchMove={true}
              className="h-100 swiper_input_image"
              slidesPerView={1}
              slidesPerGroup={1}
              watchSlidesProgress={true}
            >
              {(value?.includes('{') ?
                  JSON.parse(value).map((file, i) => {
                    return (
                      <SwiperSlide key={'input_file_'+file?.id}>
                        {/* CASO NÃO PERMITA MULTIPLES ARQUIVOS, INSERE A DIV DE AÇÕES EM CIMA DA IMAGEM */}
                        {(!multiple ?
                          <div className={style.actions}>
                            <div>
                              <span className={(loading ? 'ps-1' : '')}>
                                <Icon
                                  type={(icon ? icon : 'picture')}
                                  size={size}
                                  loading={loading}          
                                  title={(title || title === false ? title : 'Anexar arquivo')}
                                  onClick={handleClick}
                                  disabled={(disabled ? disabled : false)}
                                  readonly={(readonly ? readonly : false)}
                                />
                              </span>

                              <Icon
                                type="trash"
                                title={'Remover imagem'}
                                onClick={() => removeFile(file.id, i)}
                              />
                            </div>
                          </div>
                        :'')}

                        {(multiple ?
                          <div className={style.remove_image}>
                            <Icon
                              type="trash"
                              title={'Remover imagem'}
                              onClick={() => removeFile(file.id, i)}
                            />
                          </div>
                        :'')}

                        {(file?.type === 'application/pdf' ?
                          <div className={style.file_pdf}>
                            <span>
                              PDF
                            </span>
                            <span>
                              Pré-visualização não disponível
                            </span>
                          </div>
                        :
                          <img
                            src={(api?.url ? api.url : window.upload) + '/' + file.id}
                            className="mw-100"
                          />
                        )}
                      </SwiperSlide>
                    )
                  })
              :'')}

              <SwiperSlide>
                <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                  <span className={(loading ? 'ps-1' : '')}>
                    <Icon
                      type={(icon ? icon : 'picture')}
                      className={'icon_input_image'}
                      size={size}
                      loading={loading}          
                      title={(title || title === false ? title : 'Anexar arquivo')}
                      onClick={handleClick}
                      disabled={(disabled ? disabled : false)}
                      readonly={(readonly ? readonly : false)}
                    />
                  </span>
                </div>
              </SwiperSlide>
            </Swiper>
          :'')
      )}

      {(input !== false && icon !== false && type !== 'image' ?
        <span className={(loading ? 'ps-1' : '')}>
          <Icon
            type={(icon ? icon : 'file')}
            className={'icon_input_file'}
            animated
            size={size}
            loading={loading}          
            title={(title || title === false ? title : 'Anexar arquivo')}
            onClick={handleClick}
            disabled={(disabled ? disabled : false)}
            readonly={(readonly ? readonly : false)}
          />
        </span>
      : '')}
    </span>
  );
};

// Definindo os valores padrões para as props
Upload.defaultProps = {
  type: "file",
  iconSrc: "https://img.icons8.com/ios/256/camera--v3.png",
  strategy: (file) => {
    console.error("[Upload] Strategy não foi definido!", file);
  },
  config: {
    maxZoom: 10,
    aspectRatio: 4 / 3,
  },
};

export default Upload;