import { useState, useEffect } from "react";
import { addDays, isDateValid, subDays } from "../../../../_assets/js/global";

import style from "./Input.module.scss";
import ReactDatePicker from "react-datepicker";
import Icon from "../../icon";
import Tippy from "@tippyjs/react";
import InputMask from "react-input-mask";
import Upload from "../../upload/Upload";
import { BiX } from "react-icons/bi";
import CurrencyInput from "react-currency-input-field";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Input(props) {
  // ESTADOS
  const [focus, setFocus] = useState(null);
  const [fileValue, setFileValue] = useState(null);
  const [fileValueName, setFileValueName] = useState(null);
  const [security, setSecurity] = useState(false);
  const [viewPassword, setViewPassword] = useState(false);
  const [typeAux, setTypeAux] = useState('password');
  const [hashtags, setHashtags] = useState([]);
  const [valueAux, setValueAux] = useState('');  
  const [yearPicker, setYearPicker] = useState(false);

  //CONFIGURAÇÕES DE LANGUAGE PRO DATEPICKER
  const defaultDays = ["D", "S", "T", "Q", "Q", "S", " S"];
  var defaultMonths;

  if(props.format){
    if(props.format == 'mm/yyyy'){
      defaultMonths = [
        "Jan.",
        "Fev.",
        "Mar.",
        "Abr.",
        "Mai.",
        "Jun.",
        "Jul.",
        "Ago.",
        "Set.",
        "Out.",
        "Nov.",
        "Dez.",
      ];
    }else{
      defaultMonths = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
      ];
    }
  }else{
    defaultMonths = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];
  }

  const locale = {
    localize: {
      day: (n) => defaultDays[n],
      month: (n) => defaultMonths[n],
    },
    formatLong: {
      date: () => "dd/mm/yyyy",
    },
  };

  // FUNÇÃO PARA PEGAR VALOR INPUT FILE
  function handleFileValue(value){
    let parts = value.split('\\');
    let result = parts[parts.length - 1];
    setFileValue(value);
    setFileValueName(result);
  }

  // CALCULA SEGURANÇA DA SENHA
  function handleSecurity(e){
    if(props.validation !== false && e !== undefined){
      let qtd = false;
      let special = false;
      let number = false;
      let uppercase = false;

      // VERIFICA SE POSSUI CARACTER ESPECIAL
      if(/[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(e)){
        special = true;
      }else{
        special = false;
      }

      // VERIFICA SE TEM AO MENOS 6 CARACTERES
      if(e.length>=6){
        qtd = true;
      }else{
        qtd = false;
      }

      // VERIFICA SE TEM ALGUM NÚMERO
      if(/\d/.test(e)){
        number = true;
      }else{
        number = false;
      }

      // VERIFICA SE TEM LETRA MAÍUSCULA
      if(e !== e.toLowerCase()){
        uppercase = true;
      }else{
        uppercase = false;
      }

      if(special&&!qtd){
        setSecurity('weak');
      }

      if(!special&&qtd){
        setSecurity('weak');
      }

      if(special&&qtd){
        setSecurity('median');
      }

      if(special && qtd && uppercase){
        setSecurity('strong');
      }

      if(!special&&!qtd){
        setSecurity('weak');
      }

      if(e.length==0){
        setSecurity('');
      }
    }
  }

  // SEMPRE QUE A PROPS DE VALUE SOFRER ALTERAÇÃO ATUALIZA ESTADO DA SEGURANÇA
  useEffect(() => {
    if(props?.type === 'password' && props.value !== undefined){
      handleSecurity(props?.value);
    }
  },[props?.value]);

  // FOCUS INPUT
  const handleSetFocus = (e) => {
    if(props?.focusSelect){
      e.target.select();
    }
    setFocus(true);
  }

  // FUNÇÃO AO TIRAR FOCO DO INPUT
  const handleFocusOut = () => {        
    if(focus){
        setFocus(false);
    }
  }

  useEffect(() => {
      if(focus === false) {
          if (props.onFocusOut) {
              props.onFocusOut(true);
          }
      }
  }, [focus]);

  // VER SENHA
  const handleShowPassword = () => {
    setViewPassword(!viewPassword);
    setTypeAux(!viewPassword ? 'text' : 'password')
  }

  // ADICIONA HASHTAGS
  const handleChangeHashtag = (e) => {
    if(e.key === ' ' || e.code === 'Space' || e.keyCode === 32){
      if(!hashtags.includes(valueAux.slice(0, -1))){
        setHashtags(hashtags => [...hashtags, valueAux.slice(0, -1)]);
      }
      setValueAux('');
    }
  }

  // REMOVE HASHTAGS
  function handleRemoveHashtag(item){
    setHashtags(hashtags.filter((elem) => elem != item));
  }

  // MANDA VALOR DAS HAHTAGS PARA O COMPONENTE PAI
  useEffect(() => {
    if(props?.type === 'hashtag'){
      if(props.callback){
        props.callback(hashtags);
      }
    }
  },[hashtags]);

  // MANDA VALOR DAS HAHTAGS PARA O COMPONENTE PAI
  useEffect(() => {
    if(props?.type === 'hashtag' && props.value && typeof props.value === 'string'){
      let hashtags_aux = [];

      props.value.split(',').map((item, i) => {
        hashtags_aux.push(item);
      });

      setHashtags(hashtags_aux);
    }
  },[props.value]);

  // TROCA A VISUALIZAÇÃO DO DATE PICKER PARA MOSTRAR SOMENTE OS ANOS
  const handleYearPicker = () => {
    setYearPicker(true);
  }

  return (
    <div
      data-input={true}
      data-month={props?.format == 'mm/yyyy' ? true : undefined}
      data-disabled={(props.disabled === true ? true : false)}
      className={
        style.box__input +
        " " +
        (props.fullwith ? "w-100" : "") +
        " " +
        (props.className ? props.className : "") +
        " " +
        (props.type == "checkbox" ? style.checkbox : "") +
        " " +
        (props.type == "radio" ? style.radio : "") +
        " " +
        (props.type == "period" ? style.period : "") +
        " " +
        (props.border === false ? style.no__border : "") +
        " " +
        (props.padding === false ? style.no_padding : '') +
        " " +
        (props.background === false ? style.no_background : '') +
        " " +
        (props.size ? style.icon__size_lg : '') +
        " " +
        (props.loading ? style.loading : '') +
        " " +
        (focus ? style.box__input_focus : "") + 
        ' position-relative ' + 
        (props.inverse ? style.reverse:'') + ' ' +
        (props.disabled? style.disabled:'') + ' ' +
        (props.readonly? style.readonly:'') + ' ' +
        (props.type === 'date' && props.noWeekend ? style.no_weekend:'') + ' ' +
        (props.type === 'date' && props.onlyWeekend ? style.only_weekend:'') + ' ' +
        (props.type === 'date' && props.onlySaturday ? style.only_saturday:'') + ' ' +
        (props.type === 'date' && props.onlySunday ? style.only_sunday:'') + ' ' +
        (props.type === 'image'? style.input_image:'')   
      }
      style={{
        display: (props.type === "hidden" || props.hide ? "none" : ""),
        marginBottom: (props.border === false ? 0 : '')
      }}
    >
      {(() => {
        if(!props?.loading){
          return(
            <>
              {(() => {
                if (
                  props.label &&
                  props.type !== "date" &&
                  props.type !== "period" &&
                  props.type !== "checkbox" &&
                  props.type !== "radio" &&
                  props.type !== "image"
                ) {
                  return (
                    <label htmlFor={props.id}>
                      {props.label}: {props.required === false ? "" : "*"}
                    </label>
                  );
                }
              })()}
        
              {(() => {
                if (props.type === "date") {
                  let value_aux;
                  if(isDateValid(props.value) || props.value === '' || props.value === undefined || props.value === null){
                    value_aux = props?.value;
                  }
                  
                  return (
                    <>
                      {(props?.label !== false || !props.placeholder ?
                        <label htmlFor={props.id}>
                          {props.label ? props.label : "Data"}:{" "}
                          {props.required === false ? "" : "*"}
                        </label>
                      :'')}

                      <ReactDatePicker
                        locale={locale}
                        dateFormat={(props?.format == 'mm/yyyy' ? 'MM/yyyy' : 'dd/MM/yyyy')}
                        onFocus={(e) => e.target.readOnly = true}
                        selected={value_aux}
                        placeholderText={(props.placeholder ? (props.placeholder + (props.required === false && !props.label ? ": " : ": *")) : undefined)}
                        value={value_aux}
                        onChange={props.onChange}
                        required={(props.required===false?false:true)}
                        showYearPicker={yearPicker}
                        showMonthYearPicker={props?.format == 'mm/yyyy' || props.monthPicker}
                        onCalendarClose={() => setYearPicker(false)}
                        onChangeRaw={() => yearPicker ? setYearPicker(false) : {}}
                        shouldCloseOnSelect={yearPicker ? false : true}
                        monthClassName={(date) => date > props?.valueEnd && props?.format === 'mm/yyyy' ? 'unavailable' : ''}
                        includeDateIntervals={[
                          {
                            start: subDays(props.valueStart ? props.valueStart : new Date("01/01/1900"), 1),
                            end: (props?.valueEnd ? props?.valueEnd : addDays(props.valueStart ? props.valueStart : new Date("01/01/2100"), 100000))
                          },
                        ]}
                        renderCustomHeader={({
                          date,
                          changeYear,
                          changeMonth,
                          decreaseMonth,
                          increaseMonth,
                          decreaseYear,
                          increaseYear,
                          prevMonthButtonDisabled,
                          nextMonthButtonDisabled,
                        }) => (
                          <div className="react-datepicker__header_control">
                            <span
                              className="cursor-pointer button-prev"
                              onClick={props?.format == 'mm/yyyy' || yearPicker ? decreaseYear : decreaseMonth}
                              disabled={prevMonthButtonDisabled}
                            >
                              {/* <Icon type="left" title={false} readonly /> */}
                              <FaChevronLeft />
                            </span>
                            <span className="cursor-pointer" onClick={handleYearPicker}>
                              {(yearPicker ?
                                'Ano'
                              :
                                (props?.format == 'mm/yyyy' ? 
                                  <>{date.getFullYear()}</>
                                :
                                  <>{defaultMonths[date.getMonth()]} {date.getFullYear()}</>
                                )
                              )}
                            </span>
        
                            <span
                              className="cursor-pointer button-next"
                              onClick={props?.format == 'mm/yyyy' || yearPicker ? increaseYear : increaseMonth}
                              disabled={nextMonthButtonDisabled}
                            >
                              <FaChevronRight />
                              {/* <Icon type="right" title={false} readonly /> */}
                            </span>
                          </div>
                        )}
                      />
                    </>
                  );
                } else if (props.type === "date-month") {
                  return (
                    <>
                      <label htmlFor={props.id}>
                        {props.label ? props.label : "Data"}:{" "}
                        {props.required === false ? "" : "*"}
                      </label>
                      <ReactDatePicker
                        locale={locale}
                        dateFormat="MM"
                        onFocus={(e) => e.target.readOnly = true}
                        selected={props.value}
                        value={props.value}
                        onChange={props.onChange}
                        required={(props.required===false?false:true)}
                        showYearPicker={yearPicker}
                        onCalendarClose={() => setYearPicker(false)}
                        onChangeRaw={() => yearPicker ? setYearPicker(false) : {}}
                        shouldCloseOnSelect={yearPicker ? false : true}
                        includeDateIntervals={[
                          {
                            start: subDays(props.valueStart?props.valueStart:new Date("01/01/1900"), 1),
                            end: addDays(
                              props.valueStart
                                ? props.valueStart
                                : new Date("01/01/3999"),
                              100000
                            ),
                          },
                        ]}
                        renderCustomHeader={({
                          date,
                          changeYear,
                          changeMonth,
                          decreaseMonth,
                          increaseMonth,
                          prevMonthButtonDisabled,
                          nextMonthButtonDisabled,
                        }) => (
                          <div className="react-datepicker__header_control">
                            <span
                              className="cursor-pointer button-prev"
                              onClick={decreaseMonth}
                              disabled={prevMonthButtonDisabled}
                            >
                              <Icon type="left" title={false} readonly />
                            </span>
        
                            <span>
                              {defaultMonths[date.getMonth()]} {date.getFullYear()}
                            </span>
        
                            <span
                              className="cursor-pointer button-next"
                              onClick={increaseMonth}
                              disabled={nextMonthButtonDisabled}
                            >
                              <Icon type="right" title={false} readonly />
                            </span>
                          </div>
                        )}
                      />
                    </>
                  );
                } else if (props.type === "period") {
                  return (
                    <>
                      <div className={style.input__period}>
                        <label htmlFor={props.id}>De:</label>
                        <ReactDatePicker
                          locale={locale}
                          dateFormat="dd/MM/yyyy"
                          selected={props?.valueStart}
                          value={props?.valueStart}
                          onChange={props?.onChangeStart}
                          onFocus={(e) => e.target.readOnly = true}
                          showYearPicker={yearPicker}
                          onCalendarClose={() => setYearPicker(false)}
                          onChangeRaw={() => yearPicker ? setYearPicker(false) : {}}
                          shouldCloseOnSelect={yearPicker ? false : true}
                          renderCustomHeader={({
                            date,
                            changeYear,
                            changeMonth,
                            decreaseMonth,
                            increaseMonth,
                            prevMonthButtonDisabled,
                            nextMonthButtonDisabled,
                          }) => (
                            <div className="react-datepicker__header_control">
                              <span
                                className="cursor-pointer button-prev"
                                onClick={decreaseMonth}
                                disabled={prevMonthButtonDisabled}
                              >
                                <Icon type="left" title={false} readonly />
                              </span>
        
                              <span>
                                {defaultMonths[date.getMonth()]} {date.getFullYear()}
                              </span>
        
                              <span
                                className="cursor-pointer button-next"
                                onClick={increaseMonth}
                                disabled={nextMonthButtonDisabled}
                              >
                                <Icon type="right" title={false} readonly />
                              </span>
                            </div>
                          )}
                        />
                      </div>
        
                      <div className={style.input__period}>
                        <label htmlFor={props.id}>Até:</label>
                        <ReactDatePicker
                          locale={locale}
                          dateFormat="dd/MM/yyyy"
                          selected={props?.valueEnd}
                          value={props?.valueEnd}
                          onChange={props?.onChangeEnd}
                          onFocus={(e) => e.target.readOnly = true}
                          // includeDateIntervals={[
                          //   {
                          //     start: (props?.valueStart ? subDays(props.valueStart, 1) : ''),
                          //     end: (props.valueStart ? addDays(props.valueStart, 100000) : ''),
                          //   },
                          // ]}
                          renderCustomHeader={({
                            date,
                            changeYear,
                            changeMonth,
                            decreaseMonth,
                            increaseMonth,
                            prevMonthButtonDisabled,
                            nextMonthButtonDisabled,
                          }) => (
                            <div className="react-datepicker__header_control">
                              <button
                                onClick={decreaseMonth}
                                disabled={prevMonthButtonDisabled}
                              >
                                {"<"}
                              </button>
        
                              <span>
                                {defaultMonths[date.getMonth()]} {date.getFullYear()}
                              </span>
        
                              <button
                                onClick={increaseMonth}
                                disabled={nextMonthButtonDisabled}
                              >
                                {">"}
                              </button>
                            </div>
                          )}
                        />
                      </div>
                    </>
                  );
                } else if(props.type  === 'file') {
                  return(
                    <>
                      {(fileValue ? 
                        <span className={style.input__file}>
                          {(fileValue?
                            <Icon
                              type="reprovar"
                              title="Remover anexo"
                              onClick={() => (setFileValue(null), setFileValueName(null))}
                              readonly={props?.readonly}
                            />
                          :'')}
                        </span>
                      :'')}
        
                      <Upload
                        type={props?.type}
                        api={props?.api}
                        icon={props?.icon}
                        title={props?.title}
                        accept={props?.accept}
                        capture={props?.capture}
                        align={props?.align}
                        multiple={(props?.multiple === false ? false : true)}
                        multipleValues={props?.multipleValues}
                        propsValue={props?.value}
                        onChange={props?.onChange}
                        callback={props.callback}
                        className={(props.border === false ? 'onlyIcon' : '')}
                        size={props.size}
                        maxSize={props?.maxSize}
                        readonly={props?.readonly}
                        disabled={props?.disabled}
                        required={props?.required}
                        input={props?.input}
                      />
                    </>
                  );
                } else if(props.type  === 'image') {
                  return(
                    <div className={style.image_container}>
                      <Upload
                        type={props?.type}
                        api={props?.api}
                        icon={props?.icon ? props?.icon : 'picture'}
                        title={false}
                        accept={props?.accept ? props?.accept : '.png, .jpeg, .jpg'}
                        capture={props?.capture}
                        align={props?.align}
                        multiple={(props?.multiple === false ? false : true)}
                        multipleValues={props?.multipleValues}
                        propsValue={props?.value}
                        onChange={props?.onChange}
                        callback={props.callback}
                        className={style.image_button}
                        size={props.size}
                        readonly={props?.readonly}
                        disabled={props?.disabled}
                        required={props?.required}
                        input={props?.input}
                      />
                    </div>
                  );
                } else if(props.type === 'checkbox' || props.type === 'radio') {
                  return (
                    <Tippy disabled={(props.title?false:true)} content={ props?.title } >
                      <input
                        className={style.input}
                        type={props.type === "date" ? "text" : props.type}
                        name={props.name}
                        id={props.id}
                        placeholder={(props.placeholder ? (props.placeholder + (props.required === false && !props.label ? "" : ": *")) : undefined)}
                        value={props.value ? props.value : ""}
                        onChange={props.onChange}
                        required={props.required === false ? false : true}
                        onFocus={() => setFocus(true)}
                        onBlur={handleFocusOut}
                        onClick={props.onClick}                
                        defaultChecked={props?.defaultChecked}
                        checked={props.checked}
                        autoComplete={props.autocomplete ? props.autocomplete : "off"}
                      />
                    </Tippy>
                  );
                } else if(props.type === 'hashtag'){
                  return (
                    <Tippy disabled={(props.title?false:true)} content={ props?.title } >
                      <>   
                        <div className={style.input + ' ' + style.input__hashtags}>
                          {(hashtags.length > 0 ?
                            <div className={style.hashtags}>
                              {hashtags.map((item, i) => {
                                return(
                                  <span>
                                    {item}

                                    <Tippy content="Remover">
                                      <div>
                                        <BiX onClick={() => handleRemoveHashtag(item)}/>
                                      </div>
                                    </Tippy>
                                  </span>
                                )
                              })}
                            </div>
                          :'')}

                          <input
                            mask={props?.mask}
                            maskChar={(props?.maskChar)}
                            className={style.input}
                            type={'text'}
                            name={props.name}
                            id={props.id}
                            placeholder={(props.placeholder ? (props.placeholder + (props.required === false && !props.label ? "" : ": *")) : undefined)}
                            value={valueAux}
                            onChange={(e) => (e.key !== ' ' && e.code !== 'Space' && e.keyCode !== 32 ? setValueAux(e.target.value) : {})}
                            required={props.required === false ? false : true}
                            onFocus={(e) => handleSetFocus(e)}
                            onBlur={handleFocusOut}
                            onClick={props.onClick}
                            onKeyPress={props?.onKeyPress}
                            autoComplete={props.autocomplete ? props.autocomplete : "off"}
                            onKeyUp={handleChangeHashtag}
                            onKeyDown={props.onKeyDown}
                            style={props?.style}
                            maxLength={props?.maxLength}
                            max={props?.max}
                            min={props?.min}
                          />
                        </div>
                      </>
                    </Tippy>
                  ); 
                } else if(props.type === 'money'){
                  return (
                    <Tippy disabled={(props.title?false:true)} content={ props?.title } >
                      <>           
                        <CurrencyInput
                          id={props.id}
                          name={props.name}
                          placeholder={(props.placeholder ? (props.placeholder + (props.required === false && !props.label ? "" : ": *")) : undefined)}
                          defaultValue={props.value ? props.value : ""}
                          decimalsLimit={2}
                          decimalSeparator=","
                          groupSeparator="."
                          onValueChange={props.onChange}
                          className={style.input}
                          required={props.required === false ? false : true}
                          onFocus={(e) => handleSetFocus(e)}
                          onBlur={handleFocusOut}
                          onKeyPress={props?.onKeyPress}
                          onKeyDown={props.onKeyDown}
                          style={props?.style}
                          autoComplete={props.autocomplete ? props.autocomplete : "off"}
                        />
                      </>
                    </Tippy>
                  );
                } else {
                  return (
                    <Tippy disabled={(props.title?false:true)} content={ props?.title } >
                      <>                
                        <InputMask
                          mask={props?.mask}
                          maskChar={(props?.maskChar)}
                          className={style.input}
                          type={props.type === "date" ? "text" : (props.type === 'password' ? typeAux : props.type)}
                          name={props.name}
                          id={props.id}
                          placeholder={(props.placeholder ? (props.placeholder + (props.required === false && !props.label ? "" : ": *")) : undefined)}
                          value={props.value ? props.value : ""}
                          onChange={props.onChange}
                          required={props.required === false ? false : true}
                          onFocus={(e) => handleSetFocus(e)}
                          onBlur={handleFocusOut}
                          onClick={props.onClick}
                          onKeyPress={props?.onKeyPress}
                          defaultChecked={props?.defaultChecked}
                          checked={props.checked}
                          autoComplete={props.autocomplete ? props.autocomplete : "off"}
                          onKeyUp={(e) => (props.type=="password" ? handleSecurity(e.target.value) : {})}
                          onKeyDown={props.onKeyDown}
                          style={props?.style}
                          maxLength={props?.maxLength}
                        ></InputMask>
                      </>
                    </Tippy>
                  );
                }
              })()}
        
              {(() => {
                if (
                  props.label &&
                  (props.type === "checkbox" || props.type === "radio")
                ) {
                  return <label htmlFor={props.id}>{props.label} {(props?.obs ? <span className="text-secondary">{props?.obs}</span> : '')}</label>;
                }
              })()}
        
              {(() => {
                if (props.icon) {
                  if(props.icon.toString().includes('[')){
                    return props.icon;
                  }else{
                    if (props.type !== "file" && props.type !== "image") {
                      return <Icon type={props.icon} readonly={props?.readonly} animated={props?.animated} />;
                    }
                  }
                } else {
                  if(props.type === "date" && props?.icon !== false){
                    return <Icon type="calendar" animated title={false} style={{top:'-1px'}} readonly={props?.readonly} />;
                  }else if(props.type === "password") {
                    return <Icon type={'view'} animated title={viewPassword ? 'Ocultar' : 'Exibir'} active={viewPassword ? true : false} onClick={handleShowPassword} />
                  }else{
                    if (props.type === "file") {
                      return '';
                    }else if (props.type === "image") {
                      return '';
                    }
                  }
                }
              })()}
        
              {(() => {
                if (props.type === "password"){
                  return(
                    <div className={style.security + ' ' + (security?security=='strong'?style.strong:(security=='weak'?style.weak:style.median):'')}></div>
                  )
                }
              })()}
            </>
          )
        }
      })()}
    </div>
  );
}
