import { useState } from 'react'

import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { Box, Stack, FormControl, InputLabel, MenuItem, Select, Button } from '@mui/material'
import dayjs from 'dayjs'

export const zonas = [
  { value: '', label: 'Seleccione una zona', disabled: true },
  { value: '0', label: 'Todo el Padron' },
  { value: '1', label: 'Caba' },
  { value: '101', label: 'GBA' },
  { value: '2', label: 'Zona Norte' },
  { value: '3', label: 'Zona Sur' },
  { value: '4', label: 'Zona Oeste' },
  { value: '5', label: 'Zona Oeste 2' },
  { value: '6', label: 'Zona GBA San Miguel' },
  { value: '7', label: 'BA Interior' },
  { value: '8', label: 'Catamarca' },
  { value: '9', label: 'Chaco' },
  { value: '10', label: 'Formosa' },
  { value: 'N', label: 'Misiones' },
  { value: 'W', label: 'Corrientes' },
  { value: 'X', label: 'Cordoba' },
  { value: 'E', label: 'Entre Rios' },
  { value: 'F', label: 'La Rioja' },
  { value: 'Y', label: 'Jujuy' },
  { value: 'A', label: 'Salta' },
  { value: 'S', label: 'Santa Fe' },
  { value: 'R', label: 'Rio Negro' },
  { value: '12', label: 'Patagonia' },
  { value: '14', label: 'Santiago Del Estero' },
  { value: '15', label: 'Tucuman' },
  { value: '18', label: 'San Luis' },
  { value: '19', label: 'San Juan' },
  { value: '100', label: 'Mendoza' },
  { value: '99', label: 'Padron sin Caba' },
  { value: '102', label: 'ECCO' },
  { value: '103', label: 'Empleados OSSSB' },
  { value: '104', label: 'La Lusidal' },
  { value: '105', label: 'Siaco' },
  { value: '106', label: 'S300J' },
  { value: '107', label: 'S300E' },
  { value: '108', label: 'Discapacidad' },
  { value: '201', label: 'Villa Salud' }
];

export const PadronSucursal = () => {
    const [fecha, setFecha] = useState(dayjs()) 
    const [zona, setZona] = useState('') 
  return (
    <Box>
        <Stack spacing={3} paddingY={3} direction={'column'} width={300}>
            <Stack bgcolor={'#fff'} borderRadius={1}>
            <DatePicker 
                label="Seleccione una Fecha"
                value={fecha}
                onChange={(newValue)=> setFecha(newValue)}
                format='DD/MM/YYYY'
                />
            </Stack>
            <FormControl 
                size='medium'
                fullWidth>
                <InputLabel id="zona-label">Seleccione una Zona</InputLabel>
            <Select
                labelId="zona-label"
                label=''
                value={zona}
                onChange={(e) => setZona(e.target.value)}
                >
                {zonas.map((zona) => (
                    <MenuItem
                    key={zona.value}
                    value={zona.value}
                    disabled={zona.disabled}
                    >
                    {zona.label}
                    </MenuItem>
                ))}
                </Select>
            </FormControl>
        <Stack>
            <Button variant='outlined'>Buscar</Button>
        </Stack>
        </Stack>
    </Box>
  )
}


//   <div>
//     <select class="form-select my-3" aria-label="Default select example" id="select">
//       <option value="" selected disabled>Seleccione una zona</option>
//       <option value="0">Todo el Padron</option>
//       <option value="1">Caba</option>
//       <option value="101">GBA</option>
//       <option value="2">Zona Norte</option>
//       <option value="3">Zona Sur</option>
//       <option value="4">Zona Oeste</option>
//       <option value="5">Zona Oeste 2</option>
//       <option value="6">Zona GBA San Miguel</option>
//       <option value="7">BA Interior</option>
//       <option value="8">Catamarca</option>
//       <option value="9">Chaco</option>
//       <option value="10">Formosa</option>
//       <option value="N">Misiones</option>
//       <option value="W">Corrientes</option>
//       <option value="X">Cordoba</option>
//       <option value="E">Entre Rios</option>
//       <option value="F">La Rioja</option>
//       <option value="Y">Jujuy</option>
//       <option value="A">Salta</option>
//       <option value="S">Santa Fe</option>
//       <option value="R">Rio Negro</option>
//       <option value="12">Patagonia</option>
//       <option value="14">Santiago Del Estero</option>
//       <option value="15">Tucuman</option>
//       <option value="18">San Luis</option>
//       <option value="19">San Juan</option>
//       <option value="100">Mendoza</option>
//       <option value="99">Padron sin Caba</option>
//       <option value="102">ECCO</option>
//       <option value="103">Empleados OSSSB</option>
//       <option value="104">La Lusidal</option>
//       <option value="105">Siaco</option>
//       <option value="106">S300J</option>
//       <option value="107">S300E</option>
//       <option value="108">Discapacidad</option>
//       <option value="201">Villa Salud</option>
//     </select>
//   </div>