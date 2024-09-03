import { useRef, useState } from 'react';
import style from './container.module.scss';

export default function Container({styleAux, padding, children, className, dragScroll, disabled}){
    // REF
    const ourRef = useRef(null);
    const mouseCoords = useRef({startX: 0, startY: 0, scrollLeft: 0, scrollTop: 0});

    // ESTADOS
    const [isMouseDown, setIsMouseDown] = useState(false);    
    const [isScrolling, setIsScrolling] = useState(false);

    const slider = ourRef.current;

    const handleDragStart = (e) => {
        if (!ourRef.current) return
        const startX = e.pageX - slider.offsetLeft;
        const startY = e.pageY - slider.offsetTop;
        const scrollLeft = slider.scrollLeft;
        const scrollTop = slider.scrollTop;
        mouseCoords.current = { startX, startY, scrollLeft, scrollTop }
        setIsMouseDown(true);
        slider.style.cursor = "grabbing";        
    }

    const handleDragEnd = () => {
        setIsMouseDown(false)
        if (!ourRef.current) return;  
        slider.style.cursor = "grab";  
    }

    const handleDrag = (e) => {
        if (!isMouseDown || ! ourRef.current) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const y = e.pageY - slider.offsetTop;
        const walkX = (x - mouseCoords.current.startX) * 1.5;
        const walkY = (y - mouseCoords.current.startY) * 1.5;
        slider.scrollLeft = mouseCoords.current.scrollLeft - walkX;
        slider.scrollTop = mouseCoords.current.scrollTop - walkY;
        slider.style.cursor = "grabbing";    
    }

    if(dragScroll && !window.isMobile){
        document.body.style.overflow = 'hidden';

        if(slider){
            slider.style.cursor = "grab";
        }
    }

    if(disabled){
        return(
            <>{children}</>
        )
    }else{
        return(
            <div
            id="container"
            style={dragScroll && !window.isMobile ? {overflow: 'scroll', scrollBehavior: 'initial', height: 'calc(100vh - 136px)'} : styleAux}
            className={style.container + ' ' + (className ? className : '') + ' ' + (padding === false ? 'p-0' : '')}            
            ref={ourRef}
            onMouseDown={dragScroll ? handleDragStart: undefined}
            onMouseUp={dragScroll ? handleDragEnd : undefined}
            onMouseMove={dragScroll ? handleDrag : undefined}
        >
                {children}
            </div>
        )
    }
}