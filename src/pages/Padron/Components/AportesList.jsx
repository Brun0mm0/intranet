import { Box, Typography, Stack, Chip, Dialog, CircularProgress, DialogTitle, DialogContent, IconButton } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import CircleIcon from '@mui/icons-material/Circle';
import { DataGrid } from "@mui/x-data-grid"

export const AportesList = ({rows, open, handleClose, loading}) => {

    const columns = [
        { field: 'Periodo', 
          headerName: 'Periodo', 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          renderCell: (params) => {
            const pendiente = params.row.APORTE;

            return (
            <Stack direction="row" alignItems="center" spacing={1}>
                <Typography>{params.row.Periodo}</Typography>
                {pendiente ? (
                <Chip label="OK" color="success" size="small" />
                ) : (
                <Chip label="Pendiente" color="warning" size="small" />
                )}
            </Stack>
            );
          }     
        },
        { field: 'Prestadora', headerName: 'Prestadora', flex: 1},
        { field: 'CUIL', headerName: 'CUIL', flex: 1},
        { field: 'CUIT', headerName: 'CUIT', flex: 1}
    ]

    const rowsConId = rows
    .map((row, index) => ({
        id: row.ID || index,
        ...row,
    }))

  return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogTitle>
                <Typography fontWeight={600} fontSize="1rem">
                    Aportes
                </Typography>
                <IconButton
                    edge="end"
                    onClick={handleClose}
                    sx={{ position: "absolute", right: 20, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                        <CircularProgress />
                    </Box>
                ) : rows.length === 0 ? (
                    <Stack alignItems="center" justifyContent="center" minHeight={200}>
                        <Typography>No hay aportes disponibles</Typography>
                    </Stack>
                ) : (
                    <Box>
                        <DataGrid
                            sx={{
                                "& .fila-activa": {
                                    backgroundColor: "rgba(189, 218, 177, 1)",
                                },
                                "& .fila-pendiente": {
                                    backgroundColor: "rgba(255, 233, 67, 1)",
                                },
                                "& .MuiDataGrid-row:hover": {
                                    backgroundColor: "inherit"
                                },
                                borderRadius: 2,
                            }}
                            columns={columns}
                            rows={rowsConId}
                            getRowClassName={(params) =>
                                params.row.APORTE ? "fila-activa" : "fila-pendiente"
                            }
                            disableRowSelectionOnClick
                        />
                        <Stack direction={"row"} spacing={2} marginTop={1} marginLeft={1}>
                            <Typography variant="subtitle2" padding={0.5} paddingRight={1} borderRadius={1} sx={{ display: "flex", alignItems: "center", gap: 1, bgcolor: "#f5f5f5" }}>
                                <CircleIcon
                                    fontSize="small"
                                    sx={{ color: "rgba(255, 233, 67, 1)" }}
                                />
                                Pendiente de pago
                            </Typography>
                            <Typography variant="subtitle2" padding={0.5} paddingRight={1} borderRadius={1} sx={{ display: "flex", alignItems: "center", gap: 1, bgcolor: "#f5f5f5" }}>
                                <CircleIcon
                                    fontSize="small"
                                    sx={{ color: "rgba(189, 218, 177, 1)" }}
                                />
                                Acreditado
                            </Typography>
                        </Stack>
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    )
}
