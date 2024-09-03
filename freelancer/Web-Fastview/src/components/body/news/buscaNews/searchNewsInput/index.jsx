import "./style.css"

export default function SearchNewsInput(props){
    return(
        <>
            <input 
                className="inputBuscaNews"
                name={props.name}
                type={props.type}
                placeholder={props.placeholder}
                value={props.value}
                onChange={props.onChange}
                onKeyDown={props.onKeyDown}
            />
        </>
    )
}