import React from 'react'
import { OutlinedInput, InputAdornment, IconButton } from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'

export const SearchInput = ({
    value,
    onChange,
    name,
    placeholder = 'Ingrese el valor a buscar',
    startIcon = <SearchRoundedIcon fontSize='small'/>,
    clearable = true,
    ...props
}) => {

    const handleClear = () => {
        onChange?.({ target: { name, value: '' }})
    }

  return (
    <OutlinedInput
        name={name}
        value = {value}
        onChange = {onChange}
        placeholder={placeholder}
        sx={{paddingRight:0}}
        startAdornment={
            <InputAdornment position='start' sx={{ color: 'text.primary' }}>
                {startIcon}
            </InputAdornment>
        }
        endAdornment={
            clearable && value ? (
                <InputAdornment position='end' sx={{ mr: 0.75 }}>
                    {/* Botón chico, redondo y sin borde: el estilo global de IconButton (cuadrado con borde) lo hacía parecer un botón aparte */}
                    <IconButton
                        aria-label='Borrar búsqueda'
                        title='Borrar'
                        onClick={handleClear}
                        // Mantiene el foco en el campo para seguir escribiendo después de borrar
                        onMouseDown={(e) => e.preventDefault()}
                        size='small'
                        sx={{
                            width: 26,
                            height: 26,
                            border: 'none',
                            borderRadius: '50%',
                            bgcolor: 'transparent',
                            color: 'text.secondary',
                            '&:hover': { bgcolor: 'action.hover', color: 'text.primary' },
                        }}
                    >
                        <CloseRoundedIcon sx={{ fontSize: 18 }}/>
                    </IconButton>
                </InputAdornment>
            ) : null
        }
        {...props}
    />
  )
}