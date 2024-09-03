export default function Filter(props){
    return(
        <div>
            <div>
                {props?.children}
            </div>
            <div>
                {props?.filters}
            </div>
        </div>
    )
}
