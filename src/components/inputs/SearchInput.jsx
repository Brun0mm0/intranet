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
                <InputAdornment position='end'>
                    <IconButton
                        aria-label='Limpiar'
                        onClick={handleClear}
                        edge='end'
                        size='small'
                    >
                        <CloseRoundedIcon fontSize='small'/>
                    </IconButton>
                </InputAdornment>
            ) : null
        }
        {...props}
    />
  )
}