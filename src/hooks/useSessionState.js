import { useEffect, useState } from "react";

/**
 * Guarda el estado en sessionStorage para que se conserve durante la sesión del navegador.
 * @param {string} key - Clave única por componente o estado.
 * @param {*} initialValue - Valor inicial si no hay nada guardado.
 */

export function useSessionState(key,initialValue) {

    const [state, setState] = useState(()=> {
        try {
            const stored = sessionStorage.getItem(key);
            return stored ? JSON.parse(stored) : initialValue;
        } catch {
            return initialValue;
        }
    })

    useEffect(() => {
        try {
            if(state === null || state === undefined) {
                sessionStorage.removeItem(key); // limpia
            } else {
                sessionStorage.setItem(key, JSON.stringify(state));
            }
        } catch {}
    }, [key, state])

    return [state, setState];
}