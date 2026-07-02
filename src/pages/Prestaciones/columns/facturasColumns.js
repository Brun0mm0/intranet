import {
    parseDotDate, 
    parseIsoDate, 
    formatDate, 
    formatDateTime, 
    addDays, 
    formatCurrency
  } from '../../../utils/formatters'

const proveedorColumns = [
  {
    field: "PRV_CUIT",
    headerName: "CUIT",
    width: 130,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "PRV_RAZON_SOCIAL",
    headerName: "Razón Social",
    width: 240,
  },
];

const baseFacturasColumns = [
  {
    field: "CTE_TIPO",
    headerName: "Tipo",
    width: 40,
    headerAlign: "center",
    align: "center",
    valueFormatter: (value) => value?.toUpperCase() ?? "",
  },
  {
    field: "CTE_LETRA",
    headerName: "Letra",
    width: 40,
    headerAlign: "center",
    align: "center",
    valueFormatter: (value) => value?.toUpperCase() ?? "",
  },
  {
    field: "comprobante",
    headerName: "Nro. Factura",
    width: 150,
    valueGetter: (_, row) => `${row.CTE_PRENUMERO} - ${row.CTE_NUMERO}`,
  },
  {
    field: "CTE_CONCEPTO",
    headerName: "Descripción",
    flex: 1,
    type: "text",
  },
  {
    field: "LIN_IMPORTE_BASE",
    headerName: "Importe Base",
    flex: 0.5,
    type: "number",
    valueFormatter: (value) => formatCurrency(value),
  },
  {
    field: "CTE_IMPORTE_TOTAL",
    headerName: "Importe Total",
    flex: 0.5,
    type: "number",
    valueFormatter: (value) => formatCurrency(value),
  },
  {
    field: "FECHA_REGISTRO",
    headerName: "Fecha de registro TANGO",
    width: 150,
    align: "center",
    valueGetter: (_, row) => parseIsoDate(row.FECHA_REGISTRO),
    valueFormatter: (value) => formatDateTime(value),
  },
  {
    field: "fechaVencimiento",
    headerName: "Vencimiento de Factura",
    width: 150,
    align: "center",
    valueGetter: (_, row) => parseDotDate(row.CTE_FECHA_VTO),
    valueFormatter: (value) => formatDate(value),
  },
];

export const getFacturasColumns = (searchParam) => {
  if (searchParam === "numero_factura") {
    return [
      ...proveedorColumns,
      ...baseFacturasColumns,
    ];
  }

  return baseFacturasColumns;
};

// [
// 	{
// 		"ID": 135665,
// 		"CTE_ID_TANGO": 997082,
// 		"CTE_TIPO": "NC",
// 		"CTE_LETRA": "B",
// 		"CTE_FECHA": "10.04.2026",
// 		"CTE_FECHA_RECEP": "10.04.2026",
// 		"CTE_FECHA_CONTAB": "10.04.2026",
// 		"CTE_FECHA_VTO": "01.01.1800",
// 		"CTE_CONCEPTO": "CONCILIACIÓN CUENTA",
// 		"CTE_MES_LIQ": 3,
// 		"CTE_ANIO_LIQ": 2026,
// 		"CTE_PRENUMERO": "00004",
// 		"CTE_NUMERO": "00001138",
// 		"CTE_IMPORTE_TOTAL": 2808.96,
// 		"PRV_CUIT": "27-13431605-0",
// 		"PRV_RAZON_SOCIAL": "PIERI MARIA CRISTINA ADA",
// 		"PRV_NOMBRE": "PIERI MARIA CRISTINA ADA",
// 		"PRV_DIR": "CARACAS 2619",
// 		"PRV_PROVINCIA_ID": "V",
// 		"PRV_LOCALIDAD": "",
// 		"PRV_CODPOSTAL": "1417",
// 		"PRV_TEL": "",
// 		"PRV_CATIVA_ID": "RI",
// 		"PRV_ID_TANGO": "D00142",
// 		"LIN_CTABLE_ID": {
// 			"source": "520706000.0",
// 			"parsedValue": 520706000
// 		},
// 		"LIN_NROLINEA": 1,
// 		"LIN_TIPO_PRESTACION_ID": "992",
// 		"LIN_CCOSTOS_ID": "0300",
// 		"LIN_IMPORTE_BASE": 2808.96,
// 		"LIN_IIBB_PROV": null,
// 		"LIN_IBB_CABA": null,
// 		"FECHA_REGISTRO": "2026-04-10T17:21:56.397000",
// 		"ANULADO": null
// 	},
// 	{
// 		"ID": 135847,
// 		"CTE_ID_TANGO": 997291,
// 		"CTE_TIPO": "NC",
// 		"CTE_LETRA": "b",
// 		"CTE_FECHA": "13.04.2026",
// 		"CTE_FECHA_RECEP": "13.04.2026",
// 		"CTE_FECHA_CONTAB": "13.04.2026",
// 		"CTE_FECHA_VTO": "01.01.1800",
// 		"CTE_CONCEPTO": "CONCILIACIÓN DE CUENTA",
// 		"CTE_MES_LIQ": 3,
// 		"CTE_ANIO_LIQ": 2026,
// 		"CTE_PRENUMERO": "00004",
// 		"CTE_NUMERO": "00000918",
// 		"CTE_IMPORTE_TOTAL": 1404.48,
// 		"PRV_CUIT": "27-13431605-0",
// 		"PRV_RAZON_SOCIAL": "PIERI MARIA CRISTINA ADA",
// 		"PRV_NOMBRE": "PIERI MARIA CRISTINA ADA",
// 		"PRV_DIR": "CARACAS 2619",
// 		"PRV_PROVINCIA_ID": "V",
// 		"PRV_LOCALIDAD": "",
// 		"PRV_CODPOSTAL": "1417",
// 		"PRV_TEL": "",
// 		"PRV_CATIVA_ID": "RI",
// 		"PRV_ID_TANGO": "D00142",
// 		"LIN_CTABLE_ID": {
// 			"source": "520706000.0",
// 			"parsedValue": 520706000
// 		},
// 		"LIN_NROLINEA": 1,
// 		"LIN_TIPO_PRESTACION_ID": "992",
// 		"LIN_CCOSTOS_ID": "0300",
// 		"LIN_IMPORTE_BASE": 1404.48,
// 		"LIN_IIBB_PROV": null,
// 		"LIN_IBB_CABA": null,
// 		"FECHA_REGISTRO": "2026-04-13T13:20:20.793000",
// 		"ANULADO": null
// 	}
// ]